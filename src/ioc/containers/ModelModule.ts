import { ContainerModule, interfaces } from "inversify";
import { AssetPackCollection } from "../../models/Assets/AssetPack";
import { ResourceTemplateCollection } from "../../models/Assets/ResourceTemplate";
import { CampaignCollection } from "../../models/Campaign";
import { MapTemplateCollection } from "../../models/MapTemplate";
import { PermissionCollection, PermissionGroupCollection } from "../../models/Permission";
import { RoleCollection } from "../../models/Role";
import { TagCollection } from "../../models/Tag";
import { TokenCollection } from "../../models/Token";
import { UserCollection } from "../../models/User";
import { TYPES } from "../Types";

class ModelModule {
  private module: ContainerModule;

  constructor() {
    this.module = new ContainerModule((bind: interfaces.Bind) => {
      bind<UserCollection>(TYPES.Model).to(UserCollection).inSingletonScope().whenTargetNamed("User");
      bind<TokenCollection>(TYPES.Model).to(TokenCollection).inSingletonScope().whenTargetNamed("Token");
      bind<AssetPackCollection>(TYPES.Model)
        .to(AssetPackCollection)
        .inSingletonScope()
        .whenTargetNamed("AssetPackCollection");
      bind<CampaignCollection>(TYPES.Model)
        .to(CampaignCollection)
        .inSingletonScope()
        .whenTargetNamed("CampaignCollection");
      bind<PermissionCollection>(TYPES.Model)
        .to(PermissionCollection)
        .inSingletonScope()
        .whenTargetNamed("PermissionCollection");
      bind<PermissionGroupCollection>(TYPES.Model)
        .to(PermissionGroupCollection)
        .inSingletonScope()
        .whenTargetNamed("PermissionGroupCollection");
      bind<RoleCollection>(TYPES.Model).to(RoleCollection).inSingletonScope().whenTargetNamed("RoleCollection");
      bind<ResourceTemplateCollection>(TYPES.Model)
        .to(ResourceTemplateCollection)
        .inSingletonScope()
        .whenTargetNamed("ResourceTemplateDb");
      bind<MapTemplateCollection>(TYPES.Model)
        .to(MapTemplateCollection)
        .inSingletonScope()
        .whenTargetNamed("MapTemplateCollection");
      bind<TagCollection>(TYPES.Model).to(TagCollection).inSingletonScope().whenTargetNamed("TagCollection");
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }
}

export default new ModelModule();
