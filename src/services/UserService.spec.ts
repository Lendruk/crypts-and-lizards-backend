import { User, UserCollection } from "../models/User";
import { createModelMock, TypedJestMock } from "../test/utils/testUtils";
import UserService from "./UserService";

jest.mock("../utils/ObjectId", () => ({ ObjectId: jest.fn().mockImplementation(() => "mock_id") }));

describe("UserService", () => {
  let cut: UserService;
  let userDbMock: TypedJestMock<UserCollection>;
  const MOCK_USER: User = {
    email: "mock_email",
    password: "mock_password",
    usedAssets: { assetPacks: [] },
    username: "mock_username",
    id: "id",
    roles: [],
  };

  beforeEach(() => {
    userDbMock = createModelMock();
    cut = new UserService(userDbMock as any);
  });

  describe("updateUser", () => {
    describe("with all parameters", () => {
      beforeEach(async () => {
        await cut.updateUser(MOCK_USER, "new_email", "new_username");
      });

      it("updates the user", () => {
        expect(userDbMock.findOneAndUpdate).toHaveBeenCalledWith(expect.any(Object), {
          email: "new_email",
          username: "new_username",
        });
      });
    });
  });

  describe("deleteUser", () => {
    beforeEach(async () => {
      await cut.deleteUser(MOCK_USER);
    });

    it("deletes the user", () => {
      expect(userDbMock.deleteById).toHaveBeenCalled();
    });
  });
});
