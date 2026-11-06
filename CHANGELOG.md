# 更新日志

## Unreleased

### Added

- 可控去重：标题相似项不再自动删除，改为人工审阅建议；支持切换保留项、恢复整组、批量删除与全局撤销
- 搜索结果返回完整命中集（不再截断 50 条），并支持在结果中直接删除单条书签
- 导入空书签文件时明确报错，成功提示包含实际解析到的书签数量
- 去重页重做为可操作审阅界面：完全重复与疑似重复分区展示，顶部导航显示待审阅组数
- 修复生产构建中自托管字体路径错误导致的字体 404
- 基于域名规则的自动分类（AI/编程/学习/社区/资讯/娱乐/工具/生物/其他）
- Dashboard 新增分类分布图表
- 自动分类工具模块 `utils/classify.ts`

### Changed

- 取消归档状态，恢复主动维护
- 修复在线演示 URL（lessup.github.io -> build-workbench 仓库）
- README 重写，聚焦隐私优先定位，更新功能概览
- BookmarkStats 类型新增 byCategory 字段，贯通 Worker 管道
- 彻底轻量化重构：删除 openspec、.claude、docs、screenshots、types 等过程/工具开销
- 路径别名从 7 个精简为 1 个（仅保留 `@/`），删除 6 个零使用别名
- DB schema 从 4 个版本折叠为单版本（移除已废弃的 aiCache/aiUsage/cleanupSessions 等表）
- 删除零引用的 barrel 文件（store/index.ts、ai/index.ts）
- 消除 detectBrowserLanguage 重复定义
- exportFormats 从独立 constants/ 目录移入 utils/exporters/
- PWA manifest 移除不存在的 PNG 图标引用，仅保留 SVG favicon
- CI 与部署工作流合并为单一 pages.yml
- README 重写为自包含文档，新增 MIT LICENSE 文件
- .gitignore 和 .vscode 配置清理

## 1.1.0 - 2026-04-15

### Added

- 多格式导出（HTML、JSON、CSV、Markdown）
- 本地数据备份与恢复页面
- 面向大数据量的 Worker 处理支持
- 清理工作流与更完整的 AI 分析界面

### Changed

- 搜索与仪表盘性能优化
- 为公开发布补齐文档与落地页基础

## 1.0.0 - 2026-03-22

### Added

- GitHub Pages 部署
- 基于 HashRouter 的 SPA 路由
- 本地优先的书签导入、合并、去重、搜索与导出基础能力
