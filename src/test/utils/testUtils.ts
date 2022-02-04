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

export const createModelMock = (): TypedJestMock<AbstractModel<any, any>> => {
  const modelMock: TypedJestMock<AbstractModel<any, any>> = {
    all: jest.fn(),
    deleteOne: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    save: jest.fn(),
  };

  return modelMock;
};
