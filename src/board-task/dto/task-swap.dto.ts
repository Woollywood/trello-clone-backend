import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import { Task } from 'src/generated/task/entities/task.entity'

export class TaskSwapDto {
  @ApiProperty()
  @IsUUID()
  srcId: string

  @ApiProperty()
  @IsUUID()
  destId: string
}

export class TaskSwapResponse {
  @ApiProperty()
  src: Task
  @ApiProperty()
  dest: Task
}
