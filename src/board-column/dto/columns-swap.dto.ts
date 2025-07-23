import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ColumnSwapDto {
  @ApiProperty()
  @IsUUID()
  srcId: string

  @ApiProperty()
  @IsUUID()
  destId: string
}
