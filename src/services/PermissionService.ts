import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import { Permission, PermissionCollection, PermissionGroup, PermissionGroupCollection } from "../models/Permission";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";

@injectable()
export default class PermissionService implements Service {
  public constructor(
    @inject(TYPES.Model) @named("PermissionDb") private permissionDb: PermissionCollection,
    @inject(TYPES.Model) @named("PermissionGroupDb") private permissionGroupDb: PermissionGroupCollection
  ) {}

  public async start(): Promise<void> {
    /* */
  }

  public async createPermissionGroup(
    name: string,
    description: string,
    shortName: string,
    permissions: string[] = []
  ): Promise<PermissionGroup> {
    const newPermissionGroup = await this.permissionGroupDb.save({ name, description, shortName }, { permissions });
    return newPermissionGroup;
  }

  public async groupContainsPermission(group: ObjectId | PermissionGroup, permissionName: string): Promise<boolean> {
    const permissionGroup = await this.permissionGroupDb.queryOne({ _id: group }).populate("permissions");
    if (permissionGroup) {
      const permissions = permissionGroup.permissions as Permission[];
      if (permissions.find((permission) => permission.shortName === permissionName)) {
        return true;
      }
    }
    return false;
  }

  public deletePermissionGroup(groupId: ObjectId): Promise<void> {
    return this.permissionGroupDb.deleteById(groupId);
  }

  public async addPermissionToGroup(permissionShortName: string, group: ObjectId): Promise<PermissionGroup> {
    const permission = await this.permissionDb.findOne({ shortName: permissionShortName });

    if (!permission) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }

    const permissionGroup = await this.permissionGroupDb.findOneAndUpdate(
      { _id: group },
      { $push: { permissions: permission } },
      { new: true }
    );

    if (!permissionGroup) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }

    return permissionGroup;
  }

  public async getPermissions(): Promise<Permission[]> {
    return await this.permissionDb.all();
  }

  public async createPermission(name: string, shortName: string, description: string): Promise<Permission> {
    const newPermission = await this.permissionDb.save({ name, shortName, description });
    return newPermission;
  }

  public async getPermission(shortName: string): Promise<Permission | null> {
    const permission = await this.permissionDb.findOne({ shortName });
    return permission;
  }

  public async getGlobalPermissionGroup(shortName: string): Promise<PermissionGroup | null> {
    const permissionGroup = await this.permissionGroupDb.findOne({ shortName, global: true });
    return permissionGroup;
  }
}
