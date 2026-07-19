import { Router } from "express";
import MoneySource from "../models/MoneySource";
import { requireAuth } from "../middleware/auth";

const router = Router();

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.post("/", requireAuth, async (req, res) => {
  const { name } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  const trimmedName = name.trim();
  const userId = req.userId;

  try {
    const existing = await MoneySource.findOne({
      userId,
      name: new RegExp(`^${escapeRegExp(trimmedName)}$`, "i"),
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Ya existe una fuente de dinero con ese nombre" });
    }

    const moneySource = await MoneySource.create({
      userId,
      name: trimmedName,
    });

    return res
      .status(201)
      .json({ id: moneySource._id, name: moneySource.name });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo crear la fuente de dinero" });
  }
});

export default router;
