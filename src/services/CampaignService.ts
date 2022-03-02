import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import { Campaign, CampaignDb } from "../models/Campaign";
import { PermissionGroup } from "../models/Permission";
import { Role } from "../models/Role";
import { User } from "../models/User";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";
import PermissionService from "./PermissionService";
import RoleService from "./RoleService";
import UserService from "./UserService";

@injectable()
export default class CampaignService implements Service {
  public constructor(
    @inject(TYPES.Model) @named("CampaignDb") private campaignDb: CampaignDb,
    @inject(TYPES.Service) @named("RoleService") private roleService: RoleService,
    @inject(TYPES.Service) @named("UserService") private userService: UserService,
    @inject(TYPES.Service) @named("PermissionService") private permissionService: PermissionService
  ) {}

  public async start(): Promise<void> {
    /* */
  }

  public async getMyCampaigns(user: User): Promise<Campaign[]> {
    try {
      const campaigns = await this.campaignDb.queryByField({ createdBy: user.id });

      return campaigns;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async createCampaign(user: User, title: string): Promise<void> {
    try {
      const ownerRole = await this.roleService.createDefaultRole("Owner", "campaignOwner");
      const editorRole = await this.roleService.createDefaultRole("Editor", "campaignOwner");
      const viewerRole = await this.roleService.createDefaultRole("Viewer", "campaignOwner");

      const newCampaign = await this.campaignDb.save({
        createdBy: user.id,
        title,
        roles: [editorRole.id, viewerRole.id, ownerRole.id],
      });
      await this.userService.addRole(user, ownerRole, newCampaign.id, "campaigns");
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async updateCampaign(campaignId: ObjectId, updatePayload: Partial<Campaign>): Promise<Campaign> {
    try {
      const updatedCampaign = await this.campaignDb.findOneAndUpdate({ _id: campaignId }, updatePayload, { new: true });
      return updatedCampaign;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async deleteCampaign(campaignId: ObjectId): Promise<void> {
    const campaign = await this.campaignDb.findOne({ _id: campaignId });
    const roles = campaign?.roles;

    if (roles) {
      for (const role of roles) {
        await this.roleService.deleteRole(new ObjectId(role));
      }
    }

    return this.campaignDb.deleteById(campaignId);
  }

  public async createCustomPermissionGroup(
    campaignId: ObjectId,
    groupName: string,
    groupDescription: string,
    permissions: string[]
  ): Promise<Campaign> {
    try {
      const newPermisionGroup = await this.permissionService.createPermissionGroup(
        groupName,
        groupDescription,
        groupName.trim().toLowerCase().replace(" ", "-"),
        permissions
      );
      const updatedCampaign = await this.campaignDb.findOneAndUpdate(
        { _id: campaignId },
        { $push: { customPermissionGroups: newPermisionGroup } }
      );

      return updatedCampaign;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async updateCustomPermissionGroup(groupId: ObjectId, updatePayload: Partial<PermissionGroup>): Promise<void> {
    //TODO
  }

  public async deleteCustomPermissionGroup(campaignId: ObjectId, groupId: ObjectId): Promise<void> {
    //TODO
  }

  public async createCustomRole(
    campaignId: ObjectId,
    roleName: string,
    groups: string[],
    permissions: string[]
  ): Promise<Role> {
    try {
      const newRole = await this.roleService.createRole(roleName, groups, permissions);
      await this.campaignDb.findOneAndUpdate({ _id: campaignId }, { $push: { roles: newRole } });
      return newRole;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async updateCustomRole(roleId: ObjectId, updatePayload: Partial<Role>): Promise<void> {
    //TODO
  }

  public async deleteCustomRole(campaignId: ObjectId, roleId: ObjectId): Promise<void> {
    // TODO
  }
}
