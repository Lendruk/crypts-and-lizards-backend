import { Request, Response } from "express";
import { injectable } from "inversify";
import Controller from "../../types/Controller";
import { Delete, Put } from "../../types/ControllerRoute";
import AuthService from "../../services/AuthService";
import { Errors, Exception } from "../../error-handling/ErrorCodes";
import User from "../../models/User";
import Token from "../../models/Token";

@injectable()
export default class UserController implements Controller {
  private static readonly API_PATH = '/users';

  public start(): void {} 
  
  @Put('/self')
  public async updateSelf(req: Request, res: Response): Promise<void> {
    const { body } = req;

    const updatePayload: { [index:string]: string }= {};

    const token = body.token;

    if(!token || !AuthService.verifyToken(token)) throw new Exception(Errors.AUTH.NO_TOKEN);

    if(body.email) {
      updatePayload.email = body.email;
    }

    if(body.username) {
      updatePayload.username = body.username;
    }

    if(Object.keys(updatePayload).length > 0) {
      const tokenObj = await Token.findOne({ token });
       await User.findOneAndUpdate({ _id: tokenObj!.user }, { ...updatePayload });
    }

    res.status(200).send();
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