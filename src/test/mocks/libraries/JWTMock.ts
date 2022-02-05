import { createTypedMock, TypedJestMock } from "../../utils/testUtils";
import jwt from "jsonwebtoken";

export const createJWTMock = () => {
  const jwtMock: TypedJestMock<typeof jwt> = createTypedMock<typeof jwt>(["sign", "verify"]);
  return jwtMock;
};
