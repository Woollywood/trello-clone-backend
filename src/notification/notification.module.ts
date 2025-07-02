import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'

import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
  imports: [PrismaModule],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
