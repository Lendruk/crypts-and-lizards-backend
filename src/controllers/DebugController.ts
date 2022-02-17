import { Request, Response } from "express";
import { injectable } from "inversify";
import Controller from "../types/Controller";
import { Get, Post } from "../types/ControllerRoute";
import { RequireAuth } from "../decorators/RequireAuth";
import { convertItems, createBaseCurrencies } from "../utils/convertItems";

@injectable()
export default class DebugController implements Controller {
  private static readonly API_PATH = "/debug";

  public start(): void {
    /* */
  }

  @Post("/convertItems")
  public async mapItems(req: Request, res: Response): Promise<void> {
    try {
      await convertItems();
    } catch (error) {
      console.log(error);
    }
    res.status(200).send();
  }

  public getApiPath(): string {
    return DebugController.API_PATH;
  }

  @Post("/createBaseCurrencies")
  public async createBaseCurrencies(req: Request, res: Response): Promise<void> {
    try {
      await createBaseCurrencies();
    } catch (error) {
      console.log(error);
    }
    res.status(200).send();
  }

  @Get("/testAuth")
  @RequireAuth()
  public async testAuth(req: Request, res: Response): Promise<void> {
    res.status(200).send();
  }
}
