import { WorkspacePermissions } from '@prisma/client'
import { WorkspaceMember } from 'src/generated/workspaceMember/entities/workspaceMember.entity'

export const hasPermissions = (
  id: string,
  membership: WorkspaceMember[],
  permission: WorkspacePermissions
) =>
  membership.some(
    ({ workspaceId, permissions }) =>
      workspaceId === id &&
      permissions.some((value) => value === permission)
  )
