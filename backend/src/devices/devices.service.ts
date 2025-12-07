import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  create(createDeviceDto: CreateDeviceDto) {
    return this.prisma.device.create({
      data: createDeviceDto,
    });
  }

  findAll() {
    return this.prisma.device.findMany({
      include: { driver: true }, // включить связанного driver
    });
  }

  findOne(id: number) {
    return this.prisma.device.findUnique({
      where: { id },
      include: { driver: true },
    });
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
    });
  }

  remove(id: number) {
    return this.prisma.device.delete({
      where: { id },
    });
  }
}