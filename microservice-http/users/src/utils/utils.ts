import { PrismaClient } from "@prisma/client";
import { Response } from "express";

export const prisma = new PrismaClient();

export const responseHandler = (
  res: Response,
  status: boolean,
  message: string,
  data?: Record<string, any>,
  error?: unknown
) => {
  if (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  } else {
    res.status(200).json({ status, message, data });
  }
};

export const createRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
