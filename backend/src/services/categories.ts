import Category from "../models/Category";
import { PREDEFINED_CATEGORIES } from "../constants/categories";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 200;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function seedPredefinedCategories(
  userId: string,
  options: { retryDelayMs?: number } = {}
): Promise<void> {
  const retryDelayMs = options.retryDelayMs ?? RETRY_DELAY_MS;
  const categories = PREDEFINED_CATEGORIES.map((name) => ({ userId, name }));

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await Category.insertMany(categories);
      return;
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) {
        console.error(
          `No se pudieron sembrar las categorías predefinidas para el usuario ${userId} luego de ${MAX_ATTEMPTS} intentos`,
          error
        );
        return;
      }
      await wait(retryDelayMs);
    }
  }
}
