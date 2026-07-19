import { Router } from "express";
import { Types } from "mongoose";
import Transaction from "../models/Transaction";
import MoneySource from "../models/MoneySource";
import Category from "../models/Category";
import { requireAuth } from "../middleware/auth";
import { parseDDMMYYYY, formatDDMMYYYY } from "../utils/date";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const { type, amount, moneySourceId, currency, categoryId, date, description } =
    req.body ?? {};
  const userId = req.userId;

  if (type !== "income" && type !== "expense") {
    return res
      .status(400)
      .json({ error: "El tipo de transacción es obligatorio (income o expense)" });
  }

  if (amount === undefined || amount === null || amount === "") {
    return res.status(400).json({ error: "El monto es obligatorio" });
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) {
    return res.status(400).json({ error: "El monto debe ser un número válido" });
  }
  if (numericAmount <= 0) {
    return res
      .status(400)
      .json({ error: "El monto debe ser mayor a cero" });
  }

  if (typeof moneySourceId !== "string" || !moneySourceId.trim()) {
    return res
      .status(400)
      .json({ error: "La fuente de dinero es obligatoria" });
  }

  if (currency !== "ARS" && currency !== "USD") {
    return res.status(400).json({ error: "La moneda es obligatoria" });
  }

  if (typeof categoryId !== "string" || !categoryId.trim()) {
    return res.status(400).json({ error: "La categoría es obligatoria" });
  }

  if (typeof date !== "string" || !date.trim()) {
    return res.status(400).json({ error: "La fecha es obligatoria" });
  }

  const parsedDate = parseDDMMYYYY(date.trim());
  if (!parsedDate) {
    return res
      .status(400)
      .json({ error: "La fecha debe tener el formato DD-MM-YYYY" });
  }

  if (typeof description !== "string" || !description.trim()) {
    return res.status(400).json({ error: "La descripción es obligatoria" });
  }

  try {
    if (!Types.ObjectId.isValid(moneySourceId)) {
      return res
        .status(400)
        .json({ error: "La fuente de dinero no existe" });
    }

    const moneySource = await MoneySource.findOne({
      _id: moneySourceId,
      userId,
    });
    if (!moneySource) {
      return res
        .status(400)
        .json({ error: "La fuente de dinero no existe" });
    }

    if (!Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "La categoría no existe" });
    }

    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      return res.status(400).json({ error: "La categoría no existe" });
    }

    const transaction = await Transaction.create({
      userId,
      type,
      amount: numericAmount,
      moneySourceId,
      currency,
      categoryId,
      date: parsedDate,
      description: description.trim(),
    });

    return res.status(201).json({
      id: transaction._id,
      type: transaction.type,
      amount: transaction.amount,
      moneySourceId: transaction.moneySourceId,
      currency: transaction.currency,
      categoryId: transaction.categoryId,
      date: formatDDMMYYYY(transaction.date),
      description: transaction.description,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo guardar la transacción" });
  }
});

export default router;
