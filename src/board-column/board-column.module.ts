import { forwardRef, Module } from '@nestjs/common'
import { BoardModule } from 'src/board/board.module'
import { PrismaModule } from 'src/prisma/prisma.module'

import { BoardColumnController } from './board-column.controller'
import { BoardColumnService } from './board-column.service'

@Module({
  imports: [PrismaModule, forwardRef(() => BoardModule)],
  providers: [BoardColumnService],
  controllers: [BoardColumnController],
  exports: [BoardColumnService],
})
export class BoardColumnModule {}
