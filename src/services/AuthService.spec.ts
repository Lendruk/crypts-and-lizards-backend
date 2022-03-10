import { TokenCollection } from "../models/Token";
import { User, UserCollection } from "../models/User";
import { createBCryptMock } from "../test/mocks/libraries/BCryptMock";
import { createModelMock, TypedJestMock } from "../test/utils/testUtils";
import AuthService from "./AuthService";
import * as BCrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createJWTMock } from "../test/mocks/libraries/JWTMock";

jest.mock("../utils/ObjectId", () => ({ ObjectId: jest.fn().mockImplementation(() => "mock_id") }));

describe("MapService", () => {
  let cut: AuthService;
  let userDbMock: TypedJestMock<UserCollection>;
  let tokenDbMock: TypedJestMock<TokenCollection>;
  let bCryptMock: TypedJestMock<typeof BCrypt>;
  let jwtMock: TypedJestMock<typeof jwt>;

  const MOCK_USERNAME = "mock_username";
  const MOCK_PASSWORD = "mock_password";
  const MOCK_TOKEN = "mock_token";

  const MOCK_USER: User = {
    email: "mock_email",
    password: "mock_password",
    usedAssets: { assetPacks: [] },
    username: "mock_username",
    id: "mock_id",
    roles: [],
  };

  beforeEach(() => {
    userDbMock = createModelMock();
    bCryptMock = createBCryptMock();
    tokenDbMock = createModelMock();
    jwtMock = createJWTMock();

    cut = new AuthService(userDbMock as any, tokenDbMock as any, bCryptMock as any, jwtMock as any);
  });

  describe("loginUser", () => {
    describe("login is successful", () => {
      beforeEach(async () => {
        userDbMock.findOne.mockReturnValue(Promise.resolve(MOCK_USER));
        bCryptMock.compare.mockReturnValue(true);
        cut.loginUser({ username: MOCK_USERNAME, password: MOCK_PASSWORD });
      });

      it("retrieves user", () => {
        expect(userDbMock.findOne).toHaveBeenCalled();
      });

      it("compares password", () => {
        expect(bCryptMock.compare).toHaveBeenCalled();
      });

      it("saves token", () => {
        expect(tokenDbMock.save).toHaveBeenCalled();
      });
    });
  });

  describe("logoutUser", () => {
    describe("token exists", () => {
      beforeEach(async () => {
        tokenDbMock.findOne.mockReturnValue({ token: MOCK_TOKEN });
        userDbMock.findOne.mockReturnValue(MOCK_USER);
        jwtMock.verify.mockReturnValue(true);
        await cut.logoutUser(MOCK_TOKEN);
      });

      it("deletes the token", () => {
        expect(tokenDbMock.deleteByField).toHaveBeenCalledWith({ token: MOCK_TOKEN });
      });
    });
  });

  describe("registerUser", () => {
    describe("user does not exist yet", () => {
      beforeEach(async () => {
        userDbMock.findOne.mockReturnValue(null);
        await cut.registerUser({ username: "mock_username", email: "mock_email", password: "mock_password" });
      });

      it("checks if user already exists", () => {
        expect(userDbMock.findOne).toHaveBeenCalled();
      });

      it("creates a hashed password", () => {
        expect(bCryptMock.genSalt).toHaveBeenCalled();
        expect(bCryptMock.hash).toHaveBeenCalled();
      });

      it("saves user", () => {
        expect(userDbMock.save).toHaveBeenCalled();
      });
    });
  });
});
