import {
  AbilityBuilder,
  AbilityTuple,
  MatchConditions,
  PureAbility,
} from '@casl/ability'
import { BadRequestException, Injectable } from '@nestjs/common'
import {
  WorkspacePermissions,
  WorkspaceVisibility,
} from '@prisma/client'
import { Workspace } from 'src/generated/workspace/entities/workspace.entity'
import { PrismaService } from 'src/prisma/prisma.service'

import { hasPermissions } from './helpers'

export enum WorkspaceActions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Invite = 'invite',
  Exclude = 'exclude',
}

type WorkspaceAbility = PureAbility<AbilityTuple, MatchConditions>
const lambdaMatcher = (matchConditions: MatchConditions) =>
  matchConditions

@Injectable()
export class WorkspaceAbilityFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async createForUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { workspacesMembership: true },
    })

    if (!user) {
      throw new BadRequestException()
    }

    const { can, build } = new AbilityBuilder<WorkspaceAbility>(
      PureAbility
    )

    const { workspacesMembership } = user

    can(
      WorkspaceActions.Manage,
      Workspace,
      ({ id, createBy }) =>
        createBy?.id === user.id ||
        hasPermissions(
          id,
          workspacesMembership,
          WorkspacePermissions.MANAGE
        )
    )
    can(WorkspaceActions.Read, Workspace, ({ id, visibility }) => {
      switch (visibility) {
        case WorkspaceVisibility.PUBLIC:
          return true
        case WorkspaceVisibility.PRIVATE: {
          return hasPermissions(
            id,
            workspacesMembership,
            WorkspacePermissions.READ
          )
        }
      }
    })
    can(WorkspaceActions.Update, Workspace, ({ id }) =>
      hasPermissions(
        id,
        workspacesMembership,
        WorkspacePermissions.UPDATE
      )
    )
    can(WorkspaceActions.Delete, Workspace, ({ id }) =>
      hasPermissions(
        id,
        workspacesMembership,
        WorkspacePermissions.DELETE
      )
    )
    can(WorkspaceActions.Invite, Workspace, ({ id }) =>
      hasPermissions(
        id,
        workspacesMembership,
        WorkspacePermissions.INVITE
      )
    )
    can(WorkspaceActions.Exclude, Workspace, ({ id }) =>
      hasPermissions(
        id,
        workspacesMembership,
        WorkspacePermissions.EXCLUDE
      )
    )

    return build({ conditionsMatcher: lambdaMatcher })
  }
}
