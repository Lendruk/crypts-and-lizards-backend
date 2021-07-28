import { injectable } from "inversify";
import { Service } from "../types/Service";
import * as bCrypt from "bcryptjs";
import User from "../models/User";
import jwt from "jsonwebtoken";
import Token from "../models/Token";
import { Errors, Exception, ServerException } from "../error-handling/ErrorCodes";

type LoginReturns = {
  accessToken: string;
  user: {
    username: string;
    email?: string;
  };
};

@injectable()
export default class AuthService implements Service {
  public async start(): Promise<void> {
    /* */
  }

  public async registerUser(options: { username: string; email: string; password: string }): Promise<void> {
    const { username, email, password } = options;
    const hashedPassword = await this.generateHash(password);

    if (await User.findOne({ $or: [{ username }, { email }] })) {
      throw new ServerException(Errors.BAD_REQUEST);
    }

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
  }

  public async loginUser(options: { username: string; password: string }): Promise<LoginReturns> {
    const { username, password } = options;

    const user = await User.findOne({ username }).lean();

    if (!user) throw new Exception(Errors.AUTH.INVALID_CREDS);

    const correctPassword = await bCrypt.compare(password, user.password);

    if (!correctPassword) throw new Exception(Errors.AUTH.INVALID_CREDS);

    const token = jwt.sign({ _id: user._id }, user.password, { expiresIn: "5h" });

    try {
      const newToken = new Token({ user, token, device: "WEB" });
      await newToken.save();
    } catch (error) {
      throw new ServerException(Errors.AUTH.INVALID_CREDS);
    }

    return { accessToken: token, user: { username: user.username, email: user.email || undefined } };
  }

  public async logoutUser(token: string): Promise<void> {
    if (await AuthService.verifyToken(token)) {
      await Token.deleteOne({ token });
    }
  }

  private async generateHash(password: string): Promise<string> {
    const salt = await bCrypt.genSalt(12);
    const hash = await bCrypt.hash(password, salt);
    return hash;
  }

  static async verifyToken(token: string): Promise<User | undefined> {
    const tokenObj = await Token.findOne({ token }).lean();

    if (!tokenObj) return undefined;

    const user = await User.findOne({ _id: tokenObj.user });

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
}
