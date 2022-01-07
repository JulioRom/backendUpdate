import express from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

import pkg from "../package.json";

import productRoutes from "./routes/products.routes";
import usersRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import consRoutes from "./routes/consolidator.routes";
import reserves from "./routes/reserveInSlot.routes";
import slots from "./routes/Slots.routes";

import { createRoles, createAdmin, createTenSlots } from "./libs/initialSetup";

//Swagger
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Consolidador API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: [`${path.join(__dirname, "./routes/*.js")}`],
};

const app = express();
createRoles();
createAdmin();
createTenSlots();

// Settings
app.set("pkg", pkg);
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

// Middlewares
const corsOptions = {
  // origin: "http://localhost:3000",
};
app.use(compression());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

// Welcome Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Consolidator Sodimac",
    name: app.get("pkg").name,
    version: app.get("pkg").version,
    description: app.get("pkg").description,
    author: app.get("pkg").author,
  });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inProgress", consRoutes);
app.use("/api/reserveInSlot", reserves);
app.use("/api/slotInfo", slots);

export default app;
