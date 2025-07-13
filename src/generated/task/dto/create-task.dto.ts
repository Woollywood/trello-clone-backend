import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import {
  ConnectBoardColumnDto,
  type ConnectBoardColumnDto as ConnectBoardColumnDtoAsType,
} from '../../boardColumn/dto/connect-boardColumn.dto'

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
    type: CreateTaskColumnRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateTaskColumnRelationInputDto)
  column: CreateTaskColumnRelationInputDto
}
