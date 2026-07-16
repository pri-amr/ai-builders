import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_COST = 12;

router.post("/register", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    return res
      .status(400)
      .json({ error: "Email y password son obligatorios" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ error: "El email no tiene un formato válido" });
  }

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Ya existe una cuenta con ese email" });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const user = await User.create({ email: normalizedEmail, passwordHash });

    return res.status(201).json({ id: user._id, email: user.email });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo registrar el usuario" });
  }
});

export default router;
