// Internationalization utilities and translations

// Translation dictionaries
const translations = {
  en: {
    // Login Page
    login: 'Log in',
    loginToAccount: 'Log in to your account',
    email: 'Email',
    password: 'Password',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    signingIn: 'Signing in...',
    signIn: 'Sign in',
    dontHaveAccount: "Don't have an account?",
    signUpForFree: 'Sign up for free',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    
    // Chat Page
    newChat: 'New Chat',
    search: 'Search',
    settings: 'Settings',
    delete: 'delete',
    cancel: 'cancel',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    sendMessage: 'Send a message',
    copyCode: 'Copy Code',
    copied: 'Copied!',
    copySuccess: 'Copying to clipboard was successful!',
    // Settings Modal
    advanced: 'Advanced',
    models: 'Models',
    chatManagement: 'Chat Management',
    parameters: 'Parameters',
    requestMode: 'Request Mode',
    default: 'Default',
    json: 'JSON',
    save: 'Save',
    modelsConfiguration: 'Models Configuration',
    modelsDescription: 'Configure multiple models with different URLs and API keys (all following OpenAI interface specification)',
    edit: 'Edit',
    deleteModel: 'Delete',
    editModel: 'Edit Model',
    settingsSaved: 'Settings saved successfully',
    atLeastOneModel: 'At least one model is required',
    modelDeleted: 'Model deleted successfully',
    modelUpdated: 'Model updated successfully',
    addModel: 'Add Model',
    cancel: 'Cancel',
    confirmDelete: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete this model? This action cannot be undone.',
    setAsDefault: 'Set as default model',
    // Chat Management
    chatManagementDescription: 'Import, export, and manage your chat conversations',
    importConversations: 'Import',
    exportConversations: 'Export',
    clearConversations: 'Clear conversations',
    importSuccess: 'Conversations imported successfully',
    exportSuccess: 'Conversations exported successfully',
    clearSuccess: 'Conversations cleared successfully',
    clearConfirm: 'Are you sure you want to clear all conversations? This action cannot be undone.',
    importFailed: 'Failed to import conversations',
    
    // Dashboard header
    greeting: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening'
    },
    dashboard: 'Dashboard',
    dashboardDescription: "Here's what's happening with your CRM today. Stay on top of your pipeline and close more deals.",
    
    // Error messages
    errorLoading: 'Error loading dashboard',
    
    // Sales Pipeline
    salesPipeline: 'Sales Pipeline',
    
    // KPI Cards
    pipelineValue: 'Pipeline Value',
    weightedPipeline: 'Weighted Pipeline',
    wonThisMonth: 'Won This Month',
    conversionRate: 'Conversion Rate',
    
    // Focus Bar
    focusBar: {
      overdueTasks: 'Overdue Tasks',
      tasksDueToday: 'Tasks Due Today',
      followupsToday: 'Follow-ups Today',
      hotLeads: 'Hot Leads'
    },
    
    // Hot Leads Panel
    hotLeads: 'Hot Leads',
    
    // Opportunities Table
    opportunities: 'Recent Opportunities',
    
    // Task List
    tasks: 'Recent Tasks',
    
    // Activity Feed
    activityFeed: 'Activity Feed',
    
    // Sidebar Menu
    leads: 'Leads',
    contacts: 'Contacts',
    accounts: 'Accounts',
    deals: 'Deals',
    tickets: 'Tickets',
    tasksMenu: 'Tasks',
    sales: 'Sales',
    invoices: 'Invoices',
    support: 'Support',
    helpDesk: 'Help Desk',
    
    // Sidebar Groups
    aiGroup: 'AI',
    crmGroup: 'CRM',
    salesGroup: 'Sales',
    supportGroup: 'Support',
    
    // AI
    agent: 'Agent',
    comingSoon: 'Coming Soon',
    
    // Leads Page
    all: 'All',
    open: 'Open',
    lost: 'Lost',
    filters: 'Filters',
    columns: 'Columns',
    toggleColumns: 'Toggle columns',
    newLead: 'New Lead',
    searchLeads: 'Search leads...',
    source: 'Source',
    rating: 'Rating',
    created: 'Created',
    noLeadsFound: 'No leads found',
    createNewLead: 'Create a new lead to get started',
    
    // Contacts Page
    contacts: 'Contacts',
    newContact: 'New Contact',
    searchContacts: 'Search contacts...',
    noContactsFound: 'No contacts found',
    createNewContact: 'Create a new contact to get started',
    contact: 'Contact',
    details: 'Details',
    owner: 'Owner',
    unassigned: 'Unassigned',
    cancel: 'Cancel',
    creating: 'Creating...',
    createContact: 'Create Contact',
    saving: 'Saving...',
    save: 'Save',
    
    // Accounts Page
    accounts: 'Accounts',
    account: 'Account',
    newAccount: 'New Account',
    searchAccounts: 'Search accounts...',
    noAccountsFound: 'No accounts found',
    tryAdjustingFilters: 'Try adjusting your filters or create a new account',
    all: 'All',
    active: 'Active',
    closed: 'Closed',
    industry: 'Industry',
    allIndustries: 'All Industries',
    revenue: 'Revenue',
    website: 'Website',
    accountName: 'Account name',
    related: 'Related',
    contacts: 'Contacts',
    opportunities: 'Opportunities',
    cases: 'Cases',
    tasks: 'Tasks',
    quickActions: 'Quick Actions',
    addContact: 'Add Contact',
    addOpportunity: 'Add Opportunity',
    addCase: 'Add Case',
    addTask: 'Add Task',
    thisAccountIsClosed: 'This account is closed',
    reopenAccountToMakeChanges: 'Reopen the account to make changes',
    reopenAccount: 'Reopen Account',
    closeAccount: 'Close Account',
    creatingAccount: 'Creating...',
    createAccount: 'Create Account',
    
    // Opportunities Page
    opportunity: 'Opportunity',
    opportunityName: 'Opportunity name',
    searchOpportunities: 'Search opportunities...',
    noOpportunitiesFound: 'No opportunities found',
    pipeline: 'Pipeline',
    open: 'Open',
    won: 'Won',
    lost: 'Lost',
    closeDate: 'Close Date',
    closedBy: 'Closed By',
    closedOn: 'Closed On',
    notAssigned: 'Not assigned',
    system: 'System',
    products: 'Products',
    noProductsAddedYet: 'No products added yet',
    addProduct: 'Add Product',
    selectProduct: 'Select product...',
    total: 'Total',
    markWon: 'Mark Won',
    markLost: 'Mark Lost',
    createOpportunity: 'Create Opportunity',
    thisWillCreateANewInvoice: 'This will create a new invoice from this opportunity with',
    product: 'product',
    products: 'products',
    totaling: 'totaling',
    createInvoice: 'Create Invoice',
    new: 'New',
    // Cases Page
    case: 'Case',
    cases: 'Cases',
    caseTitle: 'Case title',
    newCase: 'New Case',
    searchCases: 'Search cases...',
    noCasesFound: 'No cases found',
    priority: 'Priority',
    type: 'Type',
    list: 'List',
    board: 'Board',
    closeCase: 'Close Case',
    reopen: 'Reopen',
    saveChanges: 'Save Changes',
    // Tasks Page
    tasks: 'Tasks',
    active: 'Active',
    calendar: 'Calendar',
    newTask: 'New Task',
    searchTasks: 'Search tasks...',
    noTasksFound: 'No tasks found',
    dueDate: 'Due Date',
    // Invoices Page
    invoices: 'Invoices',
    newInvoice: 'New Invoice',
    searchInvoices: 'Search invoices...',
    noInvoicesYet: 'No invoices yet',
    createFirstInvoice: 'Create your first invoice to get started',
    createInvoice: 'Create Invoice',
    status: 'Status',
    issueDate: 'Issue Date',
    // Support Page
    openSourceForeverFree: 'AI • Open Source •  Free',
    help: 'Help',
    support: 'Support',
    ourMission: 'Our Mission',
    missionDescription: 'OpenCRM addresses the high subscription costs of commercial CRM alternatives by providing a completely free, open-source, and highly customizable solution. Clone it, self-host it, and make it yours — forever free.',
    community: 'Community',
    joinTheCommunity: 'Join the Community',
    communityDescription: 'Collaborate with developers worldwide. Get free support, share ideas, and help shape the future of open-source CRM.',
    openSource: 'Open Source',
    activeCommunity: 'Active Community',
    visitGitHub: 'Visit GitHub',
    professionalSupport: 'Professional Support',
    professionalSupportDescription: 'Priority support, hosting assistance, and custom development services from the core team.',
    contactTeam: 'Contact Team',
    featureRequests: 'Feature Requests',
    featureRequestsDescription: 'Have an idea? Share your requests and help shape the future of BottleCRM.',
    requestFeature: 'Request Feature',
    bugReports: 'Bug Reports',
    bugReportsDescription: 'Found an issue? Your feedback helps make the platform more stable for everyone.',
    reportBug: 'Report Bug',
    critical: 'Critical',
    securityIssues: 'Security Issues',
    securityIsOurPriority: 'Security is our priority.',
    reportVulnerabilitiesPrivately: 'Report vulnerabilities privately.',
    neverCreatePublicIssuesForSecurityConcerns: 'Never create public issues for security concerns.',
    reportPrivately: 'Report Privately',
    needCustomCrmDevelopment: 'Need Custom CRM Development?',
    customDevelopmentDescription: 'Tailored solutions including hosting, custom features, integrations, and ongoing support for your specific business needs.',
    getCustomQuote: 'Get Custom Quote'
  },
  zh: {
    // Login Page
    login: '登录',
    loginToAccount: '登录您的账户',
    email: '邮箱',
    password: '密码',
    enterEmail: '输入您的邮箱',
    enterPassword: '输入您的密码',
    signingIn: '登录中...',
    signIn: '登录',
    dontHaveAccount: '还没有账户？',
    signUpForFree: '免费注册',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
    
    // Chat Page
    newChat: '新建对话',
    search: '搜索',
    settings: '设置',
    delete: '删除',
    cancel: '取消',
    collapseSidebar: '收起侧边栏',
    expandSidebar: '展开侧边栏',
    sendMessage: '发送消息',
    copyCode: '复制代码',
    copied: '已复制!',
    copySuccess: '复制到剪贴板成功!',
    // Settings Modal
    advanced: '高级设置',
    models: '模型',
    chatManagement: '会话管理',
    parameters: '参数',
    requestMode: '请求模式',
    default: '默认',
    json: 'JSON',
    save: '保存',
    modelsConfiguration: '模型配置',
    modelsDescription: '配置多个不同URL和API密钥的模型（均遵循OpenAI接口规范）',
    edit: '编辑',
    deleteModel: '删除',
    editModel: '编辑模型',
    settingsSaved: '设置保存成功',
    atLeastOneModel: '至少需要一个模型',
    modelDeleted: '模型删除成功',
    modelUpdated: '模型更新成功',
    addModel: '添加模型',
    cancel: '取消',
    confirmDelete: '确认删除',
    confirmDeleteMessage: '您确定要删除此模型吗？此操作无法撤销。',
    setAsDefault: '设为默认模型',
    // Chat Management
    chatManagementDescription: '导入、导出和管理您的聊天对话',
    importConversations: '导入',
    exportConversations: '导出',
    clearConversations: '清空对话',
    importSuccess: '对话导入成功',
    exportSuccess: '对话导出成功',
    clearSuccess: '对话清空成功',
    clearConfirm: '您确定要清空所有对话吗？此操作无法撤销。',
    importFailed: '对话导入失败',
    
    // Dashboard header
    greeting: {
      morning: '早上好',
      afternoon: '下午好',
      evening: '晚上好'
    },
    dashboard: '仪表盘',
    dashboardDescription: '这是您的 CRM 今天的情况。掌握您的销售管道并完成更多交易。',
    
    // Error messages
    errorLoading: '加载仪表盘失败',
    
    // Sales Pipeline
    salesPipeline: '销售管道',
    
    // KPI Cards
    pipelineValue: '管道价值',
    weightedPipeline: '加权管道',
    wonThisMonth: '本月已赢',
    conversionRate: '转化率',
    
    // Focus Bar
    focusBar: {
      overdueTasks: '逾期任务',
      tasksDueToday: '今日到期任务',
      followupsToday: '今日跟进',
      hotLeads: '热门线索'
    },
    
    // Hot Leads Panel
    hotLeads: '热门线索',
    
    // Opportunities Table
    opportunities: '最近商机',
    
    // Task List
    tasks: '最近任务',
    
    // Activity Feed
    activityFeed: '活动动态',
    
    // Sidebar Menu
    leads: '线索',
    contacts: '联系人',
    accounts: '账户',
    deals: '交易',
    tickets: '工单',
    tasksMenu: '任务',
    sales: '销售',
    invoices: '发票',
    support: '支持',
    helpDesk: '帮助中心',
    
    // Sidebar groups
    aiGroup: 'AI',
    crmGroup: '客户关系管理',
    salesGroup: '销售',
    supportGroup: '支持',
    // AI
    agent: '智能体',
    comingSoon: '敬请期待',
    
    // Leads Page
    all: '全部',
    open: '开放',
    lost: '丢失',
    filters: '筛选',
    columns: '列',
    toggleColumns: '切换列',
    newLead: '新建线索',
    searchLeads: '搜索线索...',
    source: '来源',
    rating: '评级',
    created: '创建时间',
    noLeadsFound: '未找到线索',
    createNewLead: '创建一个新线索开始',
    
    // Contacts Page
    contacts: '联系人',
    newContact: '新建联系人',
    searchContacts: '搜索联系人...',
    noContactsFound: '未找到联系人',
    createNewContact: '创建一个新联系人开始',
    contact: '联系人',
    details: '详情',
    owner: '负责人',
    unassigned: '未分配',
    cancel: '取消',
    creating: '创建中...',
    createContact: '创建联系人',
    saving: '保存中...',
    save: '保存',
    
    // Accounts Page
    accounts: '客户',
    account: '客户',
    newAccount: '新建客户',
    searchAccounts: '搜索客户...',
    noAccountsFound: '未找到客户',
    tryAdjustingFilters: '尝试调整筛选条件或创建新客户',
    all: '全部',
    active: '活跃',
    closed: '已关闭',
    industry: '行业',
    allIndustries: '所有行业',
    revenue: '收入',
    website: '网站',
    accountName: '客户名称',
    related: '相关',
    contacts: '联系人',
    opportunities: '商机',
    cases: '案例',
    tasks: '任务',
    quickActions: '快速操作',
    addContact: '添加联系人',
    addOpportunity: '添加商机',
    addCase: '添加案例',
    addTask: '添加任务',
    thisAccountIsClosed: '此客户已关闭',
    reopenAccountToMakeChanges: '重新打开客户以进行更改',
    reopenAccount: '重新打开客户',
    closeAccount: '关闭客户',
    creatingAccount: '创建中...',
    createAccount: '创建客户',
    
    // Opportunities Page
    opportunity: '商机',
    opportunityName: '商机名称',
    searchOpportunities: '搜索商机...',
    noOpportunitiesFound: '未找到商机',
    pipeline: '销售管道',
    open: '进行中',
    won: '赢单',
    lost: '输单',
    closeDate: '关闭日期',
    closedBy: '关闭人',
    closedOn: '关闭日期',
    notAssigned: '未分配',
    system: '系统',
    products: '产品',
    noProductsAddedYet: '尚未添加产品',
    addProduct: '添加产品',
    selectProduct: '选择产品...',
    total: '总计',
    markWon: '标记为赢单',
    markLost: '标记为输单',
    createOpportunity: '创建商机',
    thisWillCreateANewInvoice: '这将从该商机创建一个新发票，包含',
    product: '产品',
    products: '产品',
    totaling: '总计',
    createInvoice: '创建发票',
    new: '新建',
    // Cases Page
    case: '工单',
    cases: '工单',
    caseTitle: '工单标题',
    newCase: '新建工单',
    searchCases: '搜索工单...',
    noCasesFound: '未找到工单',
    priority: '优先级',
    type: '类型',
    list: '列表',
    board: '看板',
    closeCase: '关闭工单',
    reopen: '重新打开',
    saveChanges: '保存更改',
    // Tasks Page
    tasks: '任务',
    active: '进行中',
    calendar: '日历',
    newTask: '新建任务',
    searchTasks: '搜索任务...',
    noTasksFound: '未找到任务',
    dueDate: '截止日期',
    // Invoices Page
    invoices: '发票',
    newInvoice: '新建发票',
    searchInvoices: '搜索发票...',
    noInvoicesYet: '暂无发票',
    createFirstInvoice: '创建您的第一张发票以开始',
    createInvoice: '创建发票',
    status: '状态',
    issueDate: '开具日期',
    // Support Page
    openSourceForeverFree: '智能 • 开源 • 免费',
    help: '帮助',
    support: '支持',
    ourMission: '我们的使命',

    missionDescription: 'OpenCRM 通过提供完全免费、开源且高度可定制的解决方案，解决了商业 CRM 替代品的高昂订阅成本问题。克隆它，自托管它，让它成为您自己的 — 永远免费。',
    community: '社区',
    joinTheCommunity: '加入社区',
    communityDescription: '与全球开发者合作。获得免费支持，分享想法，帮助塑造开源 CRM 的未来。',
    openSource: '开源',
    activeCommunity: '活跃社区',
    visitGitHub: '访问 GitHub',
    professionalSupport: '专业支持',
    professionalSupportDescription: '来自核心团队的优先支持、托管协助和定制开发服务。',
    contactTeam: '联系团队',
    featureRequests: '功能请求',
    featureRequestsDescription: '有想法吗？分享您的请求，帮助塑造 BottleCRM 的未来。',
    requestFeature: '请求功能',
    bugReports: 'Bug 报告',
    bugReportsDescription: '发现问题？您的反馈有助于使平台对所有人更加稳定。',
    reportBug: '报告 Bug',
    critical: '关键',
    securityIssues: '安全问题',
    securityIsOurPriority: '安全是我们的首要任务。',
    reportVulnerabilitiesPrivately: '私下报告漏洞。',
    neverCreatePublicIssuesForSecurityConcerns: '永远不要为安全问题创建公开问题。',
    reportPrivately: '私下报告',
    needCustomCrmDevelopment: '需要定制 CRM 开发？',
    customDevelopmentDescription: '为您的特定业务需求提供量身定制的解决方案，包括托管、定制功能、集成和持续支持。',
    getCustomQuote: '获取定制报价'
  }
};

/**
 * Get current language from localStorage
 * @returns {string} Current language code (default: 'en')
 */
export const getCurrentLanguage = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
};

/**
 * Set current language in localStorage
 * @param {string} lang Language code ('en' or 'zh')
 */
export const setCurrentLanguage = (lang) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('language', lang);
  }
};

/**
 * Translate a key to current language
 * @param {string} key Translation key
 * @param {string} lang Optional language code (defaults to current language)
 * @returns {string} Translated text
 */
export const t = (key, lang = getCurrentLanguage()) => {
  // Handle nested keys (e.g., 'focusBar.overdueTasks')
  const keys = key.split('.');
  let result = translations[lang] || translations.en;
  
  for (const k of keys) {
    if (result[k] === undefined) {
      // Fallback to English if key not found
      result = translations.en;
      for (const k2 of keys) {
        result = result[k2] || key;
      }
      break;
    }
    result = result[k];
  }
  
  return result;
};

/**
 * Get greeting based on time of day and current language
 * @returns {string} Greeting text
 */
export const getTranslatedGreeting = () => {
  const hour = new Date().getHours();
  const lang = getCurrentLanguage();
  
  if (hour < 12) {
    return translations[lang].greeting.morning;
  } else if (hour < 17) {
    return translations[lang].greeting.afternoon;
  } else {
    return translations[lang].greeting.evening;
  }
};