import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Data input tidak valid",
            details: error.errors.map((err) => ({
              field: err.path.slice(1).join("."), // slice(1) removes the outer category (e.g. 'body')
              message: err.message,
            })),
          },
        });
      }
      return next(error);
    }
  };
};
