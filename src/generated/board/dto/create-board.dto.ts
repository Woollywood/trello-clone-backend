import { ApiProperty } from '@nestjs/swagger'
import { BoardVisibility } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateBoardDto {
  @ApiProperty({
    enum: BoardVisibility,
    enumName: 'BoardVisibility',
  })
  @IsNotEmpty()
  @IsEnum(BoardVisibility)
  visibility: BoardVisibility
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  title: string
}
