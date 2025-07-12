import { forwardRef, Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { WorkspaceModule } from 'src/workspace/workspace.module'

import { BoardController } from './board.controller'
import { BoardService } from './board.service'
import { BoardAbilityFactory } from './board-ability.factory'

@Module({
  imports: [PrismaModule, forwardRef(() => WorkspaceModule)],
  controllers: [BoardController],
  providers: [BoardService, BoardAbilityFactory],
  exports: [BoardService, BoardAbilityFactory],
})
export class BoardModule {}
