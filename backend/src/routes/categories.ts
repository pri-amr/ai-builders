import { Router } from "express";
import Category from "../models/Category";
import { requireAuth } from "../middleware/auth";

const router = Router();

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.userId }).sort({
      name: 1,
    });

    return res.status(200).json(
      categories.map((category) => ({
        id: category._id,
        name: category.name,
      }))
    );
  } catch (error) {
    return res.status(500).json({ error: "No se pudieron obtener las categorías" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { name } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  const trimmedName = name.trim();
  const userId = req.userId;

  try {
    const existing = await Category.findOne({
      userId,
      name: new RegExp(`^${escapeRegExp(trimmedName)}$`, "i"),
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Ya existe una categoría con ese nombre" });
    }

    const category = await Category.create({ userId, name: trimmedName });

    return res.status(201).json({ id: category._id, name: category.name });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo crear la categoría" });
  }
});

export default router;
