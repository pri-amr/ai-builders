import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import moneySourcesRouter from "./routes/moneySources";
import categoriesRouter from "./routes/categories";

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/money-sources", moneySourcesRouter);
app.use("/api/categories", categoriesRouter);

export default app;
