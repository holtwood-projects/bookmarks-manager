export default {
  // App Header Navigation
  'nav.upload': 'Upload & Merge',
  'nav.dashboard': 'Dashboard',
  'nav.search': 'Search',
  'nav.duplicates': 'Duplicates',
  'nav.ai': 'AI',
  'nav.backup': 'Backup',

  // Theme
  'theme.light': 'Light Mode',
  'theme.dark': 'Dark Mode',
  'theme.auto': 'Follow System',

  // Common
  'common.loading': 'Loading...',
  'common.error': 'An error occurred',
  'common.success': 'Success',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.export': 'Export',
  'common.import': 'Import',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.unknownError': 'Unknown error',
  'common.undo': 'Undo',
  'common.close': 'Close',

  // Upload & Merge Page
  'upload.title': 'Upload & Merge',
  'upload.dropzone': 'Drag bookmark files here, or click to select',
  'upload.supportedFormats':
    'Supports Netscape Bookmark format exported from Chrome, Firefox, Edge, Safari',
  'upload.bookmarkCount': '{count} bookmarks',
  'upload.importFailed': 'Failed to import file: {error}',
  'upload.importFirst': 'Please import bookmark files first',
  'upload.mergeComplete': 'Merge complete! Data saved to local database',
  'upload.mergeFailed': 'Merge failed',
  'upload.exportSuccess': 'Exported as {format} format',
  'upload.exportFailed': 'Export failed',
  'upload.fileRemoved': 'File removed: {name}',
  'upload.rawItemsLabel': 'Total bookmarks in current import session',
  'upload.noRawItems': 'No active import session',
  'upload.mergedItemsLabel': 'Deduplicated bookmarks',
  'upload.restoredLabel': 'Restored from previous merge',
  'upload.duplicatesLabel': 'Exact duplicate groups detected',
  'upload.duplicatesUnavailable': 'Available after full merge',

  // Dashboard Page
  'dashboard.title': 'Dashboard',
  'dashboard.deduplicated': 'Deduplicated',
  'dashboard.duplicates': 'Exact duplicates',
  'dashboard.needsMerge': 'Current import session has changed, dashboard statistics are outdated',
  'dashboard.needsMergeHint': 'Please go to "Upload & Merge" to re-run merge and dedupe',
  'dashboard.restoredWarning':
    'Currently showing merged snapshot restored from local database. Basic stats are available, but duplicate cluster info may not represent the full results of the last import session.',
  'dashboard.totalBookmarks': 'Total Bookmarks',
  'dashboard.duplicateCount': 'Exact duplicates',
  'dashboard.domainCount': 'Domains',
  'dashboard.duplicateRatio': 'Exact Duplicate Ratio',
  'dashboard.topDomains': 'Top 10 Domains',
  'dashboard.byYear': 'Added by Year',
  'dashboard.byCategory': 'Category Distribution',
  'dashboard.chart.categoryAria': 'Bookmark category distribution bar chart',
  'dashboard.bookmarkList': 'Bookmark List',
  'dashboard.loadMore': 'Load More',
  'dashboard.items': 'items',
  'dashboard.chart.pieAria': 'Bookmark duplicate ratio pie chart',
  'dashboard.chart.barAria': 'Bookmark domain distribution bar chart',
  'dashboard.chart.lineAria': 'Bookmark yearly addition trend chart',
  'dashboard.chart.listAria': 'Bookmark list',

  // Search Page
  'search.title': 'Search',
  'search.placeholder': 'Search bookmarks...',
  'search.noResults': 'No matching bookmarks found',
  'search.noExport': 'No bookmarks to export',
  'search.exportSuccess': 'Exported as {format} format',
  'search.exportFailed': 'Export failed',
  'search.noFolder': '(No folder)',

  // Duplicates Page
  'duplicates.title': 'Duplicates',
  'duplicates.empty': 'No duplicate bookmarks',
  'duplicates.source': 'Source: {source}',

  // AI Page
  'ai.title': 'AI Settings',
  'ai.configSaved': 'Configuration saved',
  'ai.saveFailed': 'Save failed',
  'ai.testing': 'Testing connection...',
  'ai.connected': 'Connection successful!',

  // Backup Page
  'backup.title': 'Backup',
  'backup.create': 'Create Backup',
  'backup.restore': 'Restore from Backup',
  'backup.creating': 'Creating backup...',
  'backup.restoring': 'Restoring...',
  'backup.success': 'Backup successful! File size: {size}',
  'backup.failed': 'Backup failed: {error}',
  'backup.parseFailed': 'Failed to parse backup file',
  'backup.confirmRestore': 'Are you sure you want to restore the following data?',
  'backup.warning': '⚠️ This will replace all current data!',
  'backup.restoreSuccess': 'Restore successful! Bookmarks: {count}{aiConfig}',
  'backup.aiConfigRestored': ', AI config restored',
  'backup.restoreFailed': 'Restore failed: {error}',
  'backup.aiConfigLabel': 'AI Config',

  // Export Formats
  'export.html': 'HTML',
  'export.json': 'JSON',
  'export.csv': 'CSV',
  'export.markdown': 'Markdown',
  'export.htmlDesc': 'Browser compatible format',
  'export.jsonDesc': 'Structured data',
  'export.csvDesc': 'Spreadsheet format',
  'export.markdownDesc': 'Document format',

  // Landing Page - Hero
  'hero.title': 'Bookmarks Manager',
  'hero.subtitle': 'Local-first bookmark cleanup tool',
  'hero.description':
    'Import, deduplicate, search, analyze, and export browser bookmarks. Everything runs locally, privacy first.',
  'hero.getStarted': 'Get Started',
  'hero.viewDemo': 'View Demo',
  'hero.stats.total': 'Total Bookmarks',
  'hero.stats.duplicates': 'Duplicates',
  'hero.stats.domains': 'Domains',
  'hero.stats.trend': 'Bookmark Growth Trend',
  'hero.badge': 'Free & Open Source',
  'hero.headline': 'Organize your',
  'hero.headlineHighlight': 'digital bookmarks',
  'hero.github': 'GitHub Open Source',
  'hero.trust.local': '100% Local Processing',
  'hero.trust.noSignup': 'No Sign-up Required',
  'hero.trust.pwa': 'PWA Support',
  'hero.preview.upload': 'Upload & Merge',
  'hero.preview.backup': 'Local Backup',
  'hero.preview.processed': 'Local Processing Complete',
  'hero.preview.restore': 'Local Backup Restore',
  'hero.scrollHint': 'Scroll down to learn more',

  // Landing Page - Features
  'features.badge': 'Core Features',
  'features.title': 'All-in-one Bookmark Cleanup & Management',
  'features.subtitle':
    'From import, dedupe to search, backup and export, covering the complete local bookmark organization workflow',
  'features.smartMerge.title': 'Smart Merge',
  'features.smartMerge.desc':
    'One-click import from Chrome, Firefox, Edge, Safari bookmark files. Automatically identifies and merges duplicate folder structures.',
  'features.smartDedup.title': 'Smart Deduplication',
  'features.smartDedup.desc':
    'URL normalization collapses exact duplicates while keeping the earliest copy. Similar titles are review candidates only, never auto-deleted.',
  'features.search.title': 'Full-Text Search',
  'features.search.desc':
    'High-performance search engine based on MiniSearch, supports title, URL, folder path full-text search with fuzzy matching, millisecond response.',
  'features.ai.title': 'Optional AI Config',
  'features.ai.desc':
    'Optional integration with OpenAI, Claude models. Bring your own API key, stored locally only. No data uploaded by default.',
  'features.stats.title': 'Visual Statistics',
  'features.stats.desc':
    'ECharts-powered local statistics view, showing domain distribution, time trends, and duplicate ratio to help you quickly assess results.',
  'features.privacy.title': 'Privacy First',
  'features.privacy.desc':
    'All processing happens locally in your browser, IndexedDB storage, no data upload. Open source code is auditable, you truly control your data.',
  'features.learnMore': 'Learn More',
  'features.privacyNote': 'All data processed locally,',
  'features.privacyHighlight': 'never uploaded to server',

  // Landing Page - How It Works
  'howItWorks.title': 'How It Works',
  'howItWorks.badge': 'Simple 3 Steps',
  'howItWorks.subtitle': 'Easily organize your bookmarks',
  'howItWorks.step1.title': 'Import Bookmarks',
  'howItWorks.step1.desc':
    'Export bookmark files from Chrome, Firefox, Edge, Safari. Supports drag-and-drop upload or click to select, multiple files at once.',
  'howItWorks.step1.description':
    'Export bookmark files from Chrome, Firefox, Edge, Safari. Supports drag-and-drop upload or click to select, multiple files at once.',
  'howItWorks.step1.f1': 'Multi-browser support',
  'howItWorks.step1.feature1': 'Multi-browser support',
  'howItWorks.step1.f2': 'Batch import',
  'howItWorks.step1.feature2': 'Batch import',
  'howItWorks.step1.f3': 'Drag and drop',
  'howItWorks.step1.feature3': 'Drag and drop',
  'howItWorks.step2.title': 'Merge & Dedupe',
  'howItWorks.step2.desc':
    'System merges duplicate folders and handles exact duplicates. Similar titles wait for your confirmation, and every removal can be undone.',
  'howItWorks.step2.description':
    'System merges duplicate folders and handles exact duplicates. Similar titles wait for your confirmation, and every removal can be undone.',
  'howItWorks.step2.f1': 'Auto dedupe',
  'howItWorks.step2.feature1': 'Auto dedupe',
  'howItWorks.step2.f2': 'Duplicate overview',
  'howItWorks.step2.feature2': 'Duplicate overview',
  'howItWorks.step2.f3': 'Local search',
  'howItWorks.step2.feature3': 'Local search',
  'howItWorks.step3.title': 'Export & Organize',
  'howItWorks.step3.desc':
    'Export organized bookmarks as standard HTML format, can be imported back to any browser. Also supports JSON, CSV for backup.',
  'howItWorks.step3.description':
    'Export organized bookmarks as standard HTML format, can be imported back to any browser. Also supports JSON, CSV for backup.',
  'howItWorks.step3.f1': 'Standard format',
  'howItWorks.step3.feature1': 'Standard format',
  'howItWorks.step3.f2': 'Multi-format export',
  'howItWorks.step3.feature2': 'Multi-format export',
  'howItWorks.step3.f3': 'Restore anytime',
  'howItWorks.step3.feature3': 'Restore anytime',
  'howItWorks.bottomNote':
    'The entire process runs locally, no data upload required. Upload bookmarks → One-click merge → Instant results',

  // Landing Page - FAQ
  'faq.title': 'FAQ',
  'faq.badge': 'FAQ',
  'faq.heading': 'Have Questions?',
  'faq.subtitle': 'Here are the most frequently asked questions',
  'faq.githubIssue': 'Submit an Issue on GitHub',
  'faq.q1': 'Will my bookmark data be uploaded to a server?',
  'faq.a1':
    'Absolutely not. Bookmarks Manager is a purely local application. All bookmark file processing happens in your browser. We use IndexedDB for local storage, with no backend server. Your bookmarks never leave your device.',
  'faq.q2': 'Which browser bookmark files are supported?',
  'faq.a2':
    'Supports standard Netscape Bookmark HTML format exports from all major browsers including Chrome, Firefox, Edge, Safari, Brave, Opera, etc. Just export bookmarks to an HTML file in your browser, then drag and drop to upload to this tool.',
  'faq.q3': 'How do I use AI features? Is there a fee?',
  'faq.a3':
    'Currently only optional AI configuration and connection testing capabilities are retained. You can provide your own OpenAI or Claude API key, configuration is saved locally in the browser only. The tool does not manage keys or upload your bookmarks to any service.',
  'faq.q4': 'How does the deduplication algorithm work?',
  'faq.a4':
    'URLs are normalized before comparison: protocol, hostname casing, tracking parameters, trailing slashes, and query order are unified. Exact normalized URLs are collapsed automatically while keeping the earliest copy. Bookmarks with similar titles on the same domain are only listed for review, never deleted automatically.',
  'faq.q5': 'Can organized bookmarks be imported back to browsers?',
  'faq.a5':
    'Of course. We export standard bookmark HTML format that can be imported in any browser\'s bookmark manager. Just click the "Export" button to generate the organized HTML file, then select "Import Bookmarks" in your target browser.',
  'faq.q6': 'How do I use PWA offline features?',
  'faq.a6':
    'After first visit, the app is automatically cached locally. You can add the website to your home screen (Chrome/Edge click install icon in address bar, Safari use "Add to Home Screen"), then open and use most features even offline.',
  'faq.more': 'Have more questions?',

  // Landing Page - Footer
  'footer.product': 'Product',
  'footer.getStarted': 'Get Started',
  'footer.features': 'Features',
  'footer.tutorial': 'Tutorial',
  'footer.resources': 'Resources',
  'footer.github': 'GitHub Repo',
  'footer.demo': 'Live Demo',
  'footer.feedback': 'Feedback',
  'footer.license': 'MIT License',
  'footer.docs': 'Documentation',
  'footer.madeWith': 'Built with ❤️, protecting your privacy',
  'footer.copyright': '© 2024 Bookmarks Manager. All rights reserved.',
  'footer.cta.title': 'Ready to clean up your bookmarks?',
  'footer.cta.description':
    'Start using Bookmarks Manager to easily organize your digital bookmarks',
  'footer.cta.button': 'Get Started Free',
  'footer.brand.description':
    'Local-first bookmark management tool, privacy protected, completely free',
  'footer.links.startNow': 'Get Started',
  'footer.links.features': 'Features',
  'footer.links.tutorial': 'Tutorial',
  'footer.links.github': 'GitHub Repo',
  'footer.links.demo': 'Live Demo',
  'footer.links.feedback': 'Feedback',
  'footer.links.mitLicense': 'MIT License',
  'footer.links.documentation': 'Documentation',

  // Error Boundary
  'error.title': 'Error',
  'error.message': 'An unknown error occurred',
  'error.retry': 'Retry',

  // ARIA labels
  'aria.mainNav': 'Main navigation',
  'aria.themeSwitch': 'Theme switch',
  'aria.list': 'List',
  'aria.chart': 'Chart',

  // Alert messages
  'alert.needsMerge':
    'Current import session has changed. Old statistics, search results, and export content are outdated. Please go to "Upload & Merge" to merge and dedupe again.',
  'alert.goMerge': 'Go Merge',

  // Search Page - Extended
  'search.needsMerge': 'Current import session has changed, search index is outdated',
  'search.needsMergeHint': 'Please go to "Upload & Merge" to re-run merge and dedupe',
  'search.placeholderFull': 'Search bookmark title, URL or folder...',
  'search.advancedFilter': 'Advanced filters (combine with search)',
  'search.reset': 'Reset',
  'search.domain': 'Domain',
  'search.allDomains': 'All domains',
  'search.rootFolder': 'Root folder',
  'search.allFolders': 'All folders',
  'search.folderKeyword': 'Folder keyword (contains match)',
  'search.folderKeywordPlaceholder': 'e.g. dev / AI / reading',
  'search.dateStart': 'Start date',
  'search.dateEnd': 'End date',
  'search.export': 'Export',
  'search.currentResults': 'Current results',
  'search.all': 'All',
  'search.preserveFolder': 'Preserve folder structure',
  'search.exportButton': 'Export {format}',
  'search.importFirst': 'Please import bookmarks in "Upload & Merge" first',
  'search.noMatch': 'No matching bookmarks found',
  'search.found': 'Found {count} results',
  'search.searchHits': '(search hits: {count})',
  'search.loadMore': 'Load more ({count} items)',
  'search.exportedAs': 'Exported as {format} format',
  'search.clear': 'Clear search',
  'search.delete': 'Delete this bookmark',
  'search.deleteConfirm': 'Delete "{title}"? You can undo from the top of the page.',
  'search.deleteFailed': 'Delete failed, please try again',

  // Backup Page - Extended
  'backup.pageTitle': 'Data Backup & Restore',
  'backup.description':
    'Export your bookmarks and optional AI config as a JSON file. Use it to restore on another device or as an archive.',
  'backup.localNote': 'Note: All data is processed locally, never uploaded to any server.',
  'backup.options': 'Backup options',
  'backup.bookmarkData': 'Bookmark data',
  'backup.aiConfigData': 'AI config (API keys, etc.)',
  'backup.estimatedSize': 'Estimated backup size',
  'backup.bookmarkCount': 'Bookmarks: {count}',
  'backup.faq.title': 'FAQ',
  'backup.faq.q1': 'What does the backup file contain?',
  'backup.faq.a1':
    'The backup is a JSON text file containing your selected bookmark data and optional AI config. You can view it with any text editor.',
  'backup.faq.q2': 'How to migrate to another device?',
  'backup.faq.a2':
    'Create a backup on the old device and download the JSON file, then open this app on the new device, go to Backup and select "Restore from Backup".',
  'backup.faq.q3': 'Are API keys safe?',
  'backup.faq.a3':
    'Yes. The backup file is stored locally on your device, never uploaded to any server. Keep the backup file secure as it may contain sensitive API keys.',

  // Duplicates Page - Extended
  'duplicates.needsMerge': 'Current import session has changed, duplicate clusters are outdated',
  'duplicates.needsMergeHint': 'Please go to "Upload & Merge" to re-run merge and dedupe',
  'duplicates.noFullMergeData':
    'Only restored previous merge snapshot, duplicate cluster details not preserved',
  'duplicates.noFullMergeDataHint':
    'To view duplicate clusters, re-import original bookmarks and run merge & dedupe',
  'duplicates.clusterTitle': 'Duplicate Bookmark Clusters',
  'duplicates.groupCount': '{count} duplicate groups',
  'duplicates.noDuplicatesHint': 'Please run merge & dedupe in "Upload & Merge" first',
  'duplicates.cluster': 'Cluster #{index} ({count} copies)',
  'duplicates.keep': 'Keep',
  'duplicates.reviewTitle': 'Deduplication Review',
  'duplicates.reviewHint': 'Exact duplicates keep one copy by default; similar titles are suggestions only and are never deleted automatically. Every removal can be undone.',
  'duplicates.exactCount': '{groups} exact group(s) · {items} removable',
  'duplicates.similarCount': '{groups} similar group(s) · {items} to review',
  'duplicates.exactTitle': 'Exact duplicates',
  'duplicates.exactHint': 'These share a normalized URL. The earliest bookmark is kept by default; you can switch the kept copy or restore the whole group.',
  'duplicates.similarTitle': 'Possible duplicates (similar titles)',
  'duplicates.similarHint': 'Same domain with highly similar titles but different URLs. Nothing is deleted automatically; review and remove only what you confirm.',
  'duplicates.similarGroup': 'Similar group #{index}',
  'duplicates.similarScore': 'Similarity {score}%',
  'duplicates.setKeep': 'Keep this one',
  'duplicates.restoreGroup': 'Restore group',
  'duplicates.restoredGroup': 'Restored {count} duplicate bookmarks',
  'duplicates.swappedKeep': 'Kept copy switched',
  'duplicates.removedCount': 'Deleted {count} bookmark(s)',
  'duplicates.similarRemoved': 'Deleted {count} possible duplicate(s)',
  'duplicates.similarDismissed': 'Ignored one possible duplicate group',
  'duplicates.dismissGroup': 'Keep all',
  'duplicates.selectAll': 'Select all',
  'duplicates.clearSelection': 'Clear selection',
  'duplicates.deleteSelected': 'Delete selected ({count})',
  'duplicates.deleteConfirm': 'Delete the selected {count} bookmark(s)? You can undo from the top of the page.',
  'duplicates.noExact': 'No exact URL duplicates',
  'duplicates.noSimilar': 'No similar titles need review',
  'duplicates.actionFailed': 'Action failed: {error}',


  // Upload & Merge Page - Extended
  'upload.selectFiles': 'Select exported bookmark HTML files, multiple supported',
  'upload.dragOrClick': 'Click to select or drag files here',
  'upload.importSessionFiles': 'Files in current import session',
  'upload.bookmarkCountShort': '{count} bookmarks',
  'upload.remove': 'Remove',
  'upload.restoredHint':
    'Restored the previous merge result from the local database ({count} bookmarks). Importing another file adds to this library instead of replacing it.',
  'upload.needsMergeWarning':
    'Current import session has changed. Old merge results, search index, and duplicate clusters are outdated. Click "Merge & Dedupe" to regenerate.',
  'upload.rawItems': 'Raw items',
  'upload.mergedItems': 'Merged',
  'upload.duplicateItems': 'Exact duplicates',
  'upload.mergeButton': 'Merge & Dedupe',
  'upload.exportButton': 'Export {format}',
  'upload.clearButton': 'Clear',
  'upload.clearConfirm': 'Clear all bookmarks from the local database? This cannot be undone.',
  'upload.invalidFiles':
    'No valid HTML bookmark files detected. Ensure files have .html or .htm extension',
  'upload.rejectedFiles': '({names}{more} format not supported)',
  'upload.importSuccess': 'Imported {count} file(s) with {bookmarks} bookmarks',
  'upload.importPartialSuccess': 'Imported {accepted} file(s), skipped {rejected} non-HTML file(s), {bookmarks} bookmarks total',
  'upload.noBookmarksFound': 'No bookmarks were parsed from the file. Make sure it is a browser bookmark HTML export.',

  // AI Page - Extended
  'ai.pageTitle': 'Optional AI Config',
  'ai.description':
    'Bookmarks Manager core workflow does not require AI. This section only provides local BYOK config and connection testing. All keys and settings are stored only in this browser.',

  // Error Boundary - Extended
  'error.pageLoadFailed': 'Page load failed',
  'error.componentLoadFailed': 'Component load failed',
  'error.checkNetwork': 'Please check your network and refresh the page',
  'error.refreshPage': 'Refresh page',

  // Dashboard - Extended
  'dashboard.chart.pieDescription': 'Deduplicated: {total}, exact duplicates: {duplicates}',
  'dashboard.chart.barDescription': 'Top 10 domains: {domains}',
  'dashboard.chart.lineDescription': 'Added by year: {years}',
  'dashboard.folderLabel': 'Folder: {path}',

  // AI Settings - Extended
  'ai.loadingConfig': 'Loading config...',
  'ai.configTitle': 'AI Config',
  'ai.provider': 'Provider',
  'ai.customEndpoint': 'Custom endpoint',
  'ai.apiKeyPlaceholder': 'Enter your API Key',
  'ai.apiKeyHint': 'API Key is stored locally in IndexedDB, never uploaded to any server',
  'ai.endpointUrl': 'API Endpoint URL',
  'ai.model': 'Model',
  'ai.modelPlaceholder': 'Enter model name',
  'ai.maxTokens': 'Max Output Tokens',
  'ai.testConnection': 'Test Connection',
  'ai.saveConfig': 'Save Config',

  // Virtual List
  'virtualList.noData': 'No data',

  // Worker
  'worker.parseFailed': 'Failed to parse {file}: {error}',
  'worker.normalizing': 'Normalizing URLs...',
  'worker.computingDuplicates': 'Computing duplicate clusters...',

  // AI Store
  'ai.notConfigured': 'API not configured',
  'ai.invalidApiKey': 'Invalid API Key',
  'ai.connectionFailed': 'Connection test failed',

  // Backup util
  'backup.invalidFormat': 'Invalid backup data format',

  // Stage messages
  'stage.importing': 'Importing and parsing...',
  'stage.parsing': 'Parsing {file} ({current}/{total})...',
  'stage.merging': 'Merging and deduplicating...',
  'stage.workerProcessing': 'Worker processing...',
  'stage.normalizing': 'Normalizing URLs...',
  'stage.computingDuplicates': 'Computing duplicate clusters...',
  'stage.saving': 'Saving to local database...',
  'stage.buildingIndex': 'Building search index...',
  'stage.workerFallback': 'Worker failed, switching to main thread...',
  'stage.computingClusters': 'Computing clusters and keep items...',
  'stage.generatingStats': 'Generating statistics...',
  'stage.restoring': 'Restoring from local database...',
  'stage.clearing': 'Clearing local data...',

  // Backup validation
  'backup.validation.invalidFormat': 'Invalid backup data format',
  'backup.validation.unsupportedVersion': 'Unsupported backup version: {version}',
  'backup.validation.invalidBookmarks': 'Invalid bookmarks data format',
  'backup.validation.incompleteBookmark': 'Incomplete bookmark data',
  'backup.jsonParseFailed': 'JSON parsing failed, file may be corrupted',

  // Worker stage
  'stage.parsingWorker': 'Parsing {file} ({current}/{total})... (Worker)',
  'stage.buildingIndexWorker': 'Worker building search index...'
} as const
