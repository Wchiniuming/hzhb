-- =====================================================
-- 合作伙伴支撑能力全景管理平台 - 数据库初始化脚本
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 创建角色 (从 UserRole 枚举)
-- =====================================================
INSERT INTO "Role" (id, name, description) VALUES
  (uuid_generate_v4(), 'SYSTEM_ADMIN', '系统管理员 - 拥有系统全部权限'),
  (uuid_generate_v4(), 'BUSINESS_ADMIN', '业务管理员 - 管理业务模块'),
  (uuid_generate_v4(), 'AUDITOR', '审计人员 - 查看审计日志和报表'),
  (uuid_generate_v4(), 'PARTNER_ADMIN', '合作伙伴管理员 - 管理合作伙伴人员'),
  (uuid_generate_v4(), 'DEVELOPER', '开发人员 - 任务执行者'),
  (uuid_generate_v4(), 'MANAGEMENT', '管理层 - 查看数据报表');

-- =====================================================
-- 创建权限 (按模块分组)
-- =====================================================
-- 合作伙伴管理权限
INSERT INTO "Permission" (id, name, module, action, description) VALUES
  (uuid_generate_v4(), 'partner:read', 'partners', 'read', '查看合作伙伴'),
  (uuid_generate_v4(), 'partner:create', 'partners', 'create', '创建合作伙伴'),
  (uuid_generate_v4(), 'partner:update', 'partners', 'update', '更新合作伙伴'),
  (uuid_generate_v4(), 'partner:delete', 'partners', 'delete', '删除合作伙伴');

-- 开发人员管理权限
INSERT INTO "Permission" (id, name, module, action, description) VALUES
  (uuid_generate_v4(), 'developer:read', 'developers', 'read', '查看开发人员'),
  (uuid_generate_v4(), 'developer:create', 'developers', 'create', '创建开发人员'),
  (uuid_generate_v4(), 'developer:update', 'developers', 'update', '更新开发人员'),
  (uuid_generate_v4(), 'developer:delete', 'developers', 'delete', '删除开发人员'),
  (uuid_generate_v4(), 'developer:approve', 'developers', 'approve', '审核开发人员');

-- 任务管理权限
INSERT INTO "Permission" (id, name, module, action, description) VALUES
  (uuid_generate_v4(), 'task:read', 'tasks', 'read', '查看任务'),
  (uuid_generate_v4(), 'task:create', 'tasks', 'create', '创建任务'),
  (uuid_generate_v4(), 'task:update', 'tasks', 'update', '更新任务'),
  (uuid_generate_v4(), 'task:delete', 'tasks', 'delete', '删除任务'),
  (uuid_generate_v4(), 'task:assign', 'tasks', 'assign', '分配任务'),
  (uuid_generate_v4(), 'task:approve', 'tasks', 'approve', '审批任务');

-- 评估管理权限
INSERT INTO "Permission" (id, name, module, action, description) VALUES
  (uuid_generate_v4(), 'assessment:read', 'assessments', 'read', '查看评估'),
  (uuid_generate_v4(), 'assessment:create', 'assessments', 'create', '创建评估'),
  (uuid_generate_v4(), 'assessment:update', 'assessments', 'update', '更新评估'),
  (uuid_generate_v4(), 'assessment:submit', 'assessments', 'submit', '提交评估'),
  (uuid_generate_v4(), 'assessment:approve', 'assessments', 'approve', '审批评估');

-- 改进管理权限
INSERT INTO "Permission" (id, name, module, action, description) VALUES
  (uuid_generate_v4(), 'improvement:read', 'improvements', 'read', '查看改进'),
  (uuid_generate_v4(), 'improvement:create', 'improvements', 'create', '创建改进'),
  (uuid_generate_v4(), 'improvement:update', 'improvements', 'update', '更新改进'),
  (uuid_generate_v4(), 'improvement:approve', 'improvements', 'approve', '审批改进');

-- 风险管理权限
INSERT INTO "Permission" (id, name, module, action, description) VALUES
  (uuid_generate_v4(), 'risk:read', 'risks', 'read', '查看风险'),
  (uuid_generate_v4(), 'risk:create', 'risks', 'create', '创建风险'),
  (uuid_generate_v4(), 'risk:update', 'risks', 'update', '更新风险'),
  (uuid_generate_v4(), 'risk:delete', 'risks', 'delete', '删除风险');

-- 用户管理权限
INSERT INTO "Permission" (id, name, module, action, description) VALUES
  (uuid_generate_v4(), 'user:read', 'users', 'read', '查看用户'),
  (uuid_generate_v4(), 'user:create', 'users', 'create', '创建用户'),
  (uuid_generate_v4(), 'user:update', 'users', 'update', '更新用户'),
  (uuid_generate_v4(), 'user:delete', 'users', 'delete', '删除用户'),
  (uuid_generate_v4(), 'role:manage', 'roles', 'manage', '管理角色权限');

-- =====================================================
-- 为 SYSTEM_ADMIN 角色分配所有权限
-- =====================================================
INSERT INTO "RolePermission" (roleId, permissionId)
SELECT r.id, p.id FROM "Role" r, "Permission" p WHERE r.name = 'SYSTEM_ADMIN';

-- 为 BUSINESS_ADMIN 分配业务权限
INSERT INTO "RolePermission" (roleId, permissionId)
SELECT r.id, p.id FROM "Role" r, "Permission" p 
WHERE r.name = 'BUSINESS_ADMIN' 
AND p.module IN ('partners', 'developers', 'tasks', 'assessments', 'improvements');

-- 为 AUDITOR 分配只读权限
INSERT INTO "RolePermission" (roleId, permissionId)
SELECT r.id, p.id FROM "Role" r, "Permission" p 
WHERE r.name = 'AUDITOR' 
AND p.action = 'read';

-- 为 PARTNER_ADMIN 分配合作伙伴和开发人员权限
INSERT INTO "RolePermission" (roleId, permissionId)
SELECT r.id, p.id FROM "Role" r, "Permission" p 
WHERE r.name = 'PARTNER_ADMIN' 
AND p.module IN ('partners', 'developers');

-- 为 DEVELOPER 分配任务权限
INSERT INTO "RolePermission" (roleId, permissionId)
SELECT r.id, p.id FROM "Role" r, "Permission" p 
WHERE r.name = 'DEVELOPER' 
AND p.module IN ('tasks', 'improvements') 
AND p.action IN ('read', 'update');

-- =====================================================
-- 创建默认系统管理员用户 (密码: admin123)
-- =====================================================
INSERT INTO "User" (id, username, passwordHash, name, email, phone, roleId)
SELECT 
  uuid_generate_v4(),
  'admin',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.nCPMJ1V3QXFM2G',  -- admin123
  '系统管理员',
  'admin@hzhb.com',
  '13800138000',
  id
FROM "Role" WHERE name = 'SYSTEM_ADMIN';

-- =====================================================
-- 创建默认合作伙伴
-- =====================================================
INSERT INTO "Partner" (id, name, contactInfo, status) VALUES
  (uuid_generate_v4(), '华钦科技', '{"email": "contact@huaqin.com", "phone": "400-123-4567", "address": "上海市浦东新区张江高科技园区"}', 'ACTIVE'),
  (uuid_generate_v4(), '博雅软件', '{"email": "contact@boya.com", "phone": "400-234-5678", "address": "北京市海淀区中关村软件园"}', 'ACTIVE'),
  (uuid_generate_v4(), '创新科技', '{"email": "contact@cxkj.com", "phone": "400-345-6789", "address": "深圳市南山区科技园"}', 'ACTIVE'),
  (uuid_generate_v4(), '未来数字', '{"email": "contact@wlsz.com", "phone": "400-456-7890", "address": "杭州市滨江区海创基地"}', 'ACTIVE');

-- =====================================================
-- 创建技能标签
-- =====================================================
INSERT INTO "SkillTag" (id, name, parentId, description) VALUES
  (uuid_generate_v4(), '前端开发', NULL, '前端技术开发能力'),
  (uuid_generate_v4(), '后端开发', NULL, '后端技术开发能力'),
  (uuid_generate_v4(), '移动开发', NULL, '移动端开发能力'),
  (uuid_generate_v4(), '数据库', NULL, '数据库设计和管理能力'),
  (uuid_generate_v4(), 'DevOps', NULL, '运维和持续集成能力'),
  (uuid_generate_v4(), 'JavaScript', '前端开发', 'JavaScript/TypeScript'),
  (uuid_generate_v4(), 'React', '前端开发', 'React技术栈'),
  (uuid_generate_v4(), 'Vue', '前端开发', 'Vue技术栈'),
  (uuid_generate_v4(), 'Angular', '前端开发', 'Angular技术栈'),
  (uuid_generate_v4(), 'Java', '后端开发', 'Java技术'),
  (uuid_generate_v4(), 'Python', '后端开发', 'Python技术'),
  (uuid_generate_v4(), 'Node.js', '后端开发', 'Node.js技术'),
  (uuid_generate_v4(), 'Go', '后端开发', 'Go语言'),
  (uuid_generate_v4(), 'iOS', '移动开发', 'iOS开发'),
  (uuid_generate_v4(), 'Android', '移动开发', 'Android开发'),
  (uuid_generate_v4(), 'PostgreSQL', '数据库', 'PostgreSQL数据库'),
  (uuid_generate_v4(), 'MySQL', '数据库', 'MySQL数据库'),
  (uuid_generate_v4(), 'MongoDB', '数据库', 'MongoDB数据库'),
  (uuid_generate_v4(), 'Docker', 'DevOps', 'Docker容器'),
  (uuid_generate_v4(), 'Kubernetes', 'DevOps', 'Kubernetes编排');

-- =====================================================
-- 创建风险类型
-- =====================================================
INSERT INTO "RiskType" (id, name, description) VALUES
  (uuid_generate_v4(), '人员风险', '与人员相关的风险'),
  (uuid_generate_v4(), '技术风险', '与技术方案、技术选型相关的风险'),
  (uuid_generate_v4(), '管理风险', '与管理流程、沟通协调相关的风险'),
  (uuid_generate_v4(), '安全风险', '与数据安全、信息安全相关的风险'),
  (uuid_generate_v4(), '合规风险', '与法律法规、行业规范相关的风险'),
  (uuid_generate_v4(), '财务风险', '与预算、成本相关的风险');

-- =====================================================
-- 创建评估指标
-- =====================================================
INSERT INTO "AssessmentIndicator" (id, name, parentId, weight, scoringCriteria, description) VALUES
  (uuid_generate_v4(), '技术能力', NULL, 0.25, '根据代码质量、技术方案合理性评分', '厂商的技术能力评估'),
  (uuid_generate_v4(), '交付质量', NULL, 0.25, '根据交付物质量、缺陷率评分', '交付成果的质量评估'),
  (uuid_generate_v4(), '服务响应', NULL, 0.20, '根据响应速度、问题解决率评分', '服务响应速度评估'),
  (uuid_generate_v4(), '人员素质', NULL, 0.15, '根据人员稳定性、技术水平评分', '开发人员素质评估'),
  (uuid_generate_v4(), '合规性', NULL, 0.15, '根据合规检查结果评分', '合规性评估');

-- =====================================================
-- 创建样本风险数据
-- =====================================================
INSERT INTO "Risk" (id, name, typeId, level, impact, triggerConditions, dispositionMeasures, createdBy)
SELECT 
  uuid_generate_v4(),
  '核心开发人员离职风险',
  rt.id,
  'HIGH',
  '影响项目进度，可能导致延期',
  '核心开发人员提出离职',
  '建立AB角机制，定期备份项目文档，关键知识转移',
  u.id
FROM "RiskType" rt, "User" u WHERE rt.name = '人员风险' AND u.username = 'admin'
LIMIT 1;

INSERT INTO "Risk" (id, name, typeId, level, impact, triggerConditions, dispositionMeasures, createdBy)
SELECT 
  uuid_generate_v4(),
  '技术方案架构缺陷',
  rt.id,
  'MEDIUM',
  '影响系统性能和可扩展性',
  '架构设计存在缺陷或性能瓶颈',
  '技术方案评审，引入专家咨询，架构重构评估',
  u.id
FROM "RiskType" rt, "User" u WHERE rt.name = '技术风险' AND u.username = 'admin'
LIMIT 1;

INSERT INTO "Risk" (id, name, typeId, level, impact, triggerConditions, dispositionMeasures, createdBy)
SELECT 
  uuid_generate_v4(),
  '需求变更频繁',
  rt.id,
  'MEDIUM',
  '影响项目质量和进度',
  '客户需求不明确，频繁变更',
  '需求确认机制，变更控制流程，范围管理',
  u.id
FROM "RiskType" rt, "User" u WHERE rt.name = '管理风险' AND u.username = 'admin'
LIMIT 1;

INSERT INTO "Risk" (id, name, typeId, level, impact, triggerConditions, dispositionMeasures, createdBy)
SELECT 
  uuid_generate_v4(),
  '数据泄露风险',
  rt.id,
  'CRITICAL',
  '造成数据安全事故，影响公司声誉',
  '安全措施不到位，数据访问控制不严',
  '安全审计，数据加密，权限控制，安全培训',
  u.id
FROM "RiskType" rt, "User" u WHERE rt.name = '安全风险' AND u.username = 'admin'
LIMIT 1;

-- =====================================================
-- 创建样本任务数据
-- =====================================================
INSERT INTO "Task" (id, name, description, type, deliveryStandard, startDate, endDate, priority, budget, status, partnerId, createdBy)
SELECT 
  uuid_generate_v4(),
  '订单系统微服务升级',
  '对现有订单系统进行微服务架构升级，提升系统性能和可用性',
  'DEVELOPMENT',
  '完成微服务拆分，接口兼容性测试通过，性能提升20%',
  NOW(),
  NOW() + INTERVAL '30 days',
  'HIGH',
  80000.00,
  'IN_PROGRESS',
  p.id,
  u.id
FROM "Partner" p, "User" u WHERE p.name = '华钦科技' AND u.username = 'admin'
LIMIT 1;

INSERT INTO "Task" (id, name, description, type, deliveryStandard, startDate, endDate, priority, budget, status, partnerId, createdBy)
SELECT 
  uuid_generate_v4(),
  '移动端UI优化',
  '优化APP界面交互体验，提升用户满意度',
  'FRONTEND',
  'UI设计符合规范，交互流畅度提升30%',
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '20 days',
  'MEDIUM',
  40000.00,
  'NOT_STARTED',
  p.id,
  u.id
FROM "Partner" p, "User" u WHERE p.name = '博雅软件' AND u.username = 'admin'
LIMIT 1;

INSERT INTO "Task" (id, name, description, type, deliveryStandard, startDate, endDate, priority, budget, status, partnerId, createdBy)
SELECT 
  uuid_generate_v4(),
  '数据报表功能开发',
  '开发季度数据统计报表，支持多维度数据分析',
  'DEVELOPMENT',
  '报表功能完整，数据准确，导出正常',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '5 days',
  'LOW',
  50000.00,
  'COMPLETED',
  p.id,
  u.id
FROM "Partner" p, "User" u WHERE p.name = '华钦科技' AND u.username = 'admin'
LIMIT 1;

-- =====================================================
-- 创建样本开发人员数据
-- =====================================================
INSERT INTO "Developer" (id, partnerId, name, gender, age, contact, status)
SELECT 
  uuid_generate_v4(),
  p.id,
  '张三',
  '男',
  28,
  '{"phone": "13800138001", "email": "zhangsan@partner.com"}',
  'APPROVED'
FROM "Partner" p WHERE p.name = '华钦科技'
LIMIT 1;

INSERT INTO "Developer" (id, partnerId, name, gender, age, contact, status)
SELECT 
  uuid_generate_v4(),
  p.id,
  '李四',
  '女',
  26,
  '{"phone": "13800138002", "email": "lisi@partner.com"}',
  'PENDING'
FROM "Partner" p WHERE p.name = '华钦科技'
LIMIT 1;

INSERT INTO "Developer" (id, partnerId, name, gender, age, contact, status)
SELECT 
  uuid_generate_v4(),
  p.id,
  '王五',
  '男',
  32,
  '{"phone": "13800138003", "email": "wangwu@partner.com"}',
  'APPROVED'
FROM "Partner" p WHERE p.name = '博雅软件'
LIMIT 1;

INSERT INTO "Developer" (id, partnerId, name, gender, age, contact, status)
SELECT 
  uuid_generate_v4(),
  p.id,
  '赵六',
  '女',
  29,
  '{"phone": "13800138004", "email": "zhaoliu@partner.com"}',
  'APPROVED'
FROM "Partner" p WHERE p.name = '创新科技'
LIMIT 1;

-- =====================================================
-- 初始化完成提示
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '数据库初始化完成！';
  RAISE NOTICE '========================================';
  RAISE NOTICE '默认管理员账号: admin / admin123';
  RAISE NOTICE '========================================';
END $$;