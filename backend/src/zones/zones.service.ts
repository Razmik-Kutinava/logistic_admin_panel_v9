import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  create(createZoneDto: CreateZoneDto) {
    return this.prisma.zone.create({ data: createZoneDto });
  }

  findAll() {
    return this.prisma.zone.findMany({ include: { driver: true } });
  }

  findOne(id: number) {
    return this.prisma.zone.findUnique({ where: { id }, include: { driver: true } });
  }

  update(id: number, updateZoneDto: UpdateZoneDto) {
    return this.prisma.zone.update({ where: { id }, data: updateZoneDto });
  }

  remove(id: number) {
    return this.prisma.zone.delete({ where: { id } });
  }
}