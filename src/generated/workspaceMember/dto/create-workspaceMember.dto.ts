import { WorkspaceRoles } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
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
