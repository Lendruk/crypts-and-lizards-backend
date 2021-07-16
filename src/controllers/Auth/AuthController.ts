import { Request, Response } from "express";
import { inject, injectable, named } from "inversify";
import { TYPES } from "../../ioc/Types";
import AuthService from "../../services/AuthService";
import Controller from "../../types/Controller";
import { Get, Post } from "../../types/ControllerRoute";

@injectable()
export default class AuthController implements Controller {
  private static readonly API_PATH = '/auth';

  public constructor(@inject(TYPES.Service) @named("AuthService") private authService: AuthService) {}

  public start(): void {
   
  } 

  @Post("/register")
  public async register(req: Request, res: Response): Promise<void> {
    const { body: { username, email, password }} = req;

    if(!username) throw new Error('TBD');
    if(!email) throw new Error('TBD');
    if(!password) throw new Error('TBD');

    await this.authService.registerUser({ username, email, password });

    res.status(200).json({ });
  }

  @Post("/login")
  public async login(req: Request, res: Response): Promise<void> {
    const { body: { email, password } } = req;

    const token = await this.authService.loginUser({ email, password });

    res.status(200).json({ token });
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