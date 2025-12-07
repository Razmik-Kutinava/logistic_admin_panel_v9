import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from './driver/driver.module';
import { DevicesModule } from './devices/devices.module';
import { PrismaModule } from './prisma/prisma.module';
import { ZonesModule } from './zones/zones.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, DriverModule, DevicesModule, ZonesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
