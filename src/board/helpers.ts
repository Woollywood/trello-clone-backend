import { BoardRoles } from '@prisma/client'
import { BoardMember } from 'src/generated/boardMember/entities/boardMember.entity'

export const hasPermissions = (
  id: string,
  membership: BoardMember[],
  requiredRoles: BoardRoles[]
) =>
  membership.some(
    ({ boardId, role }) =>
      boardId === id && requiredRoles.includes(role)
  )

export const isUserWorkspaceMember = () => {}
