import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import { BoardColumn } from 'src/generated/boardColumn/entities/boardColumn.entity'

export class ColumnSwapDto {
  @ApiProperty()
  @IsUUID()
  srcId: string

  @ApiProperty()
  @IsUUID()
  destId: string
}

export class ColumnSwapResponse {
  @ApiProperty()
  src: BoardColumn
  @ApiProperty()
  dest: BoardColumn
}
