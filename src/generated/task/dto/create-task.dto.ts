import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import {
  ConnectBoardDto,
  type ConnectBoardDto as ConnectBoardDtoAsType,
} from '../../board/dto/connect-board.dto'
import {
  ConnectBoardColumnDto,
  type ConnectBoardColumnDto as ConnectBoardColumnDtoAsType,
} from '../../boardColumn/dto/connect-boardColumn.dto'

export class CreateTaskBoardRelationInputDto {
  @ApiProperty({
    type: ConnectBoardDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectBoardDto)
  connect: ConnectBoardDtoAsType
}
export class CreateTaskColumnRelationInputDto {
  @ApiProperty({
    type: ConnectBoardColumnDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectBoardColumnDto)
  connect: ConnectBoardColumnDtoAsType
}

@ApiExtraModels(
  ConnectBoardDto,
  CreateTaskBoardRelationInputDto,
  ConnectBoardColumnDto,
  CreateTaskColumnRelationInputDto
)
export class CreateTaskDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  title: string
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string | null
  @ApiProperty({
    type: CreateTaskBoardRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateTaskBoardRelationInputDto)
  board: CreateTaskBoardRelationInputDto
  @ApiProperty({
    type: CreateTaskColumnRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateTaskColumnRelationInputDto)
  column: CreateTaskColumnRelationInputDto
}
