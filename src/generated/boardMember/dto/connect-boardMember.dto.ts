import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

export class BoardMemberUserIdBoardIdUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  userId: string
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  boardId: string
}

@ApiExtraModels(BoardMemberUserIdBoardIdUniqueInputDto)
export class ConnectBoardMemberDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string
  @ApiProperty({
    type: BoardMemberUserIdBoardIdUniqueInputDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BoardMemberUserIdBoardIdUniqueInputDto)
  userId_boardId?: BoardMemberUserIdBoardIdUniqueInputDto
}
