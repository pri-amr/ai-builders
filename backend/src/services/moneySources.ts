import MoneySource from "../models/MoneySource";
import { PREDEFINED_MONEY_SOURCES } from "../constants/moneySources";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 200;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function seedPredefinedMoneySources(
  userId: string,
  options: { retryDelayMs?: number } = {}
): Promise<void> {
  const retryDelayMs = options.retryDelayMs ?? RETRY_DELAY_MS;
  const sources = PREDEFINED_MONEY_SOURCES.map((name) => ({ userId, name }));

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await MoneySource.insertMany(sources);
      return;
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) {
        console.error(
          `No se pudieron sembrar las fuentes predefinidas para el usuario ${userId} luego de ${MAX_ATTEMPTS} intentos`,
          error
        );
        return;
      }
      await wait(retryDelayMs);
    }
  }
}
