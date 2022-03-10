import { ContainerModule, interfaces } from "inversify";
import { AssetPackCollection } from "../../models/Assets/AssetPack";
import { ResourceTemplateCollection } from "../../models/Assets/ResourceTemplate";
import { CampaignCollection } from "../../models/Campaign";
import { PermissionCollection, PermissionGroupCollection } from "../../models/Permission";
import { RoleCollection } from "../../models/Role";
import { TokenCollection } from "../../models/Token";
import { UserCollection } from "../../models/User";
import { TYPES } from "../Types";

class ModelModule {
  private module: ContainerModule;

  constructor() {
    this.module = new ContainerModule((bind: interfaces.Bind) => {
      bind<UserCollection>(TYPES.Model).to(UserCollection).inSingletonScope().whenTargetNamed("User");
      bind<TokenCollection>(TYPES.Model).to(TokenCollection).inSingletonScope().whenTargetNamed("Token");
      bind<AssetPackCollection>(TYPES.Model).to(AssetPackCollection).inSingletonScope().whenTargetNamed("AssetPackDb");
      bind<CampaignCollection>(TYPES.Model).to(CampaignCollection).inSingletonScope().whenTargetNamed("CampaignDb");
      bind<PermissionCollection>(TYPES.Model)
        .to(PermissionCollection)
        .inSingletonScope()
        .whenTargetNamed("PermissionDb");
      bind<PermissionGroupCollection>(TYPES.Model)
        .to(PermissionGroupCollection)
        .inSingletonScope()
        .whenTargetNamed("PermissionGroupDb");
      bind<RoleCollection>(TYPES.Model).to(RoleCollection).inSingletonScope().whenTargetNamed("RoleDb");
      bind<ResourceTemplateCollection>(TYPES.Model)
        .to(ResourceTemplateCollection)
        .inSingletonScope()
        .whenTargetNamed("ResourceTemplateDb");
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }
}

export default new ModelModule();
