import { injectable } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import Currency from "../models/Items/Currency";
import Item from "../models/Items/Item";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";

@injectable()
export default class ItemService implements Service {
  public async start(): Promise<void> {
    /* */
  }

  public async getCurrencies(): Promise<Currency[]> {
    try {
      return Currency.find({}).lean();
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async getCurrency(id: string): Promise<Currency> {
    try {
      const currency = await Currency.findOne({ _id: new ObjectId(id) });

      if (!currency) {
        throw new ServerException(Errors.RESOURCE_NOT_FOUND);
      }

      return currency;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async getItem(id: string): Promise<Item<any>> {
    let item: Item<any> | null;
    try {
      item = await Item.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }

    if (!item) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }

    return item;
  }
}
