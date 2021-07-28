import { Container, ContainerModule, interfaces } from "inversify";
import { TYPES } from "../Types";
import Controller from "../../types/Controller";
import AuthController from "../../controllers/Auth/AuthController";
import DebugController from "../../controllers/DebugController";
import ItemController from "../../controllers/ItemController";
import AssetController from "../../controllers/AssetController";

class ControllerModule {
  private module: ContainerModule;

  constructor() {
    this.module = new ContainerModule((bind: interfaces.Bind) => {
      bind<Controller>(TYPES.Controller).to(AuthController).inSingletonScope().whenTargetNamed("AuthController");
      bind<Controller>(TYPES.Controller).to(ItemController).inSingletonScope().whenTargetNamed("ItemController");
      bind<Controller>(TYPES.Controller).to(DebugController).inSingletonScope().whenTargetNamed("DebugController");
      bind<Controller>(TYPES.Controller).to(AssetController).inSingletonScope().whenTargetNamed("AssetController");
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }

  async start(container: Container): Promise<void> {
    await Promise.race([container.getAll<Controller>(TYPES.Controller).map((service) => service.start())]);
  }
}

export default new ControllerModule();
