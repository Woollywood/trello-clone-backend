import { BoardRoles } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class CreateBoardMemberDto {
  @ApiProperty({
    enum: BoardRoles,
    enumName: 'BoardRoles',
  })
  @IsNotEmpty()
  @IsEnum(BoardRoles)
  role: BoardRoles
}
