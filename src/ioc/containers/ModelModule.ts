import { ContainerModule, interfaces } from "inversify";
import { AssetPackDb } from "../../models/Assets/AssetPack";
import { TokenDb } from "../../models/Token";
import { UserDb } from "../../models/User";
import { TYPES } from "../Types";

class ModelModule {
  private module: ContainerModule;

  constructor() {
    this.module = new ContainerModule((bind: interfaces.Bind) => {
      bind<UserDb>(TYPES.Model).to(UserDb).inSingletonScope().whenTargetNamed("User");
      bind<TokenDb>(TYPES.Model).to(TokenDb).inSingletonScope().whenTargetNamed("Token");
      bind<AssetPackDb>(TYPES.Model).to(AssetPackDb).inSingletonScope().whenTargetNamed("AssetPackDb");
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }
}

export default new ModelModule();
