import { WorkspaceRoles } from '@prisma/client'
import { WorkspaceMember } from 'src/generated/workspaceMember/entities/workspaceMember.entity'

export const hasPermissions = (
  id: string,
  membership: WorkspaceMember[],
  requiredRoles: WorkspaceRoles[]
) =>
  membership.some(
    ({ workspaceId, role }) =>
      workspaceId === id && requiredRoles.includes(role)
  )
