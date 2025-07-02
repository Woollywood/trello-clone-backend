import { OmitType } from '@nestjs/swagger'
import { UpdateWorkspaceDto } from 'src/generated/workspace/dto/update-workspace.dto'

export class UpdateWorkspaceVisibilityDto extends OmitType(
  UpdateWorkspaceDto,
  ['title']
) {}
