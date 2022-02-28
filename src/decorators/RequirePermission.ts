import { NextFunction, Response } from "express";
import app from "../App";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { Role } from "../models/Role";
import PermissionService from "../services/PermissionService";
import { ExpressRequest } from "../types/ExpressRequest";
import { verifyToken } from "./RequireAuth";
import { getOrCreateMiddleware } from "./utils";

export const verifyPermissions =
  (options: RequirePermissionOptions) =>
  async (req: ExpressRequest, _: Response, next: NextFunction): Promise<void> => {
    const {
      user,
      params: { id },
    } = req;
    const obtainedPermissions: string[] = [];

    // get the permission
    const permissionService = app.container.getNamed<PermissionService>(PermissionService, "PermissionService");
    const { optional, mandatory } = options;

    if (id) {
      const rolePair = user.roles.find((rolePair) => rolePair.entity.toString() == id);
      if (rolePair) {
        const role = rolePair.role as Role;
        if (mandatory) {
          for (const permission of mandatory) {
            for (const group of role.groups) {
              if (await permissionService.groupContainsPermission(group, permission)) {
                obtainedPermissions.push(permission);
              } else {
                throw new ServerException(Errors.AUTH.NO_PERMISSION);
              }
            }
          }
        }
        if (optional) {
          for (const permission of optional) {
            for (const group of role.groups) {
              if (await permissionService.groupContainsPermission(group, permission)) {
                obtainedPermissions.push(permission);
              }
            }
          }
        }
      } else {
        throw new ServerException(Errors.AUTH.NO_PERMISSION);
      }
    }

    req.currentPermissions = obtainedPermissions;
    next();
  };

type RequirePermissionOptions = { mandatory?: string[]; optional?: string[] };
export const RequirePermission = (options: RequirePermissionOptions): MethodDecorator => {
  return (target, propertyKey: string | symbol): void => {
    // const path = Reflect.getMetadata("baseRoute", target);
    const middleware = getOrCreateMiddleware(target);
    middleware.set(propertyKey as string, [verifyToken, verifyPermissions(options)]);
  };
};
