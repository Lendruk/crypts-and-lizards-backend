import { Request, Response } from "express";
import { inject, injectable, named } from "inversify";
import { Errors, Exception, ServerException } from "../../error-handling/ErrorCodes";
import { TYPES } from "../../ioc/Types";
import AuthService from "../../services/AuthService";
import Controller from "../../types/Controller";
import { Post } from "../../decorators/ControllerRoute";
import { ExpressRequest } from "../../types/ExpressRequest";
import { RequireLogin } from "../../decorators/RequireAuth";
import { Route } from "../../decorators/Route";

@injectable()
@Route("/auth")
export default class AuthController implements Controller {
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
  @RequireLogin()
  public async logout(req: ExpressRequest, res: Response): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.authService.logoutUser(req.accessToken!);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }

    res.status(200).send();
  }

  @Post("/verifyToken")
  @RequireLogin()
  public async verifySession(req: Request, res: Response): Promise<void> {
    res.json({ validSession: true }).send();
  }
}
