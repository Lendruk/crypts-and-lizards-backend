import { inject, injectable, named } from "inversify";
import { TYPES } from "../ioc/Types";
import ItemService from "../services/ItemService";
import Controller from "../types/Controller";
import { Route } from "../decorators/Route";

@injectable()
@Route("/items")
export default class ItemController implements Controller {
  public constructor(@inject(TYPES.Service) @named("ItemService") private itemService: ItemService) {}

  public start(): void {
    /**/
  }
}
