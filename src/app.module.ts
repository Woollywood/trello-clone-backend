import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { BoardModule } from './board/board.module'
import { BoardColumnModule } from './board-column/board-column.module'
import { BoardTaskModule } from './board-task/board-task.module'
import { NotificationModule } from './notification/notification.module'
import { PrismaModule } from './prisma/prisma.module'
import { PrismaService } from './prisma/prisma.service'
import { SessionModule } from './session/session.module'
import { UserModule } from './user/user.module'
import { WorkspaceModule } from './workspace/workspace.module'
import { WsModule } from './ws/ws.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    SessionModule,
    WorkspaceModule,
    NotificationModule,
    WsModule,
    BoardModule,
    BoardColumnModule,
    BoardTaskModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
