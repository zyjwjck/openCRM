# openCRM

一个现代化的、AI 驱动的 CRM 平台，结合了智能体 ,基于 Django REST Framework 和 SvelteKit 构建，通过智能代理增强，为未来的客户关系管理做好准备。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12+-green.svg)
![Django](https://img.shields.io/badge/django-5.x-green.svg)
![SvelteKit](https://img.shields.io/badge/sveltekit-2.x-orange.svg)
![Svelte](https://img.shields.io/badge/svelte-5-orange.svg)
![AI](https://img.shields.io/badge/AI-powered-blueviolet.svg)

## 项目概述

openCRM 是一个功能齐全的客户关系管理系统，专为初创企业和小型企业设计，增强了前沿的 AI 能力。它结合了强大的 Django REST API 后端和现代化的 SvelteKit 前端，采用多租户架构和 PostgreSQL 行级安全性 (RLS) 实现企业级数据隔离，并集成了智能 AI 代理以实现自动化工作流程和增强决策能力。

本项目基于两个开源基础构建：
- [Bottle-CRM](https://github.com/MicroPyramid/Django-CRM.git) - 一个强大的 CRM 平台
- [nanobot](https://github.com/HKUDS/nanobot) - 一个超轻量级的个人 AI 助手

## 功能特性

### 核心 CRM 模块
- **线索管理** - 通过销售管道跟踪和管理销售线索
- **客户管理** - 管理公司/组织记录
- **联系人管理** - 存储和组织联系信息
- **商机管理** - 跟踪交易和销售机会
- **客户支持** - 客户支持案例管理
- **任务管理** - 带有日历和看板视图的任务管理
- **发票管理** - 创建和管理发票

### AI 驱动功能
- **智能线索评分** - AI 驱动的线索资格认证和优先级排序
- **自动跟进** - 智能提醒和个性化外展建议
- **预测分析** - 销售和客户行为的预测和趋势分析
- **自然语言处理** - 用于数据输入和检索的对话界面
- **智能文档处理** - 自动从文档中提取信息
- **24/7 市场分析** - 实时洞察，为销售和营销策略提供信息

### 平台特性
- **多租户架构** - PostgreSQL RLS 确保组织间的安全数据隔离
- **JWT 认证** - 安全的基于令牌的认证
- **团队管理** - 组织用户组成团队，具有基于角色的访问权限
- **活动跟踪** - 全面的审计日志和活动历史
- **评论和附件** - 通过评论和文件附件在任何记录上进行协作
- **标签系统** - 灵活的标签系统，用于组织记录
- **电子邮件集成** - AWS SES 集成，用于事务性电子邮件
- **后台任务** - Celery + Redis 用于异步任务处理

## 技术栈

### 后端
- **Django 5.x** 与 Django REST Framework
- **PostgreSQL** 与行级安全性 (RLS)
- **Redis** 用于缓存和 Celery 代理
- **Celery** 用于后台任务处理
- **JWT** 用于认证
- **AWS S3** 用于文件存储
- **AWS SES** 用于电子邮件传递

### 前端
- **SvelteKit 2.x** 与 Svelte 5 (runes)
- **TailwindCSS 4** 用于样式设计
- **shadcn-svelte** UI 组件
- **Zod** 用于 schema 验证
- **Axios** 用于 API 通信
- **Lucide** 图标

### AI 组件
- **nanobot** - 超轻量级 AI 代理框架（约 4,000 行代码）
- **多 LLM 支持** - 集成各种 LLM 提供商（OpenAI、Anthropic、Google 等）
- **本地 LLM 支持** - 使用 vLLM 本地运行模型
- **语音转录** - 集成语音功能
- **多渠道集成** - Telegram、Discord、WhatsApp 和飞书

## 快速开始

### 先决条件
- Python 3.12+
- Node.js 18+
- PostgreSQL 14+
- Redis

### 安装

#### 1. 克隆仓库
```bash
git clone https://github.com/zyjwjck/openCRM.git
cd openCRM
```

#### 2. 后端设置
```bash
# 创建并激活虚拟环境
cd backend
python -m venv .openCRM-venv
# 在 Windows 上：
.openCRM-venv\Scripts\activate.bat
# 在 macOS/Linux 上：
source .openCRM-venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 设置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库和其他设置

# 运行迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 启动开发服务器
python manage.py runserver
```

#### 3. 前端设置
```bash
# 在新终端中，从项目根目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 4. AI 代理设置
```bash
# 在新终端中，从项目根目录
cd agent

# 安装依赖
pip install -e .

# 初始化Agent服务器
nanobot onboard
```

### 访问应用
- **前端**：http://localhost:5173
- **API 文档**：http://localhost:8000/swagger-ui/
- **管理面板**：http://localhost:8000/admin/
- **AI 代理**：http://localhost:3000（或按配置）

## AI 代理配置

AI 代理（基于 nanobot）需要 LLM 提供商的 API 密钥。在 `agent/.nanobot/config.json` 中配置您的设置：

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-xxx"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5"
    }
  }
}
```

有关更多配置选项，请参考 [nanobot 文档](https://github.com/HKUDS/nanobot#configuration)。

## 项目结构

```
openCRM/
├── backend/                 # Django REST API
│   ├── accounts/           # 账户模块
│   ├── cases/              # 案例模块
│   ├── common/             # 共享模型、工具、RLS
│   ├── contacts/           # 联系人模块
│   ├── invoices/           # 发票模块
│   ├── leads/              # 线索模块
│   ├── opportunity/        # 商机模块
│   ├── tasks/              # 任务模块
│   └── crm/                # Django 项目设置
├── frontend/               # SvelteKit 前端
│   ├── src/
│   │   ├── lib/           # 组件、存储、工具
│   │   └── routes/        # SvelteKit 路由
│   │       ├── (app)/     # 已认证应用路由
│   │       └── (no-layout)/ # 认证页面（登录等）
│   └── static/            # 静态资产
├── agent/                  # AI 代理（基于 nanobot）
│   ├── agent/              # 核心代理逻辑
│   ├── skills/             # 捆绑技能
│   ├── channels/           # 通信渠道
│   └── config/             # 配置
└── docker/                 # Docker 配置
```

## 多租户和安全性

openCRM 使用 PostgreSQL 行级安全性 (RLS) 确保组织间的完整数据隔离。每个数据库查询都会自动按组织上下文进行过滤，提供企业级安全性。

```bash
# 检查 RLS 状态
python manage.py manage_rls --status

# 验证 RLS 用户配置
python manage.py manage_rls --verify-user

# 测试数据隔离
python manage.py manage_rls --test
```

## 开发

### 后端命令

```bash
# 运行测试
cd backend && pytest

# 格式化代码
black . && isort .

# 检查依赖
pipdeptree
pip-check -H
```

### 前端命令

```bash
cd frontend

# 类型检查
npm run check

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### AI 代理命令

```bash
cd agent

# 启动代理
npm run dev

# 检查代理状态
nanobot status

# 配置代理
nanobot onboard
```

## API 文档

API 遵循 RESTful 约定：

```
GET/POST       /api/<module>/                 # 列表/创建
GET/PUT/DELETE /api/<module>/<pk>/            # 详情/更新/删除
GET/POST       /api/<module>/comment/<pk>/    # 评论
GET/POST       /api/<module>/attachment/<pk>/ # 附件
```

运行后端时，交互式 API 文档可在 `/swagger-ui/` 获得。

## 贡献

我们欢迎贡献！请参阅我们的贡献指南了解详情。

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 社区

- **问题**：[GitHub Issues](https://github.com/zyjwjck/openCRM/issues)
- **原始项目问题**：[Django-CRM Issues](https://github.com/MicroPyramid/Django-CRM/issues)
- **AI 代理问题**：[nanobot Issues](https://github.com/HKUDS/nanobot/issues)

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 致谢

本项目基于以下开源项目构建：

- **Django-CRM** 由 [MicroPyramid](https://github.com/MicroPyramid/Django-CRM.git) 开发
- **nanobot** 由 [HKUDS](https://github.com/HKUDS/nanobot) 开发

我们感谢这些项目的所有贡献者的宝贵工作。

## 贡献者

这个项目的存在归功于所有做出贡献的人。

![Contributors](https://opencollective.com/django-crm/contributors.svg?width=890&button=false)

## 未来路线图

- [ ] 增强的 AI 驱动线索资格认证
- [ ] 预测性销售预测
- [ ] 智能客户细分
- [ ] 自动化客户支持工作流程
- [ ] 语音启用的 CRM 交互
- [ ] 多语言 AI 能力
- [ ] 高级分析仪表板
- [ ] 与更多业务工具集成

---

<p align="center">
  <em>openCRM: 客户关系管理的未来</em>
</p>