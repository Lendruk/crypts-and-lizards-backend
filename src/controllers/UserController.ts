import { Response } from "express";
import { inject, injectable, named } from "inversify";
import Controller from "../types/Controller";
import { Delete, Put } from "../decorators/ControllerRoute";
import { RequireLogin } from "../decorators/RequireAuth";
import UserService from "../services/UserService";
import { TYPES } from "../ioc/Types";
import { ExpressRequest } from "../types/ExpressRequest";
import { Route } from "../decorators/Route";

@injectable()
@Route("/users")
export default class UserController implements Controller {
  public constructor(@inject(TYPES.Service) @named("UserService") private userService: UserService) {}

  public start(): void {
    /* */
  }

  @Put("/self")
  @RequireLogin()
  public async updateSelf(req: ExpressRequest, res: Response): Promise<void> {
    const { body, user } = req;
    await this.userService.updateUser(user, body.email, body.username);
    res.status(200).send();
  }

  @Delete("/self")
  @RequireLogin()
  public async deleteSelf(req: ExpressRequest, res: Response): Promise<void> {
    const { user } = req;
    await this.userService.deleteUser(user);
    res.status(200).send();
  }
}
