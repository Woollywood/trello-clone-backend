import { ApiProperty } from '@nestjs/swagger'
import { WorkspaceVisibility } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateWorkspaceDto {
  @ApiProperty({
    minimum: 3,
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string
  @ApiProperty({
    enum: WorkspaceVisibility,
    enumName: 'WorkspaceVisibility',
    required: false,
  })
  @IsOptional()
  @IsEnum(WorkspaceVisibility)
  visibility?: WorkspaceVisibility
}
