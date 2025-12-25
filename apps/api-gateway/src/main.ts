/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import axios from "axios";
import cookieParser from "cookie-parser";

import * as path from "path";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json({ limit: "100mb" })); // Body limit is 10
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.set("trust proxy", 1); // Trust first proxy

// Swagger setup
const swaggerDocumentUrl = "http://localhost:6000/api-docs-json";
axios
  .get(swaggerDocumentUrl)
  .then((response) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(response.data));
  })
  .catch((error) => {
    console.error("Error fetching Swagger document:", error);
  });

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
