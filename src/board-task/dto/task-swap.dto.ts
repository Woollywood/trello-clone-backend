import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

export class TaskSwapDto {
  @ApiProperty()
  @IsUUID()
  srcId: string

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  destId?: string

  @ApiProperty()
  @IsUUID()
  destColumnId: string
}
