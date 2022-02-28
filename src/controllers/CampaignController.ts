import { Response } from "express";
import { inject, injectable, named } from "inversify";
import { RequireLogin } from "../decorators/RequireAuth";
import { RequirePermission } from "../decorators/RequirePermission";
import { TYPES } from "../ioc/Types";
import CampaignService from "../services/CampaignService";
import Controller from "../types/Controller";
import { Delete, Get, Post, Put } from "../decorators/ControllerRoute";
import { ExpressRequest } from "../types/ExpressRequest";
import { ObjectId } from "../utils/ObjectId";
import { Route } from "../decorators/Route";

@injectable()
@Route("/campaigns")
export default class CampaignController implements Controller {
  public constructor(@inject(TYPES.Service) @named("CampaignService") private campaignService: CampaignService) {}

  public start(): void {
    /* */
  }

  @Get("/me")
  @RequireLogin()
  public async getMyCampaigns(req: ExpressRequest, res: Response): Promise<void> {
    const { user } = req;
    const campaigns = await this.campaignService.getMyCampaigns(user);
    res.status(200).send(campaigns);
  }

  @Post("/")
  @RequireLogin()
  public async createCampaign(req: ExpressRequest, res: Response): Promise<void> {
    const { body, user } = req;
    await this.campaignService.createCampaign(user, body.title);
    res.status(201).send();
  }

  @Put("/:id")
  @RequirePermission({ optional: ["changeName"] })
  public async updateCampaign(req: ExpressRequest, res: Response): Promise<void> {
    const {
      body,
      params: { id },
    } = req;
    const updatedCampaign = await this.campaignService.updateCampaign(new ObjectId(id), body);
    res.status(200).send(updatedCampaign);
  }

  @Delete("/:id")
  public async deleteCampaign(req: ExpressRequest, res: Response): Promise<void> {
    const {
      params: { id },
    } = req;

    await this.campaignService.deleteCampaign(new ObjectId(id));

    res.status(200).send();
  }
}
