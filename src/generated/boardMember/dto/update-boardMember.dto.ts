import { ApiProperty } from '@nestjs/swagger'
import { BoardRoles } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'

export class UpdateBoardMemberDto {
  @ApiProperty({
    enum: BoardRoles,
    enumName: 'BoardRoles',
    required: false,
  })
  @IsOptional()
  @IsEnum(BoardRoles)
  role?: BoardRoles
}
