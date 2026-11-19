// Internationalization utilities and translations

// Translation dictionaries
const translations = {
  en: {
    // Common
    select: 'Select...',
    pickADate: 'Pick a date',
    noneSelected: 'None selected',
    title: 'Title',
    name: 'Name',
    related_to: 'Related To',
    invoice_number: 'Invoice #',
    issue_date: 'Issue Date',
    due_date: 'Due Date',
    estimate_number: 'Estimate #',
    client: 'Client',
    valid_until: 'Valid Until',
    sku: 'SKU',
    category: 'Category',
    price: 'Price',
    amount: 'Amount',
    filters: 'Filters',
    new_template: 'New Template',
    create_template: 'Create Template',
    primary_color: 'Primary Color',
    footer: 'Footer',
    // Invoice Reports
    total_invoiced: 'Total Invoiced',
    total_collected: 'Total Collected',
    outstanding: 'Outstanding',
    overdue: 'Overdue',
    last_30_days: 'Last 30 Days',
    revenue_collected: 'Revenue Collected',
    invoices_created: 'Invoices Created',
    invoices_paid: 'Invoices Paid',
    invoice_status: 'Invoice Status',
    revenue_over_time: 'Revenue Over Time',
    period: 'Period',
    invoices: 'Invoices',
    revenue: 'Revenue',
    total: 'Total',
    no_revenue_data: 'No revenue data for the selected period',
    accounts_receivable_aging: 'Accounts Receivable Aging',
    current: 'Current',
    days_1_30: '1-30 Days',
    days_31_60: '31-60 Days',
    days_61_90: '61-90 Days',
    over_90_days: 'Over 90 Days',
    total_outstanding: 'Total Outstanding',
    estimates_overview: 'Estimates Overview',
    pending: 'Pending',
    accepted: 'Accepted',
    declined: 'Declined',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    // Pagination
    pagination_info: 'Showing {start}–{end} of {total} results',
    rows: 'Rows',
    previous: 'Previous',
    next: 'Next',
    // Products page
    columns: 'Columns',
    new_product: 'New Product',
    createNewProduct: 'New Product',
    create_product: 'Create Product',
    product_created: 'Product created',
    product_updated: 'Product updated',
    product_deleted: 'Product deleted',
    failed_to_create_product: 'Failed to create product',
    failed_to_update_product: 'Failed to update product',
    failed_to_delete_product: 'Failed to delete product',
    are_you_sure_delete_product: 'Are you sure you want to delete this product?',
    search_products: 'Search products...',
    no_products_yet: 'No products yet',
    create_first_product: 'Create your first product to use in invoices',
    // Reports page - invoice count suffix
    invoice_count: '{count} invoices',
    account: 'Account',
    amount_due: 'Amount Due',
    all: 'All',
    open: 'Open',
    paid: 'Paid',
    cancelled: 'Cancelled',
    draft: 'Draft',
    sent: 'Sent',
    viewed: 'Viewed',
    partially_paid: 'Partially Paid',
    
    // Drawer Labels
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    status: 'Status',
    deal_value: 'Deal Value',
    currency: 'Currency',
    country: 'Country',
    job_title: 'Job Title',
    rating: 'Rating',
    created: 'Created',
    created_by: 'Created by',
    source: 'Source',
    industry: 'Industry',
    probability: 'Probability',
    stage: 'Stage',
    address: 'Address',
    street_address: 'Street address',
    city: 'City',
    state: 'State',
    province: 'Province',
    postal_code: 'Postal Code',
    employees: 'Employees',
    notes: 'Notes',
    not_assigned: 'Not assigned',
    no_contacts: 'No contacts',
    no_tags: 'No tags',
    write_a_comment: 'Write a comment...',
    send: 'Send',
    no_comments_yet: 'No comments yet',
    be_the_first_to_comment: 'Be the first to comment',
    assigned_to: 'Assigned To',
    teams: 'Teams',
    contacts: 'Contacts',
    comments: 'Comments',
    hide_additional_fields: 'Hide additional fields',
    show: 'Show',
    more: 'more',
    field: 'field',
    fields: 'fields',
    new: 'New',
    show_less: 'Show less',
    view_all: 'View all',
    task: 'Task',
    new_task: 'New Task',
    create_task: 'Create Task',
    subject: 'Subject',
    description: 'Description',
    details: 'Details',
    cancel: 'Cancel',
    complete: 'Complete',
    save: 'Save',
    reopen: 'Reopen',
    // Recurring Invoice
    recurring_invoice: 'Recurring Invoice',
    active: 'Active',
    client_name: 'Client Name',
    client_email: 'Client Email',
    frequency: 'Frequency',
    custom_days: 'Custom Days',
    start_date: 'Start Date',
    end_date: 'End Date',
    next_invoice_date: 'Next Invoice Date',
    payment_terms: 'Payment Terms',
    auto_send: 'Auto Send',
    terms_and_conditions: 'Terms & Conditions',
    pause: 'Pause',
    activate: 'Activate',
    save_changes: 'Save Changes',
    create_recurring: 'Create Recurring',
    
    // Login Page
    login: 'Log in',
    loginToAccount: 'Log in to your account',
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
    delete: 'delete',
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
    viewAll: 'View all',
    showMore: 'Show more ({count} more)',
    earlier: 'Earlier',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    
    // Hot Leads panel
    noHotLeads: 'No hot leads',
    markLeadsAsHot: 'Mark leads as "Hot" to see them here',
    noFollowUpSet: 'No follow-up set',
    tomorrow: 'Tomorrow',
    daysOverdue: '{count}d overdue',
    noCompany: 'No company',
    unnamedLead: 'Unnamed Lead',
    call: 'Call',
    
    // Task List panel
    taskFilterAll: 'All',
    taskFilterOverdue: 'Overdue',
    taskFilterToday: 'Today',
    taskFilterWeek: 'Week',
    noTasksFound: 'No tasks found',
    allCaughtUp: 'All caught up!',
    daysAgo: '{count}d ago',
    
    // Opportunities Table panel
    noOpenOpportunities: 'No open opportunities',
    createOneToStart: 'Create one to start tracking',
    noAccount: 'No account',
    // Stage labels
    stageProspecting: 'Prospecting',
    stageQualification: 'Qualification',
    stageProposal: 'Proposal',
    stageNegotiation: 'Negotiation',
    stageWon: 'Won',
    stageLost: 'Lost',
    allStages: 'All Stages',
    dueToday: 'Today',
    dueTomorrow: 'Tomorrow',
    daysLeft: '{count}d',
    
    // Activity Feed panel
    recentActivity: 'Recent Activity',
    noRecentActivity: 'No recent activity',
    actionsWillAppear: 'Actions will appear here',
    system: 'System',
    // Activity action labels
    actionCreated: 'Created',
    actionUpdated: 'Updated',
    actionDeleted: 'Deleted',
    actionViewed: 'Viewed',
    actionCommented: 'Commented',
    actionAssigned: 'Assigned',
    // Activity entity labels
    entityAccount: 'Account',
    entityLead: 'Lead',
    entityContact: 'Contact',
    entityOpportunity: 'Opportunity',
    entityCase: 'Case',
    entityTask: 'Task',
    entityInvoice: 'Invoice',
    entityEstimate: 'Estimate',
    entityEvent: 'Event',
    // Activity description template
    activityTemplate: '{action} {entity}: {name}',
    
    // Pipeline Chart panel
    pipelineByStage: 'Pipeline by Stage',
    totalOpenPipeline: 'Total Open Pipeline',
    
    // Mini Pipeline
    closedLabel: 'Closed',
    
    // Currency / KPI notes
    currencyOnly: '{currency} only',
    currencyWithOthers: '{currency} only ({count} in other currencies)',
    
    // Sidebar Menu
    leads: 'Leads',
    accounts: 'Accounts',
    deals: 'Deals',
    tickets: 'Tickets',
    tasksMenu: 'Tasks',
    allInvoices: 'All Invoices',
    estimates: 'Estimates',
    products: 'Products',
    recurring: 'Recurring',
    templates: 'Templates',
    reports: 'Reports',
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
    
    // User dropdown menu
    profile: 'Profile',
    usersAndTeams: 'Users & Teams',
    organizations: 'Organizations',
    settings: 'Settings',
    tags: 'Tags',
    signOut: 'Sign out',
    english: 'English',
    chinese: 'Chinese',
    productBrand: 'openCRM',
    
    // Leads Page
    toggleColumns: 'Toggle columns',
    newLead: 'New Lead',
    searchLeads: 'Search leads...',
    noLeadsFound: 'No leads found',
    createNewLead: 'Create a new lead to get started',
    
    // Contacts Page
    newContact: 'New Contact',
    searchContacts: 'Search contacts...',
    noContactsFound: 'No contacts found',
    createNewContact: 'Create a new contact to get started',
    contact: 'Contact',
    owner: 'Owner',
    unassigned: 'Unassigned',
    creating: 'Creating...',
    createContact: 'Create Contact',
    saving: 'Saving...',
    
    // Accounts Page
    newAccount: 'New Account',
    searchAccounts: 'Search accounts...',
    noAccountsFound: 'No accounts found',
    tryAdjustingFilters: 'Try adjusting your filters or create a new account',
    closed: 'Closed',
    allIndustries: 'All Industries',
    website: 'Website',
    accountName: 'Account name',
    related: 'Related',
    cases: 'Cases',
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
    won: 'Won',
    lost: 'Lost',
    closeDate: 'Close Date',
    closedBy: 'Closed By',
    closedOn: 'Closed On',
    notAssigned: 'Not assigned',
    noProductsAddedYet: 'No products added yet',
    addProduct: 'Add Product',
    selectProduct: 'Select product...',
    markWon: 'Mark Won',
    markLost: 'Mark Lost',
    createOpportunity: 'Create Opportunity',
    thisWillCreateANewInvoice: 'This will create a new invoice from this opportunity with',
    product: 'product',
    totaling: 'totaling',
    createInvoice: 'Create Invoice',
    // Cases Page
    case: 'Case',
    caseTitle: 'Case title',
    newCase: 'New Case',
    searchCases: 'Search cases...',
    noCasesFound: 'No cases found',
    priority: 'Priority',
    type: 'Type',
    list: 'List',
    board: 'Board',
    closeCase: 'Close Case',
    saveChanges: 'Save Changes',
    // Tasks Page
    calendar: 'Calendar',
    newTask: 'New Task',
    searchTasks: 'Search tasks...',
    dueDate: 'Due Date',
    // Invoices Page
    newInvoice: 'New Invoice',
    searchInvoices: 'Search invoices...',
    noInvoicesYet: 'No invoices yet',
    createFirstInvoice: 'Create your first invoice to get started',
    issueDate: 'Issue Date',
    recurringInvoices: 'Recurring Invoices',
    invoiceReports: 'Invoice Reports',
    invoiceTemplates: 'Invoice Templates',
    inactive: 'Inactive',
    biweekly: 'Bi-weekly',
    quarterly: 'Quarterly',
    semiAnnually: 'Semi-annually',
    custom: 'Custom',
    bi_weekly: 'Bi-weekly',
    semi_annually: 'Semi-annually',
    paused: 'Paused',
    // Invoice detail page
    no_client_name: 'No client name',
    po_number: 'PO Number',
    billing_period: 'Billing Period',
    invoice_title_placeholder: 'Invoice title',
    po_placeholder: 'Purchase Order #',
    billing_period_placeholder: 'e.g. December 2024',
    bill_from: 'Bill From',
    bill_to: 'Bill To',
    select_account: 'Select Account',
    no_account: 'No account',
    select_contact: 'Select Contact',
    no_name: 'No name',
    line_items: 'Line Items',
    quantity: 'Quantity',
    rate: 'Rate',
    item_name: 'Item name',
    item_description_placeholder: 'Additional description (optional)',
    add_line_item: 'Add Line Item',
    tax: 'Tax',
    amount_paid: 'Amount Paid',
    amount_due_label: 'Amount Due',
    notes_placeholder: 'Notes visible to client...',
    payment_terms_placeholder: 'Payment terms...',
    // Invoice detail toast messages
    please_add_line_item: 'Please add at least one line item with a name/description and rate',
    invoice_updated: 'Invoice updated',
    failed_to_update_invoice: 'Failed to update invoice',
    invoice_cancelled: 'Invoice cancelled',
    failed_to_cancel_invoice: 'Failed to cancel invoice',
    invoice_sent: 'Invoice sent',
    failed_to_send_invoice: 'Failed to send invoice',
    pdf_downloaded: 'PDF downloaded',
    failed_to_download_pdf: 'Failed to download PDF',
    due_on_receipt: 'Due on Receipt',
    net_7: 'Net 7',
    net_15: 'Net 15',
    net_30: 'Net 30',
    net_45: 'Net 45',
    net_60: 'Net 60',
    net_90: 'Net 90',
    subtotal: 'Subtotal',
    invoices_generated: 'Invoices Generated',
    terms_conditions: 'Terms & Conditions',
    next_invoice: 'Next Invoice',
    generated: 'Generated',
    statistics: 'Statistics',
    new_recurring: 'New Recurring',
    search_recurring: 'Search recurring...',
    no_recurring_invoices: 'No recurring invoices yet',
    create_first_recurring: 'Create your first recurring invoice template',
    recurring_created: 'Recurring invoice created',
    recurring_updated: 'Recurring invoice updated',
    recurring_deleted: 'Recurring invoice deleted',
    failed_to_create_recurring: 'Failed to create recurring invoice',
    failed_to_update_recurring: 'Failed to update recurring invoice',
    failed_to_delete_recurring: 'Failed to delete recurring invoice',
    status_updated: 'Status updated',
    failed_to_update_status: 'Failed to update status',
    are_you_sure_delete_recurring: 'Are you sure you want to delete this recurring invoice?',
    // Estimates Page
    estimate: 'Estimate',
    newEstimate: 'New Estimate',
    searchEstimates: 'Search estimates...',
    noEstimatesYet: 'No estimates yet',
    createFirstEstimate: 'Create your first estimate to get started',
    createEstimate: 'Create Estimate',
    expired: 'Expired',
    convertToInvoice: 'Convert to Invoice',
    // Invoice Detail Page
    print: 'Print',
    downloading: 'Downloading...',
    cancelInvoice: 'Cancel Invoice?',
    cancelInvoiceDescription: 'This will cancel invoice {invoiceNumber}. Cancelled invoices cannot be sent or edited.',
    keepInvoice: 'Keep Invoice',
    // Settings
    myAccount: 'My Account',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    
    // Tags Page
    createAndManageTags: 'Create and manage tags to organize contacts, companies, deals, and tickets.',
    createTag: 'Create tag',
    searchTags: 'Search tags...',
    archived: 'Archived',
    tagName: 'Tag name',
    actions: 'Actions',
    archiveTag: 'Archive tag',
    showing: 'Showing {count} of {total}',
    activeTags: 'active tags',
    restore: 'Restore',
    archivedTags: 'archived tags',
    tagCreatedSuccessfully: 'Tag created successfully',
    tagUpdatedSuccessfully: 'Tag updated successfully',
    tagArchivedSuccessfully: 'Tag archived successfully',
    tagRestoredSuccessfully: 'Tag restored successfully',
    operationSuccessful: 'Operation successful',
    tagsHelpOrganize: 'Tags help you organize and segment your records.',
    tagNamePlaceholder: 'e.g., VIP Customer, Hot Lead',
    color: 'Color',
    tagDescriptionPlaceholder: 'Describe what this tag is for...',
    preview: 'Preview',
    editTag: 'Edit tag',
    updateTagNameColorDescription: 'Update the tag name, color, or description.',
    
    // Organization Settings Page
    organizationSettings: 'Organization Settings',
    manageYourOrganizationPreferences: 'Manage your organization preferences',
    organizationIdentity: 'Organization Identity',
    organizationName: 'Organization Name',
    organizationNamePlaceholder: 'Acme Corporation',
    companyDomain: 'Company Domain',
    companyDomainPlaceholder: 'yourcompany.com',
    aboutYourOrganization: 'About Your Organization',
    aboutYourOrganizationPlaceholder: 'Brief description of your organization, industry, and what you do...',
    regionalSettings: 'Regional Settings',
    currencyAndLocale: 'Currency & Locale',
    configureDefaultCurrencyAndRegionalPreferences: 'Configure default currency and regional preferences',
    defaultCurrency: 'Default Currency',
    appliedToOpportunitiesInvoicesAndFinancialReports: 'Applied to opportunities, invoices, and financial reports',
    defaultCountry: 'Default Country',
    usedForAddressesDateFormatsAndLocaleSettings: 'Used for addresses, date formats, and locale settings',
    currencyPreview: 'Currency Preview',
    sample: 'Sample',
    settingsSynced: 'Settings synced',
    lastUpdated: 'Last updated',
    saveAllChanges: 'Save All Changes',
    organizationSettingsUpdated: 'Organization settings updated',
    
    // Org Selection Page
    selectOrganization: 'Select Organization',
    selectAnOrganization: 'Select an organization',
    chooseWhichOrganizationYouWouldLikeToWorkIn: 'Choose which organization you\'d like to work in',
    createNewOrganization: 'Create new organization',
    noOrganizationsYet: 'No organizations yet',
    createYourFirstOrganizationToGetStartedWithOpenCRM: 'Create your first organization to get started with openCRM',
    createOrganization: 'Create organization',
    yourDataStaysPrivateAndSecure: 'Your data stays private and secure',
    workspaceNameHint: 'This will be your workspace name in openCRM',
    
    // Users Page
    manageUsersAndTeamsInYourOrganization: 'Manage users and teams in your organization',
    users: 'Users',
    addNewMember: 'Add New Member',
    inviteAUserToJoinYourOrganization: 'Invite a user to join your organization',
    emailAddress: 'Email Address',
    userExampleCom: 'user@example.com',
    role: 'Role',
    user: 'User',
    admin: 'Admin',
    addMember: 'Add Member',
    teamMembers: 'Team Members',
    membersInYourOrganization: '{count} member{count !== 1 ? \'s\' : \'\'} in your organization',
    member: 'Member',
    joined: 'Joined',
    you: 'You',
    activateUser: 'Activate user',
    deactivateUser: 'Deactivate user',
    deactivateTeamMember: 'Deactivate Team Member',
    areYouSureYouWantToDeactivate: 'Are you sure you want to deactivate <strong>{name}</strong>? They will no longer be able to access the organization.',
    deactivate: 'Deactivate',
    noTeamMembersFound: 'No team members found',
    createTeamsToGroupUsersForAssignmentsAndAccessControl: 'Create teams to group users for assignments and access control.',
    createTeam: 'Create Team',
    noTeamsYet: 'No teams yet',
    teamsHelpYouOrganizeUsersAndManageAccessToRecords: 'Teams help you organize users and manage access to records. Create your first team to get started.',
    createYourFirstTeam: 'Create Your First Team',
    teamCreatedSuccessfully: 'Team created successfully',
    teamUpdatedSuccessfully: 'Team updated successfully',
    teamDeletedSuccessfully: 'Team deleted successfully',
    userDeactivated: 'User deactivated',
    userActivated: 'User activated',
    
    // Support Page
    openSourceForeverFree: 'AI • Open Source •  Free',
    help: 'Help',
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
    featureRequestsDescription: 'Have an idea? Share your requests and help shape the future of openCRM.',
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
    // Common
    select: '选择...',
    pickADate: '选择日期',
    noneSelected: '未选择',
    title: '标题',
    name: '名称',
    related_to: '相关于',
    invoice_number: '发票编号',
    issue_date: '开具日期',
    due_date: '截止日期',
    estimate_number: '报价单编号',
    client: '客户',
    valid_until: '有效期至',
    sku: 'SKU',
    category: '类别',
    price: '价格',
    amount: '金额',
    filters: '筛选',
    new_template: '新建模板',
    create_template: '创建模板',
    primary_color: '主色调',
    footer: '页脚',
    // Invoice Reports
    total_invoiced: '总开票金额',
    total_collected: '总收款金额',
    outstanding: '未结金额',
    overdue: '逾期',
    last_30_days: '最近30天',
    revenue_collected: '已收收入',
    invoices_created: '创建的发票',
    invoices_paid: '已支付的发票',
    invoice_status: '发票状态',
    revenue_over_time: '收入趋势',
    period: '期间',
    invoices: '发票',
    revenue: '收入',
    total: '总计',
    no_revenue_data: '所选期间无收入数据',
    accounts_receivable_aging: '应收账款账龄',
    current: '当前',
    days_1_30: '1-30天',
    days_31_60: '31-60天',
    days_61_90: '61-90天',
    over_90_days: '90天以上',
    total_outstanding: '总未结金额',
    estimates_overview: '报价单概览',
    pending: '待处理',
    accepted: '已接受',
    declined: '已拒绝',
    daily: '每日',
    weekly: '每周',
    monthly: '每月',
    yearly: '每年',
    // Pagination
    pagination_info: '显示第 {start}–{end} 条，共 {total} 条',
    rows: '每页',
    previous: '上一页',
    next: '下一页',
    // Products page
    columns: '列',
    new_product: '新建产品',
    createNewProduct: '新建产品',
    create_product: '创建产品',
    product_created: '产品已创建',
    product_updated: '产品已更新',
    product_deleted: '产品已删除',
    failed_to_create_product: '创建产品失败',
    failed_to_update_product: '更新产品失败',
    failed_to_delete_product: '删除产品失败',
    are_you_sure_delete_product: '确定要删除此产品吗？',
    search_products: '搜索产品...',
    no_products_yet: '暂无产品',
    create_first_product: '创建您的第一个产品以便在发票中使用',
    // Reports page - invoice count suffix
    invoice_count: '{count} 张发票',
    // Invoice Page (remaining keys)
    partially_paid: '部分支付',
    draft: '草稿',
    sent: '已发送',
    viewed: '已查看',
    paid: '已支付',
    cancelled: '已取消',
    
    // Drawer Labels
    first_name: '名字',
    last_name: '姓氏',
    email: '邮箱',
    phone: '电话',
    company: '公司',
    status: '状态',
    deal_value: '交易金额',
    currency: '货币',
    country: '国家',
    job_title: '职位',
    rating: '评级',
    created: '创建时间',
    created_by: '创建人',
    source: '来源',
    industry: '行业',
    probability: '赢单概率',
    stage: '阶段',
    address: '地址',
    street_address: '街道地址',
    city: '城市',
    state: '州/省份',
    province: '省份',
    postal_code: '邮政编码',
    employees: '员工数',
    notes: '备注',
    not_assigned: '未分配',
    no_contacts: '无联系人',
    no_tags: '无标签',
    write_a_comment: '写评论...',
    send: '发送',
    no_comments_yet: '暂无评论',
    be_the_first_to_comment: '成为第一个评论的人',
    assigned_to: '负责人',
    teams: '团队',
    contacts: '联系人',
    comments: '评论',
    hide_additional_fields: '隐藏其他字段',
    show: '显示',
    more: '更多',
    field: '字段',
    fields: '字段',
    new: '新建',
    show_less: '显示更少',
    view_all: '查看全部',
    task: '任务',
    new_task: '新建任务',
    create_task: '创建任务',
    subject: '主题',
    description: '描述',
    details: '详情',
    cancel: '取消',
    complete: '完成',
    save: '保存',
    reopen: '重新打开',
    // Recurring Invoice
    recurring_invoice: '循环发票',
    active: '活跃',
    client_name: '客户名称',
    client_email: '客户邮箱',
    frequency: '频率',
    custom_days: '自定义天数',
    start_date: '开始日期',
    end_date: '结束日期',
    next_invoice_date: '下次发票日期',
    payment_terms: '付款条款',
    auto_send: '自动发送',
    terms_and_conditions: '条款和条件',
    pause: '暂停',
    activate: '激活',
    save_changes: '保存更改',
    create_recurring: '创建循环发票',
    
    // Login Page
    login: '登录',
    loginToAccount: '登录您的账户',
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
    delete: '删除',
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
    
    // Activity Feed
    activityFeed: '活动动态',
    viewAll: '查看全部',
    showMore: '显示更多（还有 {count} 条）',
    earlier: '更早',
    today: '今天',
    yesterday: '昨天',
    thisWeek: '本周',
    
    // Hot Leads panel
    noHotLeads: '暂无热门线索',
    markLeadsAsHot: '将线索标记为"热门"即可在此显示',
    noFollowUpSet: '未设置跟进',
    tomorrow: '明天',
    daysOverdue: '逾期 {count} 天',
    noCompany: '未关联公司',
    unnamedLead: '未命名线索',
    call: '电话',
    
    // Task List panel
    taskFilterAll: '全部',
    taskFilterOverdue: '逾期',
    taskFilterToday: '今日',
    taskFilterWeek: '本周',
    noTasksFound: '没有任务',
    allCaughtUp: '全部完成！',
    daysAgo: '{count} 天前',
    
    // Opportunities Table panel
    noOpenOpportunities: '暂无进行中商机',
    createOneToStart: '创建一个开始跟踪',
    noAccount: '未关联客户',
    // Stage labels
    stageProspecting: '需求挖掘',
    stageQualification: '资质确认',
    stageProposal: '方案报价',
    stageNegotiation: '商务谈判',
    stageWon: '已赢单',
    stageLost: '已丢单',
    allStages: '全部阶段',
    dueToday: '今天',
    dueTomorrow: '明天',
    daysLeft: '还剩 {count} 天',
    
    // Activity Feed panel
    recentActivity: '最近活动',
    noRecentActivity: '暂无最近活动',
    actionsWillAppear: '操作将在此显示',
    system: '系统',
    // Activity action labels
    actionCreated: '创建了',
    actionUpdated: '更新了',
    actionDeleted: '删除了',
    actionViewed: '查看了',
    actionCommented: '评论了',
    actionAssigned: '分配了',
    // Activity entity labels
    entityAccount: '客户',
    entityLead: '线索',
    entityContact: '联系人',
    entityOpportunity: '商机',
    entityCase: '工单',
    entityTask: '任务',
    entityInvoice: '发票',
    entityEstimate: '报价单',
    entityEvent: '事件',
    // Activity description template
    activityTemplate: '{action}{entity}：{name}',
    
    // Pipeline Chart panel
    pipelineByStage: '按阶段统计管道',
    totalOpenPipeline: '未关闭管道总金额',
    
    // Mini Pipeline
    closedLabel: '已关闭',
    
    // Currency / KPI notes
    currencyOnly: '仅 {currency}',
    currencyWithOthers: '仅 {currency}（另有 {count} 笔为其他货币）',
    
    // Opportunities Table
    opportunities: '最近商机',
    
    // Task List
    tasks: '最近任务',
    
    // Sidebar Menu
    leads: '线索',
    accounts: '账户',
    deals: '交易',
    tickets: '工单',
    tasksMenu: '任务',
    allInvoices: '所有发票',
    estimates: '报价单',
    products: '产品',
    recurring: '循环发票',
    templates: '模板',
    reports: '报表',
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
    
    // User dropdown menu
    profile: '个人资料',
    usersAndTeams: '用户和团队',
    organizations: '组织管理',
    settings: '系统设置',
    tags: '标签管理',
    signOut: '退出登录',
    english: '英语',
    chinese: '中文',
    productBrand: 'openCRM',
    
    // Leads Page
    toggleColumns: '切换列',
    newLead: '新建线索',
    searchLeads: '搜索线索...',
    noLeadsFound: '未找到线索',
    createNewLead: '创建一个新线索开始',
    
    // Contacts Page
    newContact: '新建联系人',
    searchContacts: '搜索联系人...',
    noContactsFound: '未找到联系人',
    createNewContact: '创建一个新联系人开始',
    contact: '联系人',
    owner: '负责人',
    unassigned: '未分配',
    creating: '创建中...',
    createContact: '创建联系人',
    saving: '保存中...',
    
    // Accounts Page
    account: '客户',
    newAccount: '新建客户',
    searchAccounts: '搜索客户...',
    noAccountsFound: '未找到客户',
    tryAdjustingFilters: '尝试调整筛选条件或创建新客户',
    all: '全部',
    closed: '已关闭',
    allIndustries: '所有行业',
    website: '网站',
    accountName: '客户名称',
    related: '相关',
    cases: '案例',
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
    noProductsAddedYet: '尚未添加产品',
    addProduct: '添加产品',
    selectProduct: '选择产品...',
    markWon: '标记为赢单',
    markLost: '标记为输单',
    createOpportunity: '创建商机',
    thisWillCreateANewInvoice: '这将从该商机创建一个新发票，包含',
    product: '产品',
    totaling: '总计',
    createInvoice: '创建发票',
    // Cases Page
    case: '工单',
    caseTitle: '工单标题',
    newCase: '新建工单',
    searchCases: '搜索工单...',
    noCasesFound: '未找到工单',
    priority: '优先级',
    type: '类型',
    list: '列表',
    board: '看板',
    closeCase: '关闭工单',
    saveChanges: '保存更改',
    // Tasks Page
    calendar: '日历',
    newTask: '新建任务',
    searchTasks: '搜索任务...',
    dueDate: '截止日期',
    // Invoices Page
    newInvoice: '新建发票',
    searchInvoices: '搜索发票...',
    noInvoicesYet: '暂无发票',
    createFirstInvoice: '创建您的第一张发票以开始',
    issueDate: '开具日期',
    recurringInvoices: '循环发票',
    invoiceReports: '发票报表',
    invoiceTemplates: '发票模板',
    inactive: '非活跃',
    biweekly: '每两周',
    quarterly: '每季度',
    semiAnnually: '每半年',
    custom: '自定义',
    bi_weekly: '每两周',
    semi_annually: '每半年',
    paused: '已暂停',
    // Invoice detail page
    no_client_name: '无客户名称',
    po_number: '订单号',
    billing_period: '计费周期',
    invoice_title_placeholder: '发票标题',
    po_placeholder: '采购订单号',
    billing_period_placeholder: '如：2024年12月',
    bill_from: '开票方',
    bill_to: '收件方',
    select_account: '选择客户',
    no_account: '无客户',
    select_contact: '选择联系人',
    no_name: '无名称',
    line_items: '明细项目',
    quantity: '数量',
    rate: '单价',
    item_name: '项目名称',
    item_description_placeholder: '附加说明（可选）',
    add_line_item: '添加明细',
    tax: '税',
    amount_paid: '已付金额',
    amount_due_label: '应付金额',
    notes_placeholder: '客户可见的备注...',
    payment_terms_placeholder: '付款条款...',
    // Invoice detail toast messages
    please_add_line_item: '请至少添加一个有名称/描述且单价大于 0 的明细项目',
    invoice_updated: '发票已更新',
    failed_to_update_invoice: '更新发票失败',
    invoice_cancelled: '发票已取消',
    failed_to_cancel_invoice: '取消发票失败',
    invoice_sent: '发票已发送',
    failed_to_send_invoice: '发送发票失败',
    pdf_downloaded: 'PDF 已下载',
    failed_to_download_pdf: '下载 PDF 失败',
    due_on_receipt: '收到即付',
    net_7: '7天内',
    net_15: '15天内',
    net_30: '30天内',
    net_45: '45天内',
    net_60: '60天内',
    net_90: '90天内',
    subtotal: '小计',
    invoices_generated: '已生成发票',
    terms_conditions: '条款与条件',
    next_invoice: '下次发票',
    generated: '已生成',
    statistics: '统计',
    new_recurring: '新建循环',
    search_recurring: '搜索循环发票...',
    no_recurring_invoices: '暂无循环发票',
    create_first_recurring: '创建您的第一个循环发票模板',
    recurring_created: '循环发票已创建',
    recurring_updated: '循环发票已更新',
    recurring_deleted: '循环发票已删除',
    failed_to_create_recurring: '创建循环发票失败',
    failed_to_update_recurring: '更新循环发票失败',
    failed_to_delete_recurring: '删除循环发票失败',
    status_updated: '状态已更新',
    failed_to_update_status: '更新状态失败',
    are_you_sure_delete_recurring: '确定要删除此循环发票吗？',
    // Estimates Page
    estimate: '报价单',
    newEstimate: '新建报价单',
    searchEstimates: '搜索报价单...',
    noEstimatesYet: '暂无报价单',
    createFirstEstimate: '创建您的第一张报价单以开始',
    createEstimate: '创建报价单',
    expired: '已过期',
    convertToInvoice: '转换为发票',
    // Invoice Detail Page
    print: '打印',
    downloading: '下载中...',
    cancelInvoice: '取消发票？',
    cancelInvoiceDescription: '这将取消发票 {invoiceNumber}。已取消的发票无法发送或编辑。',
    keepInvoice: '保留发票',
    // Settings
    myAccount: '我的账户',
    theme: '主题',
    light: '浅色',
    dark: '深色',
    language: '语言',
    
    // Tags Page
    createAndManageTags: '创建和管理标签以组织联系人、公司、交易和工单。',
    createTag: '创建标签',
    searchTags: '搜索标签...',
    archived: '已归档',
    tagName: '标签名称',
    actions: '操作',
    archiveTag: '归档标签',
    showing: '显示 {count} / {total}',
    activeTags: '个活跃标签',
    restore: '恢复',
    archivedTags: '个已归档标签',
    tagCreatedSuccessfully: '标签创建成功',
    tagUpdatedSuccessfully: '标签更新成功',
    tagArchivedSuccessfully: '标签归档成功',
    tagRestoredSuccessfully: '标签恢复成功',
    operationSuccessful: '操作成功',
    tagsHelpOrganize: '标签帮助您组织和细分记录。',
    tagNamePlaceholder: '例如，VIP 客户、热门线索',
    color: '颜色',
    tagDescriptionPlaceholder: '描述此标签的用途...',
    preview: '预览',
    editTag: '编辑标签',
    updateTagNameColorDescription: '更新标签名称、颜色或描述。',
    
    // Organization Settings Page
    organizationSettings: '组织设置',
    manageYourOrganizationPreferences: '管理您的组织偏好设置',
    organizationIdentity: '组织标识',
    organizationName: '组织名称',
    organizationNamePlaceholder: 'Acme 公司',
    companyDomain: '公司域名',
    companyDomainPlaceholder: 'yourcompany.com',
    aboutYourOrganization: '关于您的组织',
    aboutYourOrganizationPlaceholder: '简要描述您的组织、行业和业务...',
    regionalSettings: '区域设置',
    currencyAndLocale: '货币和区域',
    configureDefaultCurrencyAndRegionalPreferences: '配置默认货币和区域偏好设置',
    defaultCurrency: '默认货币',
    appliedToOpportunitiesInvoicesAndFinancialReports: '适用于商机、发票和财务报表',
    defaultCountry: '默认国家',
    usedForAddressesDateFormatsAndLocaleSettings: '用于地址、日期格式和区域设置',
    currencyPreview: '货币预览',
    sample: '示例',
    settingsSynced: '设置已同步',
    lastUpdated: '最后更新',
    saveAllChanges: '保存所有更改',
    organizationSettingsUpdated: '组织设置已更新',
    
    // Org Selection Page
    selectOrganization: '选择组织',
    selectAnOrganization: '选择一个组织',
    chooseWhichOrganizationYouWouldLikeToWorkIn: '选择您想要工作的组织',
    createNewOrganization: '创建新组织',
    noOrganizationsYet: '暂无组织',
    createYourFirstOrganizationToGetStartedWithOpenCRM: '创建您的第一个组织以开始使用 openCRM',
    createOrganization: '创建组织',
    yourDataStaysPrivateAndSecure: '您的数据保持私密和安全',
    workspaceNameHint: '这将是您在 openCRM 中的工作区名称',
    
    // Users Page
    manageUsersAndTeamsInYourOrganization: '管理组织中的用户和团队',
    users: '用户',
    addNewMember: '添加新成员',
    inviteAUserToJoinYourOrganization: '邀请用户加入您的组织',
    emailAddress: '邮箱地址',
    userExampleCom: 'user@example.com',
    role: '角色',
    user: '用户',
    admin: '管理员',
    addMember: '添加成员',
    teamMembers: '团队成员',
    membersInYourOrganization: '您的组织中有 {count} 名成员',
    member: '成员',
    joined: '加入时间',
    you: '您',
    activateUser: '激活用户',
    deactivateUser: '停用用户',
    deactivateTeamMember: '停用团队成员',
    areYouSureYouWantToDeactivate: '您确定要停用 <strong>{name}</strong> 吗？他们将无法再访问组织。',
    deactivate: '停用',
    noTeamMembersFound: '未找到团队成员',
    createTeamsToGroupUsersForAssignmentsAndAccessControl: '创建团队以对用户进行分组，用于分配任务和访问控制。',
    createTeam: '创建团队',
    noTeamsYet: '暂无团队',
    teamsHelpYouOrganizeUsersAndManageAccessToRecords: '团队帮助您组织用户并管理对记录的访问。创建您的第一个团队以开始使用。',
    createYourFirstTeam: '创建您的第一个团队',
    teamCreatedSuccessfully: '团队创建成功',
    teamUpdatedSuccessfully: '团队更新成功',
    teamDeletedSuccessfully: '团队删除成功',
    userDeactivated: '用户已停用',
    userActivated: '用户已激活',
    
    // Support Page
    openSourceForeverFree: '智能 • 开源 • 免费',
    help: '帮助',
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
    featureRequestsDescription: '有想法吗？分享您的请求，帮助塑造 openCRM 的未来。',
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
 * Svelte 5 reactive i18n helper.
 * Returns a reactive { lang, t } tuple so components don't need to
 * manually listen to `languageChange` events.
 *
 * Usage in a component:
 *   const { lang, t: tr } = useI18n();
 *   <h1>{tr('dashboard')}</h1> // switches automatically when language changes
 */
export const useI18n = () => {
  let lang = $state(getCurrentLanguage());

  if (typeof window !== 'undefined') {
    $effect(() => {
      const onStorage = (e) => {
        if (e.key === 'language') lang = e.newValue || 'en';
      };
      const onCustom = (e) => {
        lang = e.detail.language || 'en';
      };
      window.addEventListener('storage', onStorage);
      window.addEventListener('languageChange', onCustom);
      return () => {
        window.removeEventListener('storage', onStorage);
        window.removeEventListener('languageChange', onCustom);
      };
    });
  }

  const tr = (key, params) => t(key, params, lang);
  return { lang, t: tr };
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
 * @param {object} params Optional parameters for interpolation
 * @param {string} lang Optional language code (defaults to current language)
 * @returns {string} Translated text
 */
export const t = (key, params, lang = getCurrentLanguage()) => {
  if (!key) return '';
  // Handle nested keys (e.g., 'focusBar.overdueTasks')
  const keys = key.split('.');

  // Walk helper: traverse dict by key-parts, return undefined on any missing node
  const walk = (dict) => {
    let node = dict;
    for (const k of keys) {
      if (node === null || node === undefined || typeof node !== 'object') return undefined;
      node = node[k];
      if (node === undefined) return undefined;
    }
    return node;
  };

  let result = walk(translations[lang]);
  // Fallback to English if key not found in requested language
  if (result === undefined) result = walk(translations.en);
  // Ultimate fallback: return the raw key so nothing breaks
  if (result === undefined) return key;

  // Interpolate parameters (only if result is a string)
  if (typeof result === 'string' && params && typeof params === 'object') {
    return result.replace(/\{([^}]+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  return typeof result === 'string' ? result : String(result ?? key);
};

/**
 * Get greeting based on time of day and current language
 * @param {string} lang Optional language code (defaults to current language)
 * @returns {string} Greeting text
 */
export const getTranslatedGreeting = (lang = getCurrentLanguage()) => {
  const hour = new Date().getHours();
  const dict = translations[lang] || translations.en;
  const greetings = (dict && dict.greeting) ? dict.greeting : (translations.en && translations.en.greeting ? translations.en.greeting : { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' });

  if (hour < 12) {
    return greetings.morning;
  } else if (hour < 17) {
    return greetings.afternoon;
  } else {
    return greetings.evening;
  }
};