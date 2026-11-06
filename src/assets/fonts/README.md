# 自托管字体

| 文件 | 字体 | 来源 | 体积 |
| --- | --- | --- | --- |
| `han-rounded.woff2` | Resource Han Rounded CN Regular (子集) | Cyano Hao / Adobe (SIL OFL 1.1) | ~584 KB |
| `han-rounded-bold.woff2` | Resource Han Rounded CN Bold (子集) | Cyano Hao / Adobe (SIL OFL 1.1) | ~598 KB |
| `code-new-roman.woff2` | Code New Roman (子集) | SamRadian (SIL OFL 1.1) | ~15 KB |

- **子集策略**: 中文取 GB2312 一级 3755 字 + 项目 UI 静态用字 + 常用标点; 英文取全部可打印 ASCII + Latin-1。极生僻汉字回退系统字体。
- **重新生成**: `python3 scripts/fonts-subset/build-fonts.py`(需 fonttools)。
- **许可**: 见 `LICENSE-OFL.txt`。
