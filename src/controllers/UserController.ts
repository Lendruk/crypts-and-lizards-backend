import { Response } from "express";
import { inject, injectable, named } from "inversify";
import Controller from "../types/Controller";
import { Delete, Put } from "../types/ControllerRoute";
import { RequireAuth } from "../decorators/RequireAuth";
import UserService from "../services/UserService";
import { TYPES } from "../ioc/Types";
import { ExpressRequest } from "../types/ExpressRequest";

@injectable()
export default class UserController implements Controller {
  private static readonly API_PATH = "/users";

  public constructor(@inject(TYPES.Service) @named("UserService") private userService: UserService) {}

  public start(): void {
    /* */
  }

  @Put("/self")
  @RequireAuth()
  public async updateSelf(req: ExpressRequest, res: Response): Promise<void> {
    const { body, user } = req;
    await this.userService.updateUser(user, body.email, body.username);
    res.status(200).send();
  }

  @Delete("/self")
  @RequireAuth()
  public async deleteSelf(req: ExpressRequest, res: Response): Promise<void> {
    const { user } = req;
    await this.userService.deleteUser(user);
    res.status(200).send();
  }

  public getApiPath(): string {
    return UserController.API_PATH;
  }
}
