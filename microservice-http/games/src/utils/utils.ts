import { PrismaClient } from "@prisma/client";
import { Response } from "express";

export const prisma = new PrismaClient();

export const responseHandler = (
  res: Response,
  status: boolean,
  message: string,
  data?: any,
  error?: unknown
) => {
  if (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  } else {
    res.status(200).json({ status, message, data });
  }
};
