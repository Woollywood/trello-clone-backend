import { Controller } from '@nestjs/common'

import { BoardTaskService } from './board-task.service'

@Controller('board-task')
export class BoardTaskController {
  constructor(private readonly taskService: BoardTaskService) {}
}
