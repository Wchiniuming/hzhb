# 合作伙伴支撑能力全景管理平台

## 项目简介

这是一个全栈管理平台，用于管理合作伙伴的支撑能力，包括开发人员管理、任务登记管理、厂商能力评估、正向改进管理和风险库管理等模块。

## 技术栈

### 后端 (apps/api)
- **框架**: NestJS 11
- **数据库**: SQLite (本地开发) / PostgreSQL (生产环境)
- **ORM**: Prisma 5
- **认证**: JWT + Passport
- **验证**: class-validator, class-transformer

### 前端 (apps/web)
- **框架**: Next.js 16
- **UI库**: Ant Design 5
- **状态管理**: React hooks

### 组件库 (packages/ui)
- 共享 UI 组件

## 项目结构

```
hzhb/
├── apps/
│   ├── api/                    # NestJS 后端
│   │   ├── src/
│   │   │   ├── auth/          # 认证模块
│   │   │   ├── modules/       # 业务模块
│   │   │   │   ├── developers/    # 开发人员管理
│   │   │   │   ├── tasks/       # 任务登记管理
│   │   │   │   ├── vendors/      # 厂商能力评估
│   │   │   │   ├── improvements/ # 正向改进管理
│   │   │   │   ├── risks/       # 风险库管理
│   │   │   │   ├── partners/     # 合作伙伴管理
│   │   │   │   ├── users/       # 用户管理
│   │   │   │   └── roles/        # 角色权限管理
│   │   │   ├── prisma/        # Prisma 配置
│   │   │   └── config/         # 配置文件
│   │   └── prisma/
│   │       ├── schema.prisma   # 数据库 Schema
│   │       └── dev.db          # SQLite 数据库文件
│   └── web/                    # Next.js 前端
│       └── app/
│           ├── (auth)/         # 认证页面
│           └── (dashboard)/     # 仪表盘页面
├── packages/
│   ├── ui/                    # 共享 UI 组件
│   └── types/                  # 共享类型定义
├── docker-compose.yml          # Docker 配置 (PostgreSQL)
└── init-db.sql                 # 数据库初始化脚本
```

## 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 1. 安装依赖

```bash
# 安装所有依赖
npm install
```

### 2. 配置环境变量

后端配置文件位于 `apps/api/.env`：

```env
DATABASE_URL="file:./dev.db"
JWT_PRIVATE_KEY_PATH=./src/auth/keys/private.pem
JWT_PUBLIC_KEY_PATH=./src/auth/keys/public.pem
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
PORT=3001
```

### 3. 生成 Prisma 客户端

```bash
cd apps/api
npx prisma generate
```

### 4. 运行数据库迁移

```bash
cd apps/api
npx prisma migrate dev --name init
```

### 5. 启动开发服务器

**后端服务** (端口 3001)：
```bash
cd apps/api
npm run start:dev
```

**前端服务** (端口 3000)：
```bash
cd apps/web
npm run dev
```

### 6. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:3001

## 生产环境部署

### 使用 PostgreSQL

1. 修改 `apps/api/.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/hzhb"
```

2. 修改 `apps/api/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. 运行迁移:
```bash
cd apps/api
npx prisma migrate deploy
```

### 使用 Docker Compose

```bash
# 启动 PostgreSQL
docker-compose up -d postgres

# 运行迁移
cd apps/api
npx prisma migrate deploy
```

## 功能模块

### 1. 开发人员管理
- 开发人员信息录入和审核
- 技能标签管理
- 工作经历管理
- 证书管理

### 2. 任务登记管理
- 任务创建和分配
- 进度跟踪
- 延期申请和审批
- 交付物提交和验收

### 3. 厂商能力评估
- 评估指标体系管理
- 评估计划制定
- 自动化评分和手动评分
- 评估报告生成

### 4. 正向改进管理
- 改进需求发起
- 改进计划管理
- 进度跟踪
- 验收和闭环

### 5. 风险库管理
- 风险类型管理
- 风险等级管理
- 风险信息录入

### 6. 用户管理
- 用户注册和登录
- RBAC 权限管理
- 角色管理

## API 文档

### 认证
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/refresh` - 刷新令牌
- `POST /auth/logout` - 退出登录

### 开发人员
- `GET /developers` - 获取开发人员列表
- `GET /developers/:id` - 获取开发人员详情
- `POST /developers` - 创建开发人员
- `PUT /developers/:id` - 更新开发人员
- `DELETE /developers/:id` - 删除开发人员

### 任务
- `GET /tasks` - 获取任务列表
- `GET /tasks/:id` - 获取任务详情
- `POST /tasks` - 创建任务
- `PUT /tasks/:id` - 更新任务
- `DELETE /tasks/:id` - 删除任务

### 其他模块
- `/assessment/*` - 评估相关接口
- `/improvements/*` - 改进相关接口
- `/risks/*` - 风险相关接口
- `/partners/*` - 合作伙伴相关接口
- `/users/*` - 用户相关接口
- `/roles/*` - 角色相关接口

## 常用命令

```bash
# 开发
npm run dev           # 启动所有开发服务

# 构建
npm run build         # 构建所有项目

# 代码检查
npm run lint          # 检查所有项目代码

# 数据库操作
cd apps/api
npx prisma studio     # 打开 Prisma Studio
npx prisma migrate dev --name xxx  # 创建迁移
npx prisma migrate deploy  # 部署迁移
npx prisma db push    # 推送 Schema 到数据库
npx prisma generate   # 重新生成 Prisma Client
```

## 注意事项

1. **本地开发使用 SQLite**：不需要额外的数据库服务
2. **生产环境使用 PostgreSQL**：需要配置相应的环境变量
3. **前端 API 代理**：前端通过 `next.config.ts` 中的 rewrites 配置，将 `/api/*` 请求代理到后端 `localhost:3001`
4. **JWT 密钥**：生产环境请生成新的 RSA 密钥对

## 许可证

ISC
