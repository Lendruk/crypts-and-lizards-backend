import { AssetPackCollection } from "../models/Assets/AssetPack";
import { ResourceTemplateCollection } from "../models/Assets/ResourceTemplate";
import { TagCollection } from "../models/Tag";
import { User } from "../models/User";
import { createModelMock, createQueryMockReturn, createTypedMock, TypedJestMock } from "../test/utils/testUtils";
import AssetService from "./AssetService";
import PermissionService from "./PermissionService";
import RoleService from "./RoleService";

describe("AssetService", () => {
  let cut: AssetService;
  let assetPackDbMock: TypedJestMock<AssetPackCollection>;
  let resourceTemplateCollectionMock: TypedJestMock<ResourceTemplateCollection>;
  let roleServiceMock: TypedJestMock<RoleService>;
  let permissionServiceMock: TypedJestMock<PermissionService>;
  let tagCollectionMock: TypedJestMock<TagCollection>;
  let objectIdFactoryMock: jest.Mock;

  const MOCK_USER: User = {
    email: "mock_email",
    password: "mock_password",
    usedAssets: { assetPacks: [] },
    username: "mock_username",
    id: "mock_id",
    roles: [],
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
    tagCollectionMock = createModelMock();
    roleServiceMock = createTypedMock(["createRole"]);
    permissionServiceMock = createTypedMock(["createPermissionGroup"]);
    resourceTemplateCollectionMock = createModelMock();
    cut = new AssetService(
      assetPackDbMock as any,
      resourceTemplateCollectionMock as any,
      objectIdFactoryMock as any,
      roleServiceMock as any,
      permissionServiceMock as any,
      tagCollectionMock as any
    );
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
