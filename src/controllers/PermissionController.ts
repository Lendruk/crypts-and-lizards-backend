import { Response } from "express";
import { inject, injectable, named } from "inversify";
import { Delete, Post } from "../decorators/ControllerRoute";
import { RequirePermission } from "../decorators/RequirePermission";
import { Route } from "../decorators/Route";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import CampaignService from "../services/CampaignService";
import PermissionService from "../services/PermissionService";
import Controller from "../types/Controller";
import { ExpressRequest } from "../types/ExpressRequest";
import { ObjectId } from "../utils/ObjectId";

@injectable()
@Route("/permissions")
export default class PermissionController implements Controller {
  public constructor(
    @inject(TYPES.Service) @named("CampaignService") private campaignService: CampaignService,
    @inject(TYPES.Service) @named("PermissionService") private permissionService: PermissionService
  ) {}

  public start(): void {
    /* */
  }

  @Post("/groups")
  @RequirePermission({ mandatory: ["campaign::createPermGroup"] })
  public async createPermissionGroup(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const {
        params: { id },
        body,
      } = req;

      const { groupName, groupDescription, permissions } = body;

      const updatedCampaign = await this.campaignService.createCustomPermissionGroup(
        new ObjectId(id),
        groupName,
        groupDescription,
        permissions ? permissions : []
      );

      res.status(200).send(updatedCampaign);
    } catch (error) {}
  }

  @Delete("/groups/:id")
  @RequirePermission({ mandatory: ["campaign::deletePermGroup"] })
  public async deletePermissionGroup(req: ExpressRequest, res: Response): Promise<void> {
    const {
      params: { id },
    } = req;

    try {
      // TODO - remove permission group from all roles that have it and remove it from campaign that has it
      await this.permissionService.deletePermissionGroup(new ObjectId(id));
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
    res.status(200).send();
  }
}
