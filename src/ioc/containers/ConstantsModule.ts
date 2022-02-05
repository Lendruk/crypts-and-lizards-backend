import { ContainerModule, interfaces } from "inversify";
import { TYPES } from "../Types";
import * as bCrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class ConstantsModule {
  private module: ContainerModule;

  constructor() {
    this.module = new ContainerModule((bind: interfaces.Bind) => {
      bind<typeof bCrypt>(TYPES.BCrypt).toConstantValue(bCrypt);
      bind<typeof jwt>(TYPES.JWT).toConstantValue(jwt);
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }
}

export default new ConstantsModule();
