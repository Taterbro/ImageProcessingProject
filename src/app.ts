import * as dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), `${__dirname}/.env`);
dotenv.config({ path: envPath });

import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 3000;
const mongo =
  "mongodb+srv://veecipher:YXqia9Jflej5bzBY@cluster0.zdnopbg.mongodb.net/ImageProcessorDB?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongo)
  .then(() =>
    app.listen(port, () => {
      console.log("Server is live on port:", port);
    })
  )
  .catch((err) => console.log(err));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to parse form data
app.use(
  cors({
    origin: ["http://localhost:8080"],
    credentials: true,
  })
);
