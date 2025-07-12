import { forwardRef, Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { WorkspaceModule } from 'src/workspace/workspace.module'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { BoardModule } from 'src/board/board.module'

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => WorkspaceModule),
    BoardModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
