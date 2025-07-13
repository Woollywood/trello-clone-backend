import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'

import {
  ConnectBoardDto,
  type ConnectBoardDto as ConnectBoardDtoAsType,
} from '../../board/dto/connect-board.dto'

export class CreateBoardColumnBoardRelationInputDto {
  @ApiProperty({
    type: ConnectBoardDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectBoardDto)
  connect: ConnectBoardDtoAsType
}

@ApiExtraModels(
  ConnectBoardDto,
  CreateBoardColumnBoardRelationInputDto
)
export class CreateBoardColumnDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  title: string
  @ApiProperty({
    type: CreateBoardColumnBoardRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateBoardColumnBoardRelationInputDto)
  board: CreateBoardColumnBoardRelationInputDto
}
