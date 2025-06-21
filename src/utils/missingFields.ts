import { Response, Request, NextFunction } from "express";

export default function missingFields(
  req: Request,
  res: Response,
  required: string[]
) {
  if (!req.body) {
    res.status(400).json({ message: "Request body is missing" });
    return true;
  }

  const missingFields = required.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    res.status(400).json({
      message: "Missing required fields",
      missingFields: missingFields,
    });
    return true;
  } else {
    return false;
  }
}
