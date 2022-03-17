import { MapTemplateCollection } from "../models/MapTemplate";
import { createModelMock, TypedJestMock } from "../test/utils/testUtils";
import MapService from "./MapService";

describe("MapService", () => {
  let cut: MapService;
  let mapTemplateCollection: TypedJestMock<MapTemplateCollection>;
  let objectIdFactoryMock: jest.Mock;

  const MOCK_ID = "MOCK_ID";
  const MOCK_UPDATE_PAYLOAD = { title: "MOCK", description: "MOCK_2" };

  beforeEach(() => {
    mapTemplateCollection = createModelMock();
    objectIdFactoryMock = jest.fn();
    cut = new MapService(mapTemplateCollection as any, objectIdFactoryMock as any);
  });

  describe("updateMap", () => {
    beforeEach(async () => {
      await cut.updateTemplate(MOCK_ID as any, MOCK_UPDATE_PAYLOAD);
    });

    it("updates the map collection", () => {
      expect(mapTemplateCollection.findOneAndUpdate).toHaveBeenCalledWith({ _id: MOCK_ID }, MOCK_UPDATE_PAYLOAD);
    });
  });
});
