#!/usr/bin/env python3
"""
生成压缩字体到 src/assets/fonts/。

字体来源(均为 SIL OFL 1.1, 可自由再分发/嵌入/修改):
- Resource Han Rounded CN: Windows 侧 C:\\Data\\Filen\\数据备份\\字体常用\\ResourceHanRoundedCN
- Code New Roman:          Windows 侧 C:\\Data\\Filen\\数据备份\\字体常用\\codeNewRoman

压缩策略:
- 中文: 子集化到 GB2312 一级(3849 字) + 项目 UI 静态用字 + 常用标点, 转 WOFF2 (Brotli)。
  GB2312 一级覆盖 99.7% 现代中文, 体积 14MB → ~600KB。
- 英文: Code New Roman 保留全部可打印 ASCII + Latin-1, 转 WOFF2 (337KB → ~14KB)。

用法:
  python3 scripts/fonts-subset/build-fonts.py [--src-dir ~/.local/share/fonts] [--out-dir src/assets/fonts]
依赖: fonttools (pip install fonttools brotli)
"""
import argparse
import glob
import os
import sys

# 让本机 fontTools 可导入(装在系统 python)
sys.path.insert(0, os.path.expanduser('~/.local/lib/python3.11/site-packages'))

from fontTools.subset import main as pyftsubset_main  # noqa: E402


def gb2312_level1() -> set[str]:
    """GB2312 一级汉字(区位 16-55, 3755 字)。"""
    chars: set[str] = set()
    for qu in range(16, 56):
        for wei in range(1, 95):
            b1, b2 = 0xA0 + qu, 0xA0 + wei
            try:
                s = bytes([b1, b2]).decode('gb2312')
                if s and len(s) == 1 and '\u4e00' <= s <= '\u9fff':
                    chars.add(s)
            except UnicodeDecodeError:
                pass
    return chars


def project_static_chars(root: str) -> set[str]:
    """项目 UI 静态用到的中文字符 + 常用标点(源码/文案/README)。"""
    texts: list[str] = []
    pats = ['src/**/*.tsx', 'src/**/*.ts', 'src/**/*.css', 'index.html', 'README.md']
    for pat in pats:
        for f in glob.glob(os.path.join(root, pat), recursive=True):
            if 'node_modules' in f or 'dist' in f:
                continue
            try:
                texts.append(open(f, encoding='utf-8', errors='ignore').read())
            except OSError:
                pass
    chars = set(''.join(texts))
    cjk = {c for c in chars if '\u4e00' <= c <= '\u9fff' or '\u3400' <= c <= '\u4dbf'}
    punct = {c for c in chars if 0x3000 <= ord(c) <= 0x303f or c in '，。！？：；、（）《》「」『』·—…“”‘’'}
    return cjk | punct


def latin_text() -> str:
    """Code New Roman 保留: 可打印 ASCII + Latin-1 补充。"""
    return ''.join(chr(c) for c in range(0x20, 0x7F)) + ''.join(chr(c) for c in range(0xA0, 0x100))


def subset(src: str, out: str, text: str) -> None:
    args = [src, f'--output-file={out}', '--flavor=woff2', f'--text={text}',
            '--layout-features=*', '--no-hinting', '--no-desubroutinize']
    old = sys.argv
    sys.argv = ['pyftsubset'] + args
    try:
        pyftsubset_main()
    except SystemExit:
        pass
    sys.argv = old


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--src-dir', default=os.path.expanduser('~/.local/share/fonts'))
    ap.add_argument('--out-dir', default=os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'assets', 'fonts'))
    args = ap.parse_args()

    out_dir = os.path.abspath(args.out_dir)
    os.makedirs(out_dir, exist_ok=True)

    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    ui_chars = project_static_chars(project_root)
    chinese_set = gb2312_level1() | ui_chars

    # 中文
    src_han = os.path.join(args.src_dir, 'ResourceHanRoundedCN-Regular.ttf')
    src_han_bold = os.path.join(args.src_dir, 'ResourceHanRoundedCN-Bold.ttf')
    # 英文
    src_en = os.path.join(args.src_dir, 'Code New Roman.otf')

    han_text = ''.join(sorted(chinese_set))
    en_text = latin_text()

    subset(src_han, os.path.join(out_dir, 'han-rounded.woff2'), han_text)
    if os.path.exists(src_han_bold):
        subset(src_han_bold, os.path.join(out_dir, 'han-rounded-bold.woff2'), han_text)
    subset(src_en, os.path.join(out_dir, 'code-new-roman.woff2'), en_text)

    for f in sorted(os.listdir(out_dir)):
        if f.endswith('.woff2'):
            print(f'  {f}: {os.path.getsize(os.path.join(out_dir, f)) // 1024} KB')


if __name__ == '__main__':
    main()
