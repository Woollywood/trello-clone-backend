import { forwardRef, Module } from '@nestjs/common'
import { NotificationModule } from 'src/notification/notification.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UserModule } from 'src/user/user.module'
import { WsModule } from 'src/ws/ws.module'

import { WorkspaceController } from './workspace.controller'
import { WorkspaceService } from './workspace.service'
import { WorkspaceAbilityFactory } from './workspace-ability.factory'

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
    NotificationModule,
    forwardRef(() => WsModule),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceAbilityFactory],
  exports: [WorkspaceService, WorkspaceAbilityFactory],
})
export class WorkspaceModule {}
