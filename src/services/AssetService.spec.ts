import { AssetPackDb } from "../models/Assets/AssetPack";
import { User } from "../models/User";
import { createModelMock, createQueryMockReturn, TypedJestMock } from "../test/utils/testUtils";
import { ObjectId } from "../utils/ObjectId";
import AssetService from "./AssetService";

describe("AssetService", () => {
  let cut: AssetService;
  let assetPackDbMock: TypedJestMock<AssetPackDb>;
  let objectIdFactoryMock: jest.Mock;

  const MOCK_USER: User = {
    email: "mock_email",
    password: "mock_password",
    usedAssets: { assetPacks: [] },
    username: "mock_username",
    id: "mock_id",
  };

  const MOCK_ASSET = {
    createdBy: "mock_user",
    assets: {
      categories: [],
      currencies: [],
      items: [],
    },
    description: "mock_description",
    privacy: "PRIVATE",
    tags: [{ name: "mock_tag", _id: "mock_id" }],
    title: "mock_title",
  };

  const MOCK_ASSETS = [MOCK_ASSET];

  beforeEach(() => {
    objectIdFactoryMock = jest.fn();
    assetPackDbMock = createModelMock();
    cut = new AssetService(assetPackDbMock as any, objectIdFactoryMock as any);
  });

  describe("getMyAssets", () => {
    describe("retrieves assets with success", () => {
      beforeEach(async () => {
        assetPackDbMock.queryByField.mockReturnValue(createQueryMockReturn(MOCK_ASSETS as any));
        await cut.getMyAssets(MOCK_USER);
      });

      it("retrieves assets", () => {
        expect(assetPackDbMock.queryByField).toHaveBeenCalledWith({ createdBy: MOCK_USER.id });
      });
    });
  });

  describe("getAssetPack", () => {
    describe("pack is found", () => {
      let res;
      beforeEach(async () => {
        assetPackDbMock.queryOne.mockReturnValue(createQueryMockReturn(MOCK_ASSET as any));
        res = await cut.getAssetPack("mock_id");
      });

      it("retrieves the asset pack", () => {
        expect(res).toEqual(MOCK_ASSET);
      });
    });
  });

  describe("createAssetPack", () => {
    describe("pack is created with success", () => {
      const mockOptions = {
        title: "mock_title",
        description: "mock_description",
        creator: {
          id: "mock_id",
        },
      };
      beforeEach(async () => {
        await cut.createAssetPack(mockOptions as any);
      });

      it("creates the asset pack", () => {
        expect(assetPackDbMock.save).toHaveBeenCalled();
      });
    });
  });
});
