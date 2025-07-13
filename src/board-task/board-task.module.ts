import { forwardRef, Module } from '@nestjs/common'
import { BoardModule } from 'src/board/board.module'
import { PrismaModule } from 'src/prisma/prisma.module'

import { BoardTaskController } from './board-task.controller'
import { BoardTaskService } from './board-task.service'

@Module({
  imports: [PrismaModule, forwardRef(() => BoardModule)],
  providers: [BoardTaskService],
  exports: [BoardTaskService],
  controllers: [BoardTaskController],
})
export class BoardTaskModule {}
