import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import { Campaign, CampaignCollection } from "../models/Campaign";
import { User } from "../models/User";
import { ObjectId } from "../utils/ObjectId";
import UserManagedService from "./generic/UserManagedService";
import PermissionService from "./PermissionService";
import RoleService from "./RoleService";
import UserService from "./UserService";

@injectable()
export default class CampaignService extends UserManagedService {
  public constructor(
    @inject(TYPES.Model) @named("CampaignDb") private campaignDb: CampaignCollection,
    @inject(TYPES.Service) @named("UserService") private userService: UserService,
    @inject(TYPES.Service) @named("RoleService") protected roleService: RoleService,
    @inject(TYPES.Service) @named("PermissionService") protected permissionService: PermissionService
  ) {
    super(roleService, permissionService, campaignDb);
  }

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
}
