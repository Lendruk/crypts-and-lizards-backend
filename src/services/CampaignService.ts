import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import { Campaign, CampaignDb } from "../models/Campaign";
import { User } from "../models/User";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";
import RoleService from "./RoleService";
import UserService from "./UserService";

@injectable()
export default class CampaignService implements Service {
  public constructor(
    @inject(TYPES.Model) @named("CampaignDb") private campaignDb: CampaignDb,
    @inject(TYPES.Service) @named("RoleService") private roleService: RoleService,
    @inject(TYPES.Service) @named("UserService") private userService: UserService
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
      const ownerRole = await this.roleService.createRole("Owner", "updateCampaign");
      const editorRole = await this.roleService.createRole("Editor", "updateCampaign");
      const viewerRole = await this.roleService.createRole("Viewer", "updateCampaign");

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

  public async updateCampaign(campaignId: ObjectId, payload: Partial<Campaign>): Promise<Campaign> {
    try {
      const updatedCampaign = await this.campaignDb.findOneAndUpdate({ _id: campaignId }, payload, { new: true });
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
