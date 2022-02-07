import { ContainerModule, interfaces } from "inversify";
import { TYPES } from "../Types";
import * as bCrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "../../utils/ObjectId";

class LibraryModule {
  private module: ContainerModule;

  constructor() {
    this.module = new ContainerModule((bind: interfaces.Bind) => {
      bind<typeof bCrypt>(TYPES.BCrypt).toConstantValue(bCrypt);
      bind<typeof jwt>(TYPES.JWT).toConstantValue(jwt);
      bind<ObjectId>(TYPES.ObjectId).toFactory<ObjectId, [string]>(() => {
        return (id: string) => new ObjectId(id);
      });
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }
}

export default new LibraryModule();
