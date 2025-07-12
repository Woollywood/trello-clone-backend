import { ApiProperty } from '@nestjs/swagger'
import { WorkspaceRoles } from '@prisma/client'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class CreateWorkspaceMemberDto {
  @ApiProperty({
    enum: WorkspaceRoles,
    enumName: 'WorkspaceRoles',
  })
  @IsNotEmpty()
  @IsEnum(WorkspaceRoles)
  role: WorkspaceRoles
}
