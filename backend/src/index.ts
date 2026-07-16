import "dotenv/config";
import app from "./app";
import { connectDB } from "./db";

const PORT = process.env.PORT ?? 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI no está definida en el entorno");
}

connectDB(MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB", error);
    process.exit(1);
  });
