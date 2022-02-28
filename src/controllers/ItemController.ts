import { Request, Response } from "express";
import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import ItemService from "../services/ItemService";
import Controller from "../types/Controller";
import { Get } from "../decorators/ControllerRoute";
import { Route } from "../decorators/Route";

@injectable()
@Route("/items")
export default class ItemController implements Controller {
  public constructor(@inject(TYPES.Service) @named("ItemService") private itemService: ItemService) {}

  public start(): void {
    /**/
  }

  @Get("/currencies")
  public async getCurrencies(req: Request, res: Response): Promise<void> {
    const currencies = await this.itemService.getCurrencies();
    res.status(200).json(currencies);
  }

  @Get("/currencies/:id")
  public async getCurrency(req: Request, res: Response): Promise<void> {
    const {
      params: { id },
    } = req;

    if (!id || typeof id !== "string") {
      throw new ServerException(Errors.BAD_REQUEST);
    }

    const currency = await this.itemService.getCurrency(id);
    res.status(200).json(currency);
  }
}
