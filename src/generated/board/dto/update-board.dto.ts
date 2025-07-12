import { BoardVisibility } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateBoardDto {
  @ApiProperty({
    enum: BoardVisibility,
    enumName: 'BoardVisibility',
    required: false,
  })
  @IsOptional()
  @IsEnum(BoardVisibility)
  visibility?: BoardVisibility
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string
}
