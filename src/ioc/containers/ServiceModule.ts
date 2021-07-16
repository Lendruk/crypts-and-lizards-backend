import { Container, ContainerModule, interfaces } from "inversify";
import AuthService from "../../services/AuthService";
import { Service } from "../../types/Service";
import { TYPES } from "../Types";

class ServiceModule {
  private module: ContainerModule;
  
  constructor() {
    this.module = new ContainerModule((bind: interfaces.Bind) => {
      bind<Service>(TYPES.Service).toConstantValue(new AuthService()).whenTargetNamed("AuthService");
    });
  }

  getContainerModule(): ContainerModule {
    return this.module;
  }

  async start(container: Container): Promise<void> {
   await Promise.race(
     container.getAll<Service>(TYPES.Service).map(service => service.start())
   );
  }
}

export default new ServiceModule();