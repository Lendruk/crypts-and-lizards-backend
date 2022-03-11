import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../../error-handling/ErrorCodes";
import { TYPES } from "../../ioc/Types";
import { Role } from "../../models/Role";
import AbstractModel from "../../types/AbstractModel";
import { Service } from "../../types/Service";
import { ObjectId } from "../../utils/ObjectId";
import PermissionService from "../PermissionService";
import RoleService from "../RoleService";

@injectable()
export default abstract class UserManagedService implements Service {
  public constructor(
    @inject(TYPES.Service) @named("RoleService") protected roleService: RoleService,
    @inject(TYPES.Service) @named("PermissionService") protected permissionService: PermissionService,
    private collection: AbstractModel<any, any>
  ) {}

  public async start(): Promise<void> {
    /* */
  }

  public async createCustomPermissionGroup(
    entityId: ObjectId,
    groupName: string,
    groupDescription: string,
    permissions: string[]
  ): Promise<void> {
    try {
      const newPermisionGroup = await this.permissionService.createPermissionGroup(
        groupName,
        groupDescription,
        groupName.trim().toLowerCase().replace(" ", "-"),
        permissions
      );
      await this.collection.findOneAndUpdate(
        { _id: entityId },
        { $push: { customPermissionGroups: newPermisionGroup } }
      );
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async modifyCustomGroupPermissions(groupId: ObjectId, permissions: string[]): Promise<void> {
    try {
      await this.permissionService.modifyGroupPermissions(permissions, groupId);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async deleteCustomPermissionGroup(groupId: ObjectId): Promise<void> {
    try {
      await this.permissionService.deletePermissionGroup(groupId);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async createCustomRole(
    entityId: ObjectId,
    roleName: string,
    groups: string[],
    permissions: string[]
  ): Promise<Role> {
    try {
      const newRole = await this.roleService.createRole(roleName, groups, permissions);
      await this.collection.findOneAndUpdate({ _id: entityId }, { $push: { roles: newRole } });
      return newRole;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async updateCustomRole(roleId: ObjectId, updatePayload: Partial<Role>): Promise<void> {
    try {
      await this.roleService.updateRole(roleId, updatePayload);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async deleteCustomRole(roleId: ObjectId): Promise<void> {
    try {
      await this.roleService.deleteRole(roleId);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }
}
