import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import { Role, RoleCollection } from "../models/Role";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";
import PermissionService from "./PermissionService";

@injectable()
export default class RoleService implements Service {
  public constructor(
    @inject(TYPES.Model) @named("RoleCollection") private roleCollection: RoleCollection,
    @inject(TYPES.Service) @named("PermissionService") private permissionService: PermissionService
  ) {}

  public async createRole(roleName: string, groups: string[], permissions: string[]): Promise<Role> {
    const role = await this.roleCollection.save({ name: roleName }, { groups, permissions });
    return role;
  }

  public async createDefaultRole(roleName: string, groupName: string): Promise<Role> {
    const permissionGroup = await this.permissionService.getGlobalPermissionGroup(groupName);

    if (!permissionGroup) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND, "Permission Group not found");
    }

    const role = await this.roleCollection.save({ name: roleName, groups: [permissionGroup.id] });
    return role;
  }

  public async getRole(roleId: ObjectId): Promise<Role> {
    const role = await this.roleCollection.queryOne({ _id: roleId }).populate("groups", "permissions");
    if (!role) {
      throw new ServerException(Errors.NOT_FOUND);
    }
    return role.toObject() as Role;
  }

  public async deleteRole(roleId: ObjectId): Promise<void> {
    return this.roleCollection.deleteById(roleId);
  }

  public async updateRole(roleId: ObjectId, updatePayload: Partial<Role>): Promise<Role> {
    return this.roleCollection.findOneAndUpdate({ _id: roleId }, updatePayload, { new: true });
  }

  public async addUserToRole(userToAdd: ObjectId, roleId: ObjectId): Promise<void> {
    //TODO
  }

  public async removeUserFromRole(userToRemove: ObjectId, roleId: ObjectId): Promise<void> {
    //TODO
  }

  public async start(): Promise<void> {
    /* */
  }
}
