import { inject, injectable, named } from "inversify";
import { Service } from "../types/Service";
import * as BCrypt from "bcryptjs";
import { User, UserCollection } from "../models/User";
import jwt from "jsonwebtoken";
import { Errors, Exception, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import { ObjectId } from "../utils/ObjectId";
import { TokenCollection } from "../models/Token";

type LoginReturns = {
  accessToken: string;
  user: {
    username: string;
    email?: string;
  };
};

@injectable()
export default class AuthService implements Service {
  public constructor(
    @inject(TYPES.Model) @named("User") private userDb: UserCollection,
    @inject(TYPES.Model) @named("Token") private tokenDb: TokenCollection,
    @inject(TYPES.BCrypt) private bCrypt: typeof BCrypt,
    @inject(TYPES.JWT) private JWT: typeof jwt
  ) {}

  public async start(): Promise<void> {
    /* */
  }

  public async registerUser(options: { username: string; email: string; password: string }): Promise<void> {
    const { username, email, password } = options;
    if (await this.userDb.findOne({ $or: [{ username }, { email }] })) {
      throw new ServerException(Errors.BAD_REQUEST);
    }

    const hashedPassword = await this.generateHash(password);
    await this.userDb.save({ username, email, password: hashedPassword, usedAssets: { assetPacks: [] } });
  }

  public async loginUser(options: { username: string; password: string }): Promise<LoginReturns> {
    const { username, password } = options;

    const user = await this.userDb.findOne({ username });

    if (!user) throw new Exception(Errors.AUTH.INVALID_CREDS);

    const correctPassword = await this.bCrypt.compare(password, user.password);

    if (!correctPassword) throw new Exception(Errors.AUTH.INVALID_CREDS);

    // TODO - Temp token duration change to 5h
    const token = this.JWT.sign({ _id: user.id }, user.password, { expiresIn: "120h" });

    try {
      await this.tokenDb.save({ token, device: "WEB" }, { user: new ObjectId(user.id) });
    } catch (error) {
      console.log(error);
      throw new ServerException(Errors.AUTH.INVALID_CREDS, error as Error);
    }

    return { accessToken: token, user: { username: user.username, email: user.email || undefined } };
  }

  public async logoutUser(token: string): Promise<void> {
    if (await this.verifyToken(token)) {
      await this.tokenDb.deleteByField({ token });
    }
  }

  public async verifyToken(token: string): Promise<User | undefined> {
    const tokenObj = await this.tokenDb.findOne({ token });
    if (!tokenObj) return undefined;

    const user = await this.userDb.queryOne({ _id: tokenObj.user }).populate("roles.role");
    if (!user) return undefined;

    try {
      this.JWT.verify(token, user.password);
      return user;
    } catch (error) {
      console.log(error);
      await this.tokenDb.deleteByField({ token: tokenObj.token });
      return undefined;
    }
  }

  private async generateHash(password: string): Promise<string> {
    const salt = await this.bCrypt.genSalt(12);
    const hash = await this.bCrypt.hash(password, salt);
    return hash;
  }
}
