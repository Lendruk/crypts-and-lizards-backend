import { Container, ContainerModule, interfaces } from "inversify";
import AssetService from "../../services/AssetService";
import AuthService from "../../services/AuthService";
import ItemService from "../../services/ItemService";
import MapService from "../../services/MapService";
import UserService from "../../services/UserService";
import { Service } from "../../types/Service";
import { TYPES } from "../Types";

class ServiceModule {
  private module: ContainerModule;

  constructor() {
    this.module = new ContainerModule((bind: interfaces.Bind) => {
      bind<Service>(TYPES.Service).to(AuthService).inSingletonScope().whenTargetNamed("AuthService");
      bind<Service>(TYPES.Service).to(ItemService).inSingletonScope().whenTargetNamed("ItemService");
      bind<Service>(TYPES.Service).to(AssetService).inSingletonScope().whenTargetNamed("AssetService");
      bind<Service>(TYPES.Service).to(MapService).inSingletonScope().whenTargetNamed("MapService");
      bind<Service>(TYPES.Service).to(UserService).inSingletonScope().whenTargetNamed("UserService");
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }

  async start(container: Container): Promise<void> {
    await Promise.race(container.getAll<Service>(TYPES.Service).map((service) => service.start()));
  }
}

export default new ServiceModule();
