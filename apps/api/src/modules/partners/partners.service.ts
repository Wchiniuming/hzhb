import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;
    
    const where = status ? { status } : {};
    
    const [partners, total] = await Promise.all([
      this.prisma.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.partner.count({ where }),
    ]);

    return {
      data: partners,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    return partner;
  }

  async create(createPartnerDto: CreatePartnerDto) {
    const existingPartner = await this.prisma.partner.findUnique({
      where: { name: createPartnerDto.name },
    });

    if (existingPartner) {
      throw new ConflictException(`Partner with name ${createPartnerDto.name} already exists`);
    }

    return this.prisma.partner.create({
      data: {
        name: createPartnerDto.name,
        contactInfo: createPartnerDto.contactInfo ? JSON.parse(JSON.stringify(createPartnerDto.contactInfo)) : undefined,
        status: 'ACTIVE',
      },
    });
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    const existingPartner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    if (updatePartnerDto.name && updatePartnerDto.name !== existingPartner.name) {
      const partnerWithSameName = await this.prisma.partner.findUnique({
        where: { name: updatePartnerDto.name },
      });

      if (partnerWithSameName) {
        throw new ConflictException(`Partner with name ${updatePartnerDto.name} already exists`);
      }
    }

    return this.prisma.partner.update({
      where: { id },
      data: {
        ...updatePartnerDto,
      },
    });
  }

  async remove(id: string) {
    const existingPartner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    await this.prisma.partner.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }
}