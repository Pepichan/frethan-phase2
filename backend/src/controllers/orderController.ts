import type { Request, Response } from "express";

export const listOrders = async (_req: Request, res: Response) => {
  res.status(501).json({ status: "not_implemented" });
};

export const getOrder = async (_req: Request, res: Response) => {
  res.status(501).json({ status: "not_implemented" });
};

export const createOrder = async (_req: Request, res: Response) => {
  res.status(501).json({ status: "not_implemented" });
};

export const updateOrder = async (_req: Request, res: Response) => {
  res.status(501).json({ status: "not_implemented" });
};
