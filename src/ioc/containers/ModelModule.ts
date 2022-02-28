import { ContainerModule, interfaces } from "inversify";
import { AssetPackDb } from "../../models/Assets/AssetPack";
import { ResourceTemplateDb } from "../../models/Assets/ResourceTemplate";
import { CampaignDb } from "../../models/Campaign";
import { PermissionDb, PermissionGroupDb } from "../../models/Permission";
import { RoleDb } from "../../models/Role";
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
      bind<CampaignDb>(TYPES.Model).to(CampaignDb).inSingletonScope().whenTargetNamed("CampaignDb");
      bind<PermissionDb>(TYPES.Model).to(PermissionDb).inSingletonScope().whenTargetNamed("PermissionDb");
      bind<PermissionGroupDb>(TYPES.Model)
        .to(PermissionGroupDb)
        .inSingletonScope()
        .whenTargetNamed("PermissionGroupDb");
      bind<RoleDb>(TYPES.Model).to(RoleDb).inSingletonScope().whenTargetNamed("RoleDb");
      bind<ResourceTemplateDb>(TYPES.Model)
        .to(ResourceTemplateDb)
        .inSingletonScope()
        .whenTargetNamed("ResourceTemplateDb");
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }
}

export default new ModelModule();
