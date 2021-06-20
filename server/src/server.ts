import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import userRouter from "./router/users";
import { handleError } from "./error";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "..", "..", "client/build")));
app.use(express.static("public"));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "..", "client/build/index.html"));
});

// User router for all upload functions
app.use("/users", userRouter);

// Handle all errors with this handler
app.use(handleError);

app.listen(PORT, () => {
  console.log(`====== Server is running on http://localhost:${PORT} ======`);
});
