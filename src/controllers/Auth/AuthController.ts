import { Request, Response } from "express";
import { inject, injectable, named } from "inversify";
import { Errors, Exception, ServerException } from "../../error-handling/ErrorCodes";
import { TYPES } from "../../ioc/Types";
import AuthService from "../../services/AuthService";
import Controller from "../../types/Controller";
import { Post } from "../../types/ControllerRoute";
import { ExpressRequest } from "../../types/ExpressRequest";
import { RequireAuth } from "../../types/RequireAuth";

@injectable()
export default class AuthController implements Controller {
  private static readonly API_PATH = "/auth";

  public constructor(@inject(TYPES.Service) @named("AuthService") private authService: AuthService) {}

  public start(): void {
    /* */
  }

  @Post("/register")
  public async register(req: Request, res: Response): Promise<void> {
    const {
      body: { username, email, password },
    } = req;

    if (!username) throw new Exception(Errors.MISSING_PARAMS("username"));
    if (!email) throw new Exception(Errors.MISSING_PARAMS("email"));
    if (!password) throw new Exception(Errors.MISSING_PARAMS("password"));

    await this.authService.registerUser({ username, email, password });

    res.status(200).json({});
  }

  @Post("/login")
  public async login(req: Request, res: Response): Promise<void> {
    const {
      body: { username, password },
    } = req;

    const session = await this.authService.loginUser({ username, password });

    res.status(200).json({ ...session });
  }

  @Post("/logout")
  @RequireAuth()
  public async logout(req: ExpressRequest, res: Response): Promise<void> {
    const {
      headers: { authorization },
    } = req;
    try {
      const token = authorization!.split(" ")[1];

      await this.authService.logoutUser(token);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }

    res.status(200).send();
  }

  @Post("/verifyToken")
  public async test(req: Request, res: Response): Promise<void> {
    const test = await AuthService.verifyToken(req.body.token);
    res.json({ test });
  }

  public getApiPath(): string {
    return AuthController.API_PATH;
  }
}
