export default {
  // App Header Navigation
  'nav.upload': '上传合并',
  'nav.dashboard': '仪表盘',
  'nav.search': '搜索',
  'nav.duplicates': '去重',
  'nav.ai': 'AI',
  'nav.backup': '备份',

  // Theme
  'theme.light': '浅色模式',
  'theme.dark': '深色模式',
  'theme.auto': '跟随系统',

  // Common
  'common.loading': '加载中...',
  'common.error': '发生错误',
  'common.success': '成功',
  'common.cancel': '取消',
  'common.confirm': '确认',
  'common.save': '保存',
  'common.export': '导出',
  'common.import': '导入',
  'common.yes': '有',
  'common.no': '无',
  'common.unknownError': '未知错误',
  'common.undo': '撤销',
  'common.close': '关闭',

  // Upload & Merge Page
  'upload.title': '上传合并',
  'upload.dropzone': '拖拽书签文件到此处，或点击选择文件',
  'upload.supportedFormats': '支持 Chrome、Firefox、Edge、Safari 导出的 Netscape Bookmark 格式',
  'upload.bookmarkCount': '{count} 条书签',
  'upload.importFailed': '导入文件失败: {error}',
  'upload.importFirst': '请先导入书签文件',
  'upload.mergeComplete': '合并完成！数据已保存到本地数据库',
  'upload.mergeFailed': '合并失败',
  'upload.exportSuccess': '已导出为 {format} 格式',
  'upload.exportFailed': '导出失败',
  'upload.fileRemoved': '已移除文件：{name}',
  'upload.rawItemsLabel': '当前导入会话中的总书签数',
  'upload.noRawItems': '当前没有活动中的原始导入会话',
  'upload.mergedItemsLabel': '去重后的书签数',
  'upload.restoredLabel': '从本地恢复的上次合并结果',
  'upload.duplicatesLabel': '检测到的完全重复组',
  'upload.duplicatesUnavailable': '仅完整合并后可用',

  // Dashboard Page
  'dashboard.title': '仪表盘',
  'dashboard.deduplicated': '去重后',
  'dashboard.duplicates': '完全重复',
  'dashboard.needsMerge': '当前导入会话已变更，仪表盘统计已失效',
  'dashboard.needsMergeHint': '请先回到"上传合并"重新执行合并去重',
  'dashboard.restoredWarning':
    '当前显示的是从本地数据库恢复的合并快照。基础统计可用，但重复簇相关信息不代表上一次完整导入会话的全部结果。',
  'dashboard.totalBookmarks': '书签总量',
  'dashboard.duplicateCount': '完全重复数量',
  'dashboard.domainCount': '域名数',
  'dashboard.duplicateRatio': '完全重复占比',
  'dashboard.topDomains': 'Top 10 域名',
  'dashboard.byYear': '按年份新增',
  'dashboard.byCategory': '分类分布',
  'dashboard.chart.categoryAria': '书签分类分布柱状图',
  'dashboard.bookmarkList': '书签列表',
  'dashboard.loadMore': '加载更多',
  'dashboard.items': '条',
  'dashboard.chart.pieAria': '书签重复占比饼图',
  'dashboard.chart.barAria': '书签域名分布柱状图',
  'dashboard.chart.lineAria': '书签按年份新增趋势图',
  'dashboard.chart.listAria': '书签列表',

  // Search Page
  'search.title': '搜索',
  'search.placeholder': '搜索书签...',
  'search.noResults': '没有找到匹配的书签',
  'search.noExport': '没有可导出的书签',
  'search.exportSuccess': '已导出为 {format} 格式',
  'search.exportFailed': '导出失败',
  'search.noFolder': '(无目录)',

  // Duplicates Page
  'duplicates.title': '去重',
  'duplicates.empty': '暂无重复书签',
  'duplicates.source': '来源: {source}',

  // AI Page
  'ai.title': 'AI 设置',
  'ai.configSaved': '配置已保存',
  'ai.saveFailed': '保存失败',
  'ai.testing': '正在测试连接...',
  'ai.connected': '连接成功！',

  // Backup Page
  'backup.title': '备份',
  'backup.create': '创建备份',
  'backup.restore': '从备份恢复',
  'backup.creating': '正在创建备份...',
  'backup.restoring': '正在恢复...',
  'backup.success': '备份成功！文件大小: {size}',
  'backup.failed': '备份失败: {error}',
  'backup.parseFailed': '备份文件解析失败',
  'backup.confirmRestore': '确定要恢复以下数据吗？',
  'backup.warning': '⚠️ 这将替换当前所有数据！',
  'backup.restoreSuccess': '恢复成功！书签: {count} 条{aiConfig}',
  'backup.aiConfigRestored': '，AI 配置已恢复',
  'backup.restoreFailed': '恢复失败: {error}',
  'backup.aiConfigLabel': 'AI配置',

  // Export Formats
  'export.html': 'HTML',
  'export.json': 'JSON',
  'export.csv': 'CSV',
  'export.markdown': 'Markdown',
  'export.htmlDesc': '浏览器兼容格式',
  'export.jsonDesc': '结构化数据',
  'export.csvDesc': '表格格式',
  'export.markdownDesc': '文档格式',

  // Landing Page - Hero
  'hero.title': 'Bookmarks Manager',
  'hero.subtitle': '本地优先的书签整理工具',
  'hero.description': '导入、去重、搜索、分析、导出浏览器书签，一切在本地完成，隐私优先',
  'hero.getStarted': '立即开始',
  'hero.viewDemo': '在线演示',
  'hero.stats.total': '书签总数',
  'hero.stats.duplicates': '重复项目',
  'hero.stats.domains': '域名数量',
  'hero.stats.trend': '书签增长趋势',
  'hero.badge': '完全免费 & 开源',
  'hero.headline': '整理你的',
  'hero.headlineHighlight': '数字书签库',
  'hero.github': 'GitHub 开源',
  'hero.trust.local': '100% 本地处理',
  'hero.trust.noSignup': '无需注册',
  'hero.trust.pwa': 'PWA 支持',
  'hero.preview.upload': '上传合并',
  'hero.preview.backup': '本地备份',
  'hero.preview.processed': '本地处理完成',
  'hero.preview.restore': '本地备份恢复',
  'hero.scrollHint': '向下滚动了解更多',

  // Landing Page - Features
  'features.badge': '核心功能',
  'features.title': '一站式书签清理与管理',
  'features.subtitle': '从导入、去重到搜索、备份与导出，覆盖完整的本地书签整理流程',
  'features.smartMerge.title': '智能合并',
  'features.smartMerge.desc':
    '支持 Chrome、Firefox、Edge、Safari 等多浏览器书签文件一键导入，自动识别并合并重复文件夹结构。',
  'features.smartDedup.title': '智能去重',
  'features.smartDedup.desc':
    'URL 规范化算法自动合并完全重复项并保留最早添加的版本；标题相似项只做提示，不会自动删除，确认后再处理。',
  'features.search.title': '全文搜索',
  'features.search.desc':
    '基于 MiniSearch 的高性能搜索引擎，支持标题、URL、文件夹路径全文检索，模糊匹配，毫秒级响应。',
  'features.ai.title': 'AI 可选配置',
  'features.ai.desc':
    '按需接入 OpenAI、Claude 等模型，仅保留自备 Key 的本地配置与连接测试。默认不上传任何数据。',
  'features.stats.title': '可视化统计',
  'features.stats.desc':
    'ECharts 驱动的本地统计视图，展示域名分布、时间趋势和重复占比，帮助你快速判断整理结果。',
  'features.privacy.title': '隐私优先',
  'features.privacy.desc':
    '所有处理在浏览器本地完成，IndexedDB 存储，不上传任何数据。开源代码可审计，真正掌控你的数据。',
  'features.learnMore': '了解更多',
  'features.privacyNote': '所有数据在本地处理，',
  'features.privacyHighlight': '永不上传到服务器',

  // Landing Page - How It Works
  'howItWorks.title': '使用教程',
  'howItWorks.badge': '简单三步',
  'howItWorks.subtitle': '轻松整理你的书签',
  'howItWorks.step1.title': '导入书签',
  'howItWorks.step1.desc':
    '从 Chrome、Firefox、Edge、Safari 导出书签文件，支持拖拽上传或点击选择，可同时导入多个文件。',
  'howItWorks.step1.description':
    '从 Chrome、Firefox、Edge、Safari 导出书签文件，支持拖拽上传或点击选择，可同时导入多个文件。',
  'howItWorks.step1.f1': '多浏览器兼容',
  'howItWorks.step1.feature1': '多浏览器兼容',
  'howItWorks.step1.f2': '批量导入',
  'howItWorks.step1.feature2': '批量导入',
  'howItWorks.step1.f3': '拖拽上传',
  'howItWorks.step1.feature3': '拖拽上传',
  'howItWorks.step2.title': '合并去重',
  'howItWorks.step2.desc':
    '系统自动合并重复文件夹并处理完全重复项；疑似重复由你确认，删除后仍可撤销。',
  'howItWorks.step2.description':
    '系统自动合并重复文件夹并处理完全重复项；疑似重复由你确认，删除后仍可撤销。',
  'howItWorks.step2.f1': '自动去重',
  'howItWorks.step2.feature1': '自动去重',
  'howItWorks.step2.f2': '重复概览',
  'howItWorks.step2.feature2': '重复概览',
  'howItWorks.step2.f3': '本地搜索',
  'howItWorks.step2.feature3': '本地搜索',
  'howItWorks.step3.title': '导出整理',
  'howItWorks.step3.desc':
    '将整理后的书签导出为标准 HTML 格式，支持导入回任何浏览器。也可导出 JSON、CSV 用于备份。',
  'howItWorks.step3.description':
    '将整理后的书签导出为标准 HTML 格式，支持导入回任何浏览器。也可导出 JSON、CSV 用于备份。',
  'howItWorks.step3.f1': '标准格式',
  'howItWorks.step3.feature1': '标准格式',
  'howItWorks.step3.f2': '多格式导出',
  'howItWorks.step3.feature2': '多格式导出',
  'howItWorks.step3.f3': '随时恢复',
  'howItWorks.step3.feature3': '随时恢复',
  'howItWorks.bottomNote': '整个过程在本地完成，无需上传任何数据。上传书签 → 一键合并 → 即刻出结果',

  // Landing Page - FAQ
  'faq.title': '常见问题',
  'faq.badge': '常见问题',
  'faq.heading': '还有疑问？',
  'faq.subtitle': '以下是用户最常问的问题',
  'faq.githubIssue': '在 GitHub 上提交 Issue',
  'faq.q1': '我的书签数据会上传到服务器吗？',
  'faq.a1':
    '绝对不会。Bookmarks Manager 是一款纯本地应用，所有书签文件的处理都在你的浏览器中完成。我们使用 IndexedDB 在本地存储数据，没有任何后端服务器，你的书签永远不会离开你的设备。',
  'faq.q2': '支持哪些浏览器导出的书签文件？',
  'faq.a2':
    '支持所有主流浏览器的标准 Netscape Bookmark HTML 格式导出，包括 Chrome、Firefox、Edge、Safari、Brave、Opera 等。只需在浏览器中导出书签到 HTML 文件，然后拖拽上传到本工具即可。',
  'faq.q3': 'AI 功能如何使用？是否需要付费？',
  'faq.a3':
    '当前只保留可选的 AI 配置与连接测试能力。你可以自行提供 OpenAI 或 Claude API Key，配置仅保存在浏览器本地。工具本身不会代管密钥，也不会把你的书签上传到任何仓库控制的服务。',
  'faq.q4': '去重算法是如何工作的？',
  'faq.a4':
    '处理前会统一 URL 的协议、主机名大小写、追踪参数、末尾斜杠和查询参数顺序。规范化后完全相同的 URL 会自动合并并保留最早添加的版本；同一域名下标题相似的书签只会列为待确认建议，绝不会自动删除。',
  'faq.q5': '整理后的书签可以导回浏览器吗？',
  'faq.a5':
    '当然可以。我们导出的是标准书签 HTML 格式，可以在任何浏览器的书签管理器中导入。只需点击 "导出" 按钮生成整理后的 HTML 文件，然后在目标浏览器中选择 "导入书签" 即可。',
  'faq.q6': 'PWA 离线功能如何使用？',
  'faq.a6':
    '首次访问后，应用会自动缓存到本地。你可以将网站添加到主屏幕（Chrome/Edge 点击地址栏安装图标，Safari 使用"添加到主屏幕"），之后即使离线也能打开和使用大部分功能。',
  'faq.more': '还有其他问题？',

  // Landing Page - Footer
  'footer.product': '产品',
  'footer.getStarted': '立即使用',
  'footer.features': '功能介绍',
  'footer.tutorial': '使用教程',
  'footer.resources': '资源',
  'footer.github': 'GitHub 仓库',
  'footer.demo': '在线演示',
  'footer.feedback': '问题反馈',
  'footer.license': 'MIT 开源协议',
  'footer.docs': '使用文档',
  'footer.madeWith': '用 ❤️ 构建，保护你的隐私',
  'footer.copyright': '© 2024 Bookmarks Manager. 保留所有权利。',
  'footer.cta.title': '准备好清理你的书签了吗？',
  'footer.cta.description': '开始使用 Bookmarks Manager，轻松整理你的数字书签库',
  'footer.cta.button': '免费开始使用',
  'footer.brand.description': '本地优先的书签管理工具，隐私保护，完全免费',
  'footer.links.startNow': '立即使用',
  'footer.links.features': '功能介绍',
  'footer.links.tutorial': '使用教程',
  'footer.links.github': 'GitHub 仓库',
  'footer.links.demo': '在线演示',
  'footer.links.feedback': '问题反馈',
  'footer.links.mitLicense': 'MIT 开源协议',
  'footer.links.documentation': '使用文档',

  // Undo
  'undo.message': '可撤销：{action}',
  'undo.button': '撤销',
  'undo.dismiss': '关闭',

  // Error Boundary
  'error.title': '出错了',
  'error.message': '发生了未知错误',
  'error.retry': '重试',

  // ARIA labels
  'aria.mainNav': '主导航',
  'aria.themeSwitch': '主题切换',
  'aria.list': '列表',
  'aria.chart': '图表',

  // Alert messages
  'alert.needsMerge':
    '当前导入会话已变更，旧的统计、搜索结果和导出内容已失效。请前往"上传合并"重新合并去重。',
  'alert.goMerge': '去合并',

  // Search Page - Extended
  'search.needsMerge': '当前导入会话已变更，搜索索引已失效',
  'search.needsMergeHint': '请先回到"上传合并"重新执行合并去重',
  'search.placeholderFull': '搜索书签标题、URL或目录...',
  'search.advancedFilter': '高级过滤（可与搜索组合）',
  'search.reset': '重置',
  'search.domain': '域名',
  'search.allDomains': '全部域名',
  'search.rootFolder': '目录（一级）',
  'search.allFolders': '全部目录',
  'search.folderKeyword': '目录关键字（包含匹配）',
  'search.folderKeywordPlaceholder': '例如：开发 / AI / 阅读',
  'search.dateStart': '开始日期',
  'search.dateEnd': '结束日期',
  'search.export': '导出',
  'search.currentResults': '当前结果',
  'search.all': '全量',
  'search.preserveFolder': '保留目录结构',
  'search.exportButton': '导出 {format}',
  'search.importFirst': '请先在"上传合并"页面导入书签',
  'search.noMatch': '未找到匹配的书签',
  'search.found': '找到 {count} 条结果',
  'search.searchHits': '（搜索命中 {count}）',
  'search.loadMore': '加载更多（{count} 条）',
  'search.exportedAs': '已导出为 {format} 格式',
  'search.clear': '清空搜索',
  'search.delete': '删除此书签',
  'search.deleteConfirm': '确定删除“{title}”吗？删除后可在页面顶部撤销。',
  'search.deleteFailed': '删除失败，请重试',

  // Backup Page - Extended
  'backup.pageTitle': '数据备份与恢复',
  'backup.description':
    '备份功能可以将您的书签数据与可选 AI 配置导出为一个 JSON 文件。您可以使用该文件在另一台设备上恢复数据，或作为数据归档。',
  'backup.localNote': '注意：所有数据都在本地处理，不会上传到任何服务器。',
  'backup.options': '备份选项',
  'backup.bookmarkData': '书签数据',
  'backup.aiConfigData': 'AI 配置（API密钥等）',
  'backup.estimatedSize': '预计备份大小',
  'backup.bookmarkCount': '书签: {count} 条',
  'backup.faq.title': '常见问题',
  'backup.faq.q1': '备份文件包含什么？',
  'backup.faq.a1':
    '备份文件是一个 JSON 格式的文本文件，包含您选择的书签数据，以及可选的 AI 配置。您可以用文本编辑器查看其内容。',
  'backup.faq.q2': '如何迁移到另一台设备？',
  'backup.faq.a2':
    '在旧设备上创建备份并下载 JSON 文件，然后在新设备上打开此应用，进入备份页面选择"从备份恢复"即可。',
  'backup.faq.q3': 'API密钥安全吗？',
  'backup.faq.a3':
    '是的。备份文件存储在您的本地设备上，不会上传到任何服务器。建议您妥善保管备份文件，因为其中可能包含敏感的 API 密钥。',

  // Duplicates Page - Extended
  'duplicates.needsMerge': '当前导入会话已变更，重复簇结果已失效',
  'duplicates.needsMergeHint': '请先回到"上传合并"重新执行合并去重',
  'duplicates.noFullMergeData': '当前只恢复了上次合并快照，未保留重复簇明细',
  'duplicates.noFullMergeDataHint': '如需查看重复簇，请重新导入原始书签并执行合并去重',
  'duplicates.clusterTitle': '重复书签簇',
  'duplicates.groupCount': '{count} 组重复',
  'duplicates.noDuplicatesHint': '请先在"上传合并"页面进行合并去重',
  'duplicates.cluster': '重复组 #{index} ({count} 个副本)',
  'duplicates.keep': '保留',
  'duplicates.reviewTitle': '去重审阅',
  'duplicates.reviewHint': '完全重复默认保留一条；疑似重复只做提示，不会自动删除。所有删除操作都可以撤销。',
  'duplicates.exactCount': '{groups} 组完全重复 · 可删除 {items} 条',
  'duplicates.similarCount': '{groups} 组疑似重复 · {items} 条待确认',
  'duplicates.exactTitle': '完全重复',
  'duplicates.exactHint': '规范化 URL 相同，默认保留最早添加的一条；你可以改用另一条或恢复整组。',
  'duplicates.similarTitle': '疑似重复（标题相似）',
  'duplicates.similarHint': '同一域名下标题高度相似，但 URL 不同。系统不会自动删除，请人工确认后处理。',
  'duplicates.similarGroup': '相似组 #{index}',
  'duplicates.similarScore': '相似度 {score}%',
  'duplicates.setKeep': '改用此条',
  'duplicates.restoreGroup': '恢复整组',
  'duplicates.restoredGroup': '已恢复 {count} 条重复书签',
  'duplicates.swappedKeep': '已切换保留项',
  'duplicates.removedCount': '已删除 {count} 条书签',
  'duplicates.similarRemoved': '已删除 {count} 条疑似重复书签',
  'duplicates.similarDismissed': '已忽略一组疑似重复',
  'duplicates.dismissGroup': '保留全部',
  'duplicates.selectAll': '全选',
  'duplicates.clearSelection': '取消选择',
  'duplicates.deleteSelected': '删除选中 ({count})',
  'duplicates.deleteConfirm': '确定删除选中的 {count} 条书签吗？删除后可在页面顶部撤销。',
  'duplicates.noExact': '没有完全重复的 URL',
  'duplicates.noSimilar': '没有需要人工确认的相似标题',
  'duplicates.actionFailed': '操作失败: {error}',


  // Upload & Merge Page - Extended
  'upload.selectFiles': '选择导出的书签 HTML 文件，支持多选',
  'upload.dragOrClick': '点击选择文件或拖拽到此处',
  'upload.importSessionFiles': '当前导入会话中的文件',
  'upload.bookmarkCountShort': '{count} 条书签',
  'upload.remove': '移除',
  'upload.restoredHint':
    '已从本地数据库恢复上一次的合并结果，共 {count} 条书签。再次导入文件时会与这些书签一起合并，不会覆盖本地数据。',
  'upload.needsMergeWarning':
    '当前导入会话已发生变更，旧的合并结果、搜索索引和重复簇已失效。请点击"合并去重"重新生成最新结果。',
  'upload.rawItems': '原始条目',
  'upload.mergedItems': '合并后',
  'upload.duplicateItems': '完全重复',
  'upload.mergeButton': '合并去重',
  'upload.exportButton': '导出 {format}',
  'upload.clearButton': '清空',
  'upload.clearConfirm': '确定清空本地数据库中的全部书签吗？此操作不可撤销。',
  'upload.invalidFiles': '未检测到有效的 HTML 书签文件。请确保文件扩展名为 .html 或 .htm',
  'upload.rejectedFiles': '（{names}{more} 格式不支持）',
  'upload.importSuccess': '成功导入 {count} 个文件，共 {bookmarks} 条书签',
  'upload.importPartialSuccess': '成功导入 {accepted} 个文件（跳过 {rejected} 个非 HTML 文件），共 {bookmarks} 条书签',
  'upload.noBookmarksFound': '文件中没有解析到书签，请确认这是浏览器导出的书签 HTML 文件',

  // AI Page - Extended
  'ai.pageTitle': 'AI 可选配置',
  'ai.description':
    'Bookmarks Manager 的核心工作流不依赖 AI。这里仅保留本地 BYOK 配置与连接测试，所有密钥和设置都只存储在当前浏览器中。',

  // Error Boundary - Extended
  'error.pageLoadFailed': '页面加载失败',
  'error.componentLoadFailed': '组件加载失败',
  'error.checkNetwork': '请检查网络连接后刷新页面重试',
  'error.refreshPage': '刷新页面',

  // Dashboard - Extended
  'dashboard.chart.pieDescription': '去重后 {total} 条，完全重复 {duplicates} 条',
  'dashboard.chart.barDescription': 'Top 10 域名: {domains}',
  'dashboard.chart.lineDescription': '按年份新增: {years}',
  'dashboard.folderLabel': '目录: {path}',

  // AI Settings - Extended
  'ai.loadingConfig': '加载配置中...',
  'ai.configTitle': 'AI 配置',
  'ai.provider': '服务提供商',
  'ai.customEndpoint': '自定义端点',
  'ai.apiKeyPlaceholder': '输入你的 API Key',
  'ai.apiKeyHint': 'API Key 安全存储在本地 IndexedDB 中，不会上传到任何服务器',
  'ai.endpointUrl': 'API 端点 URL',
  'ai.model': '模型',
  'ai.modelPlaceholder': '输入模型名称',
  'ai.maxTokens': '最大输出 Tokens',
  'ai.testConnection': '测试连接',
  'ai.saveConfig': '保存配置',

  // Virtual List
  'virtualList.noData': '暂无数据',

  // Worker
  'worker.parseFailed': '解析 {file} 失败: {error}',
  'worker.normalizing': '正在归一化 URL...',
  'worker.computingDuplicates': '正在计算重复簇...',

  // AI Store
  'ai.notConfigured': '未配置 API',
  'ai.invalidApiKey': 'API Key 无效',
  'ai.connectionFailed': '连接测试失败',

  // Backup util
  'backup.invalidFormat': '备份数据格式无效',

  // Stage messages
  'stage.importing': '正在导入与解析...',
  'stage.parsing': '正在解析 {file} ({current}/{total})...',
  'stage.merging': '正在合并去重...',
  'stage.workerProcessing': 'Worker 正在处理...',
  'stage.normalizing': '正在归一化 URL...',
  'stage.computingDuplicates': '正在计算重复簇...',
  'stage.saving': '正在保存到本地数据库...',
  'stage.buildingIndex': '正在构建搜索索引...',
  'stage.workerFallback': 'Worker 失败，切换到主线程处理...',
  'stage.computingClusters': '正在计算重复簇与保留项...',
  'stage.generatingStats': '正在生成统计数据...',
  'stage.restoring': '正在从本地数据库恢复数据...',
  'stage.clearing': '正在清空本地数据...',

  // Backup validation
  'backup.validation.invalidFormat': '备份数据格式无效',
  'backup.validation.unsupportedVersion': '不支持的备份版本: {version}',
  'backup.validation.invalidBookmarks': '书签数据格式无效',
  'backup.validation.incompleteBookmark': '书签数据不完整',
  'backup.jsonParseFailed': 'JSON 解析失败，文件可能已损坏',

  // Worker stage
  'stage.parsingWorker': '正在解析 {file} ({current}/{total})... (Worker)',
  'stage.buildingIndexWorker': 'Worker 正在构建搜索索引...'
} as const
