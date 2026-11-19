"""Commission domain constants shared by models, services and views."""

# Commission base amount口径
BASE_TYPES = (
    ("NET", "Net (excl. tax)"),
    ("GROSS", "Gross (incl. tax)"),
    ("GROSS_PROFIT", "Gross profit"),
    ("MARGIN_RATE", "Gross margin rate"),
    ("CASH", "Cash received"),
)

# 归属角色：客户归属人 / 线索来源人
CREDIT_ROLES = (
    ("ACCOUNT_OWNER", "Account Owner"),
    ("LEAD_SOURCE", "Lead Source"),
)

# 客户口径
CUSTOMER_SCOPES = (
    ("ALL", "All customers"),
    ("NEW", "New customers only"),
    ("EXISTING", "Existing customers only"),
)

# 政策适用范围
POLICY_SCOPES = (
    ("ALL", "All products"),
    ("CATEGORY", "Product category"),
    ("PRODUCT", "Specific product"),
)

# 提成两阶段
ENTRY_STAGES = (
    ("PROVISIONAL", "Provisional (on invoice)"),
    ("EARNED", "Earned (on payment)"),
)

# 账本状态
ENTRY_STATUSES = (
    ("ACTIVE", "Active"),
    ("REVERSED", "Reversed"),
)

# 政策版本化动作：重大操作需二次确认
CONFIRM_REQUIRED_ACTIONS = ("delete", "recalculate", "settle")
