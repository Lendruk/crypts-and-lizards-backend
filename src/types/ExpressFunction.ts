import { NextFunction, Request, Response } from "express";

export type ExpressFunction = (req: Request, res: Response, next: NextFunction) => void;
