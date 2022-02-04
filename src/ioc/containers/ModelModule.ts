import { ContainerModule, interfaces } from "inversify";
import { UserDb } from "../../models/User";
import { TYPES } from "../Types";

class ModelModule {
  private module: ContainerModule;

  constructor() {
    this.module = new ContainerModule((bind: interfaces.Bind) => {
      bind<UserDb>(TYPES.Model).to(UserDb).inSingletonScope().whenTargetNamed("User");
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }
}

export default new ModelModule();
