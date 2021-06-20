import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import userRouter from "./router/users";
import { handleError } from "./error";
import { db } from "./database/database";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

// User router for all upload functions
app.use("/users", userRouter);

// Handle all errors with this handler
app.use(handleError);

app.listen(PORT, () => {
  console.log(`====== Server is running on http://localhost:${PORT} ======`);
});
