/* eslint-disable @typescript-eslint/no-explicit-any */
import AbstractModel from "../../types/AbstractModel";

type JestMock = { [index: string]: jest.Mock };
export type TypedJestMock<T extends Record<string, any>> = { [P in keyof T]: jest.Mock };

export const createJestMock = (funcs: string[], props?: { [index: string]: any }): JestMock => {
  const mock: JestMock = {};
  for (const func of funcs) {
    mock[func] = jest.fn();
  }

  if (props) {
    for (const key in props) {
      mock[key] = props[key];
    }
  }
  return mock;
};

export const createTypedMock = <T>(props: string[]): TypedJestMock<T> => {
  const mock: Partial<TypedJestMock<T>> = {};

  for (const prop of props) {
    mock[prop] = jest.fn();
  }

  return mock as TypedJestMock<T>;
};

export const createModelMock = (): TypedJestMock<AbstractModel<any, any>> => {
  const queryMock = { populate: jest.fn().mockImplementation(() => ({ lean: jest.fn() })) };
  const modelMock: TypedJestMock<AbstractModel<any, any>> = {
    all: jest.fn(),
    deleteById: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    save: jest.fn(),
    deleteByField: jest.fn(),
    queryByField: jest.fn().mockImplementation(() => queryMock),
    queryOne: jest.fn().mockImplementation(() => queryMock),
  };

  return modelMock;
};

export const createQueryMockReturn = (obj: JestMock) => {
  const queryResult = {
    populate: jest.fn().mockImplementation(() => ({ ...obj, lean: jest.fn().mockImplementation(() => obj) })),
    lean: jest.fn().mockImplementation(() => obj),
  };

  return queryResult;
};
