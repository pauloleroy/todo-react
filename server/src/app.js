import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import bodyParserMiddleware from "./middlewares/bodyparser.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(morgan("dev")); // log básico no console

// Middleware de body parser (global)
bodyParserMiddleware(app);

// Rotas
app.use("/api", routes);

// Middleware global de erros
app.use(errorHandler);

export default app;
