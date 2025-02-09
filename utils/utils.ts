import { Response } from "express";

export const responseHandler = (
  res: Response,
  status: boolean,
  message: string,
  data?: Record<string, any>,
  error?: unknown
) => {
  if (error) {
    console.error(error);
    res.status(200).json({ status: false, message: "Internal Server Error" });
  } else {
    res.status(500).json({ status, message, data });
  }
};
