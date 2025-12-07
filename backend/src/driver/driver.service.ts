import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) {}

  create(createDriverDto: CreateDriverDto) {
    return this.prisma.driver.create({
      data: createDriverDto,
    });
  }

  findAll() {
    return this.prisma.driver.findMany({
      include: {
        devices: true,
        zones: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.driver.findUnique({
      where: { id },
      include: {
        devices: true,
        zones: true,
      },
    });
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return this.prisma.driver.update({
      where: { id },
      data: updateDriverDto,
    });
  }

  remove(id: number) {
    return this.prisma.driver.delete({
      where: { id },
    });
  }
}


