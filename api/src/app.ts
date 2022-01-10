import express from "express";
import config from "config";
import cors from "cors";
import connect from "./utils/connect";
import logger from "./utils/logger"
import routes from "./routes/recipes.routes"
import { json } from "body-parser";

const port = config.get<number>("port");

const app = express();
app.use(cors());

logger.info(port)

app.use(json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  routes(app);
});
