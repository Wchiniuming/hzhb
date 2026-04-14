import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12);

  const systemAdmin = await prisma.role.create({
    data: { name: 'SYSTEM_ADMIN', description: '系统管理员 - 拥有系统全部权限' },
  });

  await prisma.role.createMany({
    data: [
      { name: 'BUSINESS_ADMIN', description: '业务管理员 - 管理业务模块' },
      { name: 'AUDITOR', description: '审计人员 - 查看审计日志和报表' },
      { name: 'PARTNER_ADMIN', description: '合作伙伴管理员 - 管理合作伙伴人员' },
      { name: 'DEVELOPER', description: '开发人员 - 任务执行者' },
      { name: 'MANAGEMENT', description: '管理层 - 查看数据报表' },
    ],
  });

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash,
      name: '系统管理员',
      email: 'admin@hzhb.com',
      phone: '13800138000',
      roleId: systemAdmin.id,
    },
  });

  // Partners
  const partner1 = await prisma.partner.create({
    data: { name: '华钦科技', contactInfo: JSON.stringify({ email: 'contact@huaqin.com', phone: '400-123-4567', person: '张总' }), status: 'ACTIVE' },
  });
  const partner2 = await prisma.partner.create({
    data: { name: '博雅软件', contactInfo: JSON.stringify({ email: 'contact@boya.com', phone: '400-234-5678', person: '李总' }), status: 'ACTIVE' },
  });
  const partner3 = await prisma.partner.create({
    data: { name: '创新科技', contactInfo: JSON.stringify({ email: 'contact@cxkj.com', phone: '400-345-6789', person: '王总' }), status: 'ACTIVE' },
  });
  const partner4 = await prisma.partner.create({
    data: { name: '未来数字', contactInfo: JSON.stringify({ email: 'contact@wlsz.com', phone: '400-456-7890', person: '赵总' }), status: 'INACTIVE' },
  });

  // Skill Tags
  const skill1 = await prisma.skillTag.create({ data: { name: 'React', description: '前端框架' } });
  const skill2 = await prisma.skillTag.create({ data: { name: 'Vue', description: '前端框架' } });
  const skill3 = await prisma.skillTag.create({ data: { name: 'Node.js', description: '后端运行时' } });
  const skill4 = await prisma.skillTag.create({ data: { name: 'Python', description: '后端语言' } });
  const skill5 = await prisma.skillTag.create({ data: { name: 'TypeScript', description: '类型安全JS' } });
  const skill6 = await prisma.skillTag.create({ data: { name: 'PostgreSQL', description: '关系数据库' } });
  const skill7 = await prisma.skillTag.create({ data: { name: 'Docker', description: '容器化' } });
  const skill8 = await prisma.skillTag.create({ data: { name: 'K8s', description: 'Kubernetes' } });
  const skill9 = await prisma.skillTag.create({ data: { name: 'Spring Boot', description: 'Java框架' } });
  const skill10 = await prisma.skillTag.create({ data: { name: 'Flutter', description: '跨端框架' } });

  // Developers
  const dev1 = await prisma.developer.create({
    data: { name: '张三', partnerId: partner1.id, gender: '男', age: 32, status: 'ACTIVE', contact: JSON.stringify({ email: 'zhangsan@huaqin.com', phone: '13800001001' }) },
  });
  const dev2 = await prisma.developer.create({
    data: { name: '李四', partnerId: partner1.id, gender: '男', age: 28, status: 'ACTIVE', contact: JSON.stringify({ email: 'lisi@huaqin.com', phone: '13800001002' }) },
  });
  const dev3 = await prisma.developer.create({
    data: { name: '王五', partnerId: partner2.id, gender: '女', age: 30, status: 'ACTIVE', contact: JSON.stringify({ email: 'wangwu@boya.com', phone: '13800001003' }) },
  });
  const dev4 = await prisma.developer.create({
    data: { name: '赵六', partnerId: partner2.id, gender: '男', age: 26, status: 'ACTIVE', contact: JSON.stringify({ email: 'zhaoliu@boya.com', phone: '13800001004' }) },
  });
  const dev5 = await prisma.developer.create({
    data: { name: '钱七', partnerId: partner3.id, gender: '男', age: 35, status: 'ACTIVE', contact: JSON.stringify({ email: 'qianqi@cxkj.com', phone: '13800001005' }) },
  });
  const dev6 = await prisma.developer.create({
    data: { name: '孙八', partnerId: partner3.id, gender: '女', age: 27, status: 'LEASED', contact: JSON.stringify({ email: 'sunba@cxkj.com', phone: '13800001006' }) },
  });
  const dev7 = await prisma.developer.create({
    data: { name: '周九', partnerId: partner1.id, gender: '男', age: 29, status: 'ACTIVE', contact: JSON.stringify({ email: 'zhoujiu@huaqin.com', phone: '13800001007' }) },
  });
  const dev8 = await prisma.developer.create({
    data: { name: '吴十', partnerId: partner2.id, gender: '女', age: 31, status: 'INACTIVE', contact: JSON.stringify({ email: 'wushi@boya.com', phone: '13800001008' }) },
  });

  // Developer Skills
  await prisma.developerSkill.createMany({
    data: [
      { developerId: dev1.id, skillTagId: skill1.id, proficiency: 'EXPERT' },
      { developerId: dev1.id, skillTagId: skill5.id, proficiency: 'ADVANCED' },
      { developerId: dev1.id, skillTagId: skill3.id, proficiency: 'ADVANCED' },
      { developerId: dev2.id, skillTagId: skill4.id, proficiency: 'EXPERT' },
      { developerId: dev2.id, skillTagId: skill7.id, proficiency: 'ADVANCED' },
      { developerId: dev2.id, skillTagId: skill8.id, proficiency: 'INTERMEDIATE' },
      { developerId: dev3.id, skillTagId: skill2.id, proficiency: 'ADVANCED' },
      { developerId: dev3.id, skillTagId: skill9.id, proficiency: 'EXPERT' },
      { developerId: dev3.id, skillTagId: skill6.id, proficiency: 'ADVANCED' },
      { developerId: dev4.id, skillTagId: skill10.id, proficiency: 'EXPERT' },
      { developerId: dev4.id, skillTagId: skill1.id, proficiency: 'INTERMEDIATE' },
      { developerId: dev5.id, skillTagId: skill4.id, proficiency: 'EXPERT' },
      { developerId: dev5.id, skillTagId: skill3.id, proficiency: 'EXPERT' },
      { developerId: dev5.id, skillTagId: skill5.id, proficiency: 'ADVANCED' },
      { developerId: dev6.id, skillTagId: skill2.id, proficiency: 'ADVANCED' },
      { developerId: dev6.id, skillTagId: skill6.id, proficiency: 'INTERMEDIATE' },
      { developerId: dev7.id, skillTagId: skill1.id, proficiency: 'INTERMEDIATE' },
      { developerId: dev7.id, skillTagId: skill3.id, proficiency: 'INTERMEDIATE' },
      { developerId: dev8.id, skillTagId: skill4.id, proficiency: 'ADVANCED' },
      { developerId: dev8.id, skillTagId: skill9.id, proficiency: 'ADVANCED' },
    ],
  });

  // Tasks
  const task1 = await prisma.task.create({
    data: {
      name: '订单系统微服务升级',
      description: '对现有订单系统进行微服务架构升级，提升系统性能和可用性',
      type: 'DEVELOPMENT',
      deliveryStandard: '满足QAS测试要求，性能提升30%以上',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-15'),
      priority: 'HIGH',
      budget: 150000,
      status: 'IN_PROGRESS',
      partnerId: partner1.id,
      createdBy: admin.id,
    },
  });
  const task2 = await prisma.task.create({
    data: {
      name: '移动端UI优化',
      description: '优化APP界面交互体验，提升用户满意度',
      type: 'OPTIMIZATION',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-20'),
      priority: 'MEDIUM',
      budget: 50000,
      status: 'COMPLETED',
      partnerId: partner2.id,
      createdBy: admin.id,
    },
  });
  const task3 = await prisma.task.create({
    data: {
      name: '数据报表功能开发',
      description: '开发季度数据统计报表，支持多维度数据分析',
      type: 'DEVELOPMENT',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      priority: 'LOW',
      status: 'ACCEPTED',
      partnerId: partner3.id,
      createdBy: admin.id,
    },
  });
  const task4 = await prisma.task.create({
    data: {
      name: 'API接口重构',
      description: '重构现有API接口，优化数据结构，提升安全性',
      type: 'REFACTOR',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-03-10'),
      priority: 'HIGH',
      budget: 80000,
      status: 'DELAYED',
      partnerId: partner1.id,
      createdBy: admin.id,
    },
  });
  const task5 = await prisma.task.create({
    data: {
      name: '数据库优化项目',
      description: '对核心业务数据库进行性能优化和索引调整',
      type: 'OPTIMIZATION',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-30'),
      priority: 'MEDIUM',
      status: 'NOT_STARTED',
      partnerId: partner2.id,
      createdBy: admin.id,
    },
  });
  const task6 = await prisma.task.create({
    data: {
      name: '安全漏洞修复',
      description: '修复第三方安全扫描发现的漏洞',
      type: 'SECURITY',
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-25'),
      priority: 'URGENT',
      budget: 30000,
      status: 'COMPLETED',
      partnerId: partner3.id,
      createdBy: admin.id,
    },
  });

  // Task Assignments
  await prisma.taskAssignment.createMany({
    data: [
      { taskId: task1.id, developerId: dev1.id, role: '技术负责人', responsibilities: '系统架构设计，核心代码开发' },
      { taskId: task1.id, developerId: dev2.id, role: '开发工程师', responsibilities: 'API开发，数据库设计' },
      { taskId: task2.id, developerId: dev3.id, role: 'UI设计师', responsibilities: '界面设计，交互动画' },
      { taskId: task3.id, developerId: dev5.id, role: '全栈工程师', responsibilities: '报表开发' },
      { taskId: task4.id, developerId: dev1.id, role: '架构师', responsibilities: 'API设计' },
      { taskId: task4.id, developerId: dev7.id, role: '开发工程师', responsibilities: '接口实现' },
    ],
  });

  // Task Progress
  await prisma.taskProgress.createMany({
    data: [
      { taskId: task1.id, developerId: dev1.id, status: 'IN_PROGRESS', details: '已完成微服务拆分，Docker容器化部署中', updateTime: new Date('2024-02-20') },
      { taskId: task2.id, developerId: dev3.id, status: 'COMPLETED', details: 'UI优化完成，通过验收', updateTime: new Date('2024-02-20') },
      { taskId: task3.id, developerId: dev5.id, status: 'COMPLETED', details: '报表功能开发完成，已上线', updateTime: new Date('2024-01-30') },
      { taskId: task4.id, developerId: dev7.id, status: 'DELAYED', details: '遇到接口兼容性问题，需要延期', updateTime: new Date('2024-03-05') },
    ],
  });

  // Risk Types
  const riskType1 = await prisma.riskType.create({ data: { name: '人员流动风险' } });
  const riskType2 = await prisma.riskType.create({ data: { name: '技术方案风险' } });
  const riskType3 = await prisma.riskType.create({ data: { name: '进度延期风险' } });
  const riskType4 = await prisma.riskType.create({ data: { name: '质量风险' } });

  // Risks
  await prisma.risk.createMany({
    data: [
      {
        name: '核心开发人员离职风险',
        description: '订单系统核心开发人员张三代提出离职，可能影响项目进度',
        typeId: riskType1.id,
        level: 'HIGH',
        impact: '可能导致项目延期或质量问题',
        triggerConditions: '核心人员离职且无有效交接',
        dispositionMeasures: '建立知识库，关键岗位配置AB角',
        createdBy: admin.id,
      },
      {
        name: '微服务架构技术风险',
        description: '微服务拆分过程中可能遇到服务间通信、数据一致性问题',
        typeId: riskType2.id,
        level: 'MEDIUM',
        impact: '影响系统稳定性和性能',
        triggerConditions: '服务间调用超时或数据不一致',
        dispositionMeasures: '引入服务网格，增加熔断和重试机制',
        createdBy: admin.id,
      },
      {
        name: 'API重构延期风险',
        description: '现有API与新架构兼容性存在不确定性',
        typeId: riskType3.id,
        level: 'HIGH',
        impact: '影响下游系统对接',
        triggerConditions: '重构进度落后于计划',
        dispositionMeasures: '分阶段实施，每周评审进度',
        createdBy: admin.id,
      },
      {
        name: '测试覆盖率不足风险',
        description: '快速迭代导致单元测试覆盖率下降',
        typeId: riskType4.id,
        level: 'MEDIUM',
        impact: '可能遗漏关键缺陷',
        triggerConditions: '测试覆盖率低于70%',
        dispositionMeasures: '强制代码覆盖率门禁，加强代码审查',
        createdBy: admin.id,
      },
      {
        name: '供应商人员不足',
        description: '博雅软件当前项目较多，可能出现人员调配紧张',
        typeId: riskType1.id,
        level: 'LOW',
        impact: '影响任务按时完成',
        triggerConditions: '同时承担超过3个并行项目',
        dispositionMeasures: '提前沟通资源计划，建立预警机制',
        createdBy: admin.id,
      },
    ],
  });

  // Assessment Indicators
  const indicator1 = await prisma.assessmentIndicator.create({ data: { name: '技术能力', weight: 25, description: '评估技术栈掌握程度' } });
  const indicator2 = await prisma.assessmentIndicator.create({ data: { name: '项目管理', weight: 20, description: '进度控制、风险应对' } });
  const indicator3 = await prisma.assessmentIndicator.create({ data: { name: '质量保障', weight: 20, description: '代码质量、测试覆盖率' } });
  const indicator4 = await prisma.assessmentIndicator.create({ data: { name: '沟通协作', weight: 15, description: '跨团队沟通能力' } });
  const indicator5 = await prisma.assessmentIndicator.create({ data: { name: '创新能力', weight: 10, description: '技术方案创新能力' } });
  const indicator6 = await prisma.assessmentIndicator.create({ data: { name: '服务态度', weight: 10, description: '响应速度、服务意识' } });

  // Sub-indicators
  await prisma.assessmentIndicator.createMany({
    data: [
      { name: 'React/Vue技能', weight: 8, parentId: indicator1.id, description: '前端框架掌握程度' },
      { name: '后端开发能力', weight: 8, parentId: indicator1.id, description: 'Node.js/Python/Java能力' },
      { name: '数据库设计', weight: 5, parentId: indicator1.id, description: '数据库建模和优化能力' },
      { name: 'DevOps能力', weight: 4, parentId: indicator1.id, description: 'CI/CD、容器化能力' },
    ],
  });

  // Assessment Plans
  const plan1 = await prisma.assessmentPlan.create({
    data: {
      name: '2024年Q1合作伙伴能力评估',
      cycle: 'QUARTERLY',
      method: 'COMPREHENSIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      status: 'COMPLETED',
      createdBy: admin.id,
    },
  });
  const plan2 = await prisma.assessmentPlan.create({
    data: {
      name: '2024年Q2合作伙伴能力评估',
      cycle: 'QUARTERLY',
      method: 'COMPREHENSIVE',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-06-30'),
      status: 'IN_PROGRESS',
      createdBy: admin.id,
    },
  });
  const plan3 = await prisma.assessmentPlan.create({
    data: {
      name: '2024年度安全合规评估',
      cycle: 'YEARLY',
      method: 'SAFETY',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      status: 'DRAFT',
      createdBy: admin.id,
    },
  });

  // Assessments
  const ass1 = await prisma.assessment.create({
    data: {
      planId: plan1.id,
      partnerId: partner1.id,
      status: 'COMPLETED',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-30'),
      overallScore: 88.5,
    },
  });
  const ass2 = await prisma.assessment.create({
    data: {
      planId: plan1.id,
      partnerId: partner2.id,
      status: 'COMPLETED',
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-02-05'),
      overallScore: 82.0,
    },
  });
  const ass3 = await prisma.assessment.create({
    data: {
      planId: plan1.id,
      partnerId: partner3.id,
      status: 'COMPLETED',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-20'),
      overallScore: 75.5,
    },
  });
  const ass4 = await prisma.assessment.create({
    data: {
      planId: plan2.id,
      partnerId: partner1.id,
      status: 'IN_PROGRESS',
      startDate: new Date('2024-04-10'),
    },
  });

  // Assessment Scores
  await prisma.assessmentScore.createMany({
    data: [
      { assessmentId: ass1.id, indicatorId: indicator1.id, autoScore: 90, manualScore: 88, finalScore: 89 },
      { assessmentId: ass1.id, indicatorId: indicator2.id, autoScore: 85, manualScore: 90, finalScore: 88 },
      { assessmentId: ass1.id, indicatorId: indicator3.id, autoScore: 88, manualScore: 87, finalScore: 87.5 },
      { assessmentId: ass1.id, indicatorId: indicator4.id, autoScore: 90, manualScore: 89, finalScore: 89.5 },
      { assessmentId: ass1.id, indicatorId: indicator5.id, autoScore: 85, manualScore: 88, finalScore: 86.5 },
      { assessmentId: ass1.id, indicatorId: indicator6.id, autoScore: 92, manualScore: 91, finalScore: 91.5 },
      { assessmentId: ass2.id, indicatorId: indicator1.id, autoScore: 82, manualScore: 83, finalScore: 82.5 },
      { assessmentId: ass2.id, indicatorId: indicator2.id, autoScore: 80, manualScore: 81, finalScore: 80.5 },
      { assessmentId: ass2.id, indicatorId: indicator3.id, autoScore: 85, manualScore: 84, finalScore: 84.5 },
      { assessmentId: ass2.id, indicatorId: indicator4.id, autoScore: 82, manualScore: 83, finalScore: 82.5 },
      { assessmentId: ass2.id, indicatorId: indicator5.id, autoScore: 78, manualScore: 80, finalScore: 79 },
      { assessmentId: ass2.id, indicatorId: indicator6.id, autoScore: 85, manualScore: 84, finalScore: 84.5 },
    ],
  });

  // Improvement Requirements
  const impReq1 = await prisma.improvementRequirement.create({
    data: {
      originType: 'ASSESSMENT',
      originEntityId: ass1.id,
      title: '加强DevOps能力建设',
      description: '评估中发现合作伙伴DevOps能力有待提升，建议加强CI/CD流水线建设和容器化部署能力',
      targetDate: new Date('2024-06-30'),
      responsibleType: 'PARTNER',
      responsibleId: partner1.id,
      status: 'IN_PROGRESS',
      createdBy: admin.id,
    },
  });
  const impReq2 = await prisma.improvementRequirement.create({
    data: {
      originType: 'RISK',
      originEntityId: null,
      title: '提升创新能力评分',
      description: 'Q1评估创新能力得分为86.5分，低于平均水平，需制定提升计划',
      targetDate: new Date('2024-05-31'),
      responsibleType: 'PARTNER',
      responsibleId: partner2.id,
      status: 'IDENTIFIED',
      createdBy: admin.id,
    },
  });
  const impReq3 = await prisma.improvementRequirement.create({
    data: {
      originType: 'TASK',
      originEntityId: task4.id,
      title: 'API兼容性改造',
      description: 'API重构延期，需优化方案确保兼容性',
      targetDate: new Date('2024-04-15'),
      responsibleType: 'DEVELOPER',
      responsibleId: dev1.id,
      status: 'ACCEPTED',
      createdBy: admin.id,
    },
  });

  // Improvement Plans
  const impPlan1 = await prisma.improvementPlan.create({
    data: {
      requirementId: impReq1.id,
      steps: JSON.stringify(['建立CI/CD流水线', '引入Docker Compose', '实现自动化部署', '建立监控告警']),
      timeline: JSON.stringify([
        { step: '建立CI/CD流水线', startDate: '2024-04-01', endDate: '2024-04-15' },
        { step: 'Docker化改造', startDate: '2024-04-16', endDate: '2024-05-15' },
        { step: '自动化测试集成', startDate: '2024-05-16', endDate: '2024-06-01' },
        { step: '监控体系建设', startDate: '2024-06-01', endDate: '2024-06-30' },
      ]),
      responsibilities: JSON.stringify([
        { role: '技术负责人', name: '张三', tasks: '整体方案设计和技术选型' },
        { role: '运维工程师', name: '李四', tasks: 'CI/CD流水线搭建和部署' },
      ]),
      status: 'IN_PROGRESS',
    },
  });

  // Improvement Progress
  await prisma.improvementProgress.createMany({
    data: [
      { planId: impPlan1.id, responsibleId: dev1.id, details: '已完成Jenkins流水线搭建，实现代码提交自动构建' },
      { planId: impPlan1.id, responsibleId: dev2.id, details: '完成Dockerfile编写，核心服务已完成容器化' },
    ],
  });

  console.log('Seed completed successfully!');
  console.log('Login: admin / admin123');
  console.log('Partners: 华钦科技, 博雅软件, 创新科技, 未来数字');
  console.log('Developers: 8人');
  console.log('Tasks: 6个');
  console.log('Risks: 5个');
  console.log('Assessment Plans: 3个');
  console.log('Assessments: 4个');
  console.log('Improvement Requirements: 3个');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
