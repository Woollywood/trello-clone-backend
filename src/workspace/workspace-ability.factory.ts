import {
  AbilityBuilder,
  AbilityTuple,
  MatchConditions,
  PureAbility,
} from '@casl/ability'
import { BadRequestException, Injectable } from '@nestjs/common'
import { WorkspaceRoles, WorkspaceVisibility } from '@prisma/client'
import { Workspace } from 'src/generated/workspace/entities/workspace.entity'
import { PrismaService } from 'src/prisma/prisma.service'

import { hasPermissions } from './helpers'

export enum WorkspaceActions {
  Manage = 'manage',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Invite = 'invite',
  ExcludeInvite = 'excludeInvite',
  ExcludeUser = 'exclude',
  CreateBoard = 'createBoard',
  UpdateBoard = 'updateBoard',
  DeleteBoard = 'deleteBoard',
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
      include: { workspacesMemberships: true },
    })

    if (!user) {
      throw new BadRequestException()
    }

    const { can, build } = new AbilityBuilder<WorkspaceAbility>(
      PureAbility
    )

    const { workspacesMemberships } = user

    can(
      WorkspaceActions.Manage,
      Workspace,
      ({ id, createBy }) =>
        createBy?.id === user.id ||
        hasPermissions(id, workspacesMemberships, [
          WorkspaceRoles.ADMIN,
        ])
    )
    can(WorkspaceActions.Read, Workspace, ({ id, visibility }) => {
      switch (visibility) {
        case WorkspaceVisibility.PUBLIC:
          return true
        case WorkspaceVisibility.PRIVATE: {
          return hasPermissions(id, workspacesMemberships, [
            WorkspaceRoles.ADMIN,
            WorkspaceRoles.VIEWER,
            WorkspaceRoles.PARTICIPANT,
          ])
        }
      }
    })
    can(WorkspaceActions.Update, Workspace, ({ id }) =>
      hasPermissions(id, workspacesMemberships, [
        WorkspaceRoles.ADMIN,
        WorkspaceRoles.PARTICIPANT,
      ])
    )
    can(WorkspaceActions.Delete, Workspace, ({ id }) =>
      hasPermissions(id, workspacesMemberships, [
        WorkspaceRoles.ADMIN,
      ])
    )
    can(WorkspaceActions.Invite, Workspace, ({ id }) =>
      hasPermissions(id, workspacesMemberships, [
        WorkspaceRoles.ADMIN,
        WorkspaceRoles.PARTICIPANT,
      ])
    )
    can(WorkspaceActions.ExcludeInvite, Workspace, ({ id }) =>
      hasPermissions(id, workspacesMemberships, [
        WorkspaceRoles.ADMIN,
        WorkspaceRoles.PARTICIPANT,
      ])
    )
    can(WorkspaceActions.ExcludeUser, Workspace, ({ id }) =>
      hasPermissions(id, workspacesMemberships, [
        WorkspaceRoles.ADMIN,
      ])
    )
    can(WorkspaceActions.CreateBoard, Workspace, ({ id }) =>
      hasPermissions(id, workspacesMemberships, [
        WorkspaceRoles.ADMIN,
        WorkspaceRoles.PARTICIPANT,
      ])
    )
    can(WorkspaceActions.UpdateBoard, Workspace, ({ id }) =>
      hasPermissions(id, workspacesMemberships, [
        WorkspaceRoles.ADMIN,
        WorkspaceRoles.PARTICIPANT,
      ])
    )
    can(WorkspaceActions.DeleteBoard, Workspace, ({ id }) =>
      hasPermissions(id, workspacesMemberships, [
        WorkspaceRoles.ADMIN,
        WorkspaceRoles.PARTICIPANT,
      ])
    )

    return build({ conditionsMatcher: lambdaMatcher })
  }
}
