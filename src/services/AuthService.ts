import { inject, injectable, named } from "inversify";
import { Service } from "../types/Service";
import * as bCrypt from "bcryptjs";
import { User, UserDb } from "../models/User";
import jwt from "jsonwebtoken";
import Token from "../models/Token";
import { Errors, Exception, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import { ObjectId } from "../utils/ObjectId";

type LoginReturns = {
  accessToken: string;
  user: {
    username: string;
    email?: string;
  };
};

@injectable()
export default class AuthService implements Service {
  public constructor(@inject(TYPES.Model) @named("User") private userDb: UserDb) {}

  public async start(): Promise<void> {
    /* */
  }

  public async registerUser(options: { username: string; email: string; password: string }): Promise<void> {
    const { username, email, password } = options;
    const hashedPassword = await this.generateHash(password);

    if (await this.userDb.findOne({ $or: [{ username }, { email }] })) {
      throw new ServerException(Errors.BAD_REQUEST);
    }

    await this.userDb.save({ username, email, password: hashedPassword, usedAssets: { assetPacks: [] } });
  }

  public async loginUser(options: { username: string; password: string }): Promise<LoginReturns> {
    const { username, password } = options;

    const user = await this.userDb.findOne({ username });

    if (!user) throw new Exception(Errors.AUTH.INVALID_CREDS);

    const correctPassword = await bCrypt.compare(password, user.password);

    if (!correctPassword) throw new Exception(Errors.AUTH.INVALID_CREDS);

    const token = jwt.sign({ _id: new ObjectId(user.id) }, user.password, { expiresIn: "5h" });

    try {
      const newToken = new Token({ user: new ObjectId(user.id), token, device: "WEB" });
      await newToken.save();
    } catch (error) {
      throw new ServerException(Errors.AUTH.INVALID_CREDS);
    }

    return { accessToken: token, user: { username: user.username, email: user.email || undefined } };
  }

  public async logoutUser(token: string): Promise<void> {
    if (await this.verifyToken(token)) {
      await Token.deleteOne({ token });
    }
  }

  public async verifyToken(token: string): Promise<User | undefined> {
    const tokenObj = await Token.findOne({ token }).lean();

    if (!tokenObj) return undefined;

    const user = await this.userDb.findOne({ _id: tokenObj.user });

    if (!user) return undefined;

    try {
      jwt.verify(token, user.password);
      return user;
    } catch (error) {
      console.log(error);
      await Token.deleteOne({ _id: tokenObj._id });
      return undefined;
    }
  }

  private async generateHash(password: string): Promise<string> {
    const salt = await bCrypt.genSalt(12);
    const hash = await bCrypt.hash(password, salt);
    return hash;
  }
}
