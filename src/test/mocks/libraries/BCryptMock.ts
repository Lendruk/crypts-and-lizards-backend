import { createTypedMock, TypedJestMock } from "../../utils/testUtils";
import * as BCrypt from "bcryptjs";

export const createBCryptMock = () => {
  const bCryptMock: TypedJestMock<typeof BCrypt> = createTypedMock<typeof BCrypt>(["compare", "genSalt", "hash"]);
  return bCryptMock;
};
