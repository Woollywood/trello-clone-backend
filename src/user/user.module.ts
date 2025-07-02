import { forwardRef, Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { WorkspaceModule } from 'src/workspace/workspace.module'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [PrismaModule, forwardRef(() => WorkspaceModule)],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
