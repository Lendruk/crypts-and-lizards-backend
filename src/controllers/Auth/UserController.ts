import { Request, Response } from "express";
import { injectable } from "inversify";
import Controller from "../../types/Controller";
import { Delete, Put } from "../../types/ControllerRoute";

@injectable()
export default class UserController implements Controller {
  private static readonly API_PATH = '/users';

  public start(): void {} 
  
  @Put('/self')
  public updateSelf(req: Request, res: Response) {

  }

  @Delete('/:id')
  public deleteUser(req: Request, res: Response) {
    
  }

  @Put('/:id')
  public updateUser(req: Request, res: Response) {

  }

  public getApiPath(): string {
    return UserController.API_PATH;
  }
}