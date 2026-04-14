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

  await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash,
      name: '系统管理员',
      email: 'admin@hzhb.com',
      phone: '13800138000',
      roleId: systemAdmin.id,
    },
  });

  await prisma.partner.createMany({
    data: [
      { name: '华钦科技', contactInfo: '{"email": "contact@huaqin.com", "phone": "400-123-4567"}', status: 'ACTIVE' },
      { name: '博雅软件', contactInfo: '{"email": "contact@boya.com", "phone": "400-234-5678"}', status: 'ACTIVE' },
      { name: '创新科技', contactInfo: '{"email": "contact@cxkj.com", "phone": "400-345-6789"}', status: 'ACTIVE' },
      { name: '未来数字', contactInfo: '{"email": "contact@wlsz.com", "phone": "400-456-7890"}', status: 'ACTIVE' },
    ],
  });

  console.log('Seed completed: admin / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
