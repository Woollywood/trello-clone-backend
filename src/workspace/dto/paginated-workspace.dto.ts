import { ApiProperty } from '@nestjs/swagger'
import { PageDto } from 'src/common/dto/page.dto'
import { Workspace } from 'src/generated/workspace/entities/workspace.entity'

export class PaginatedWorkspaceDto extends PageDto<Workspace> {
  @ApiProperty({ type: [Workspace] })
  declare data: Workspace[]
}
