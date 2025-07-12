import {
  AbilityBuilder,
  AbilityTuple,
  MatchConditions,
  PureAbility,
} from '@casl/ability'
import { BadRequestException, Injectable } from '@nestjs/common'
import { BoardRoles, BoardVisibility } from '@prisma/client'
import { Board } from 'src/generated/board/entities/board.entity'
import { PrismaService } from 'src/prisma/prisma.service'

import { hasPermissions } from './helpers'

export enum BoardActions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Invite = 'invite',
  ExcludeInvite = 'excludeInvite',
  Exclude = 'exclude',
}

type BoardAbility = PureAbility<AbilityTuple, MatchConditions>
const lambdaMatcher = (matchConditions: MatchConditions) =>
  matchConditions

@Injectable()
export class BoardAbilityFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async createForUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        boardMemberships: true,
        workspacesMemberships: { include: { workspace: true } },
      },
    })

    if (!user) {
      throw new BadRequestException()
    }

    const { can, build } = new AbilityBuilder<BoardAbility>(
      PureAbility
    )

    const { boardMemberships, workspacesMemberships } = user

    can(BoardActions.Manage, Board, ({ id }) =>
      hasPermissions(id, boardMemberships, [BoardRoles.ADMIN])
    )
    can(
      BoardActions.Read,
      Board,
      ({ id, visibility, workspaceId }) => {
        switch (visibility) {
          case BoardVisibility.PUBLIC:
            return true
          case BoardVisibility.WORKSPACE:
            return workspacesMemberships.some(
              (workspaceMember) =>
                workspaceMember.workspaceId === workspaceId
            )
          case BoardVisibility.PRIVATE: {
            return hasPermissions(id, boardMemberships, [
              BoardRoles.ADMIN,
              BoardRoles.VIEWER,
              BoardRoles.PARTICIPANT,
            ])
          }
        }
      }
    )
    can(
      BoardActions.Update,
      Board,
      ({ id, visibility, workspaceId }) => {
        switch (visibility) {
          case BoardVisibility.PRIVATE:
            return hasPermissions(id, boardMemberships, [
              BoardRoles.ADMIN,
              BoardRoles.PARTICIPANT,
            ])
          case BoardVisibility.WORKSPACE:
            return workspacesMemberships.some(
              (workspaceMember) =>
                workspaceMember.workspaceId === workspaceId
            )
          default:
            return false
        }
      }
    )
    can(BoardActions.Delete, Board, ({ id }) =>
      hasPermissions(id, boardMemberships, [BoardRoles.ADMIN])
    )
    can(BoardActions.Invite, Board, ({ id, visibility }) =>
      visibility === BoardVisibility.PRIVATE
        ? hasPermissions(id, boardMemberships, [
            BoardRoles.ADMIN,
            BoardRoles.PARTICIPANT,
          ])
        : false
    )
    can(BoardActions.ExcludeInvite, Board, ({ id, visibility }) =>
      visibility === BoardVisibility.PRIVATE
        ? hasPermissions(id, boardMemberships, [
            BoardRoles.ADMIN,
            BoardRoles.PARTICIPANT,
          ])
        : false
    )
    can(BoardActions.Exclude, Board, ({ id }) =>
      hasPermissions(id, boardMemberships, [BoardRoles.ADMIN])
    )

    return build({ conditionsMatcher: lambdaMatcher })
  }
}
