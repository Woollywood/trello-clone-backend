import { forwardRef, Module } from '@nestjs/common'
import { BoardColumnModule } from 'src/board-column/board-column.module'
import { BoardTaskModule } from 'src/board-task/board-task.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { WorkspaceModule } from 'src/workspace/workspace.module'

import { BoardController } from './board.controller'
import { BoardService } from './board.service'
import { BoardAbilityFactory } from './board-ability.factory'

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => WorkspaceModule),
    forwardRef(() => BoardColumnModule),
    forwardRef(() => BoardTaskModule),
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardAbilityFactory],
  exports: [BoardService, BoardAbilityFactory],
})
export class BoardModule {}
