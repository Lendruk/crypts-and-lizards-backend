import { inject, injectable, named } from "inversify";
import { TYPES } from "../ioc/Types";
import { User, UserDb } from "../models/User";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";

type UserUpdatePayload = {
  email?: string;
  username?: string;
};

@injectable()
export default class UserService implements Service {
  public constructor(@inject(TYPES.Model) @named("User") private userModel: UserDb) {}

  public async start(): Promise<void> {
    /* */
  }

  public async updateUser(user: User, email?: string, username?: string): Promise<void> {
    const updatePayload: UserUpdatePayload = {};
    if (email) {
      updatePayload.email = email;
    }

    if (username) {
      updatePayload.username = username;
    }

    if (Object.keys(updatePayload).length > 0) {
      await this.userModel.findOneAndUpdate({ _id: new ObjectId(user.id) }, { ...updatePayload });
    }
  }

  public async deleteUser(user: User): Promise<void> {
    await this.userModel.deleteById(new ObjectId(user.id));
  }
}
