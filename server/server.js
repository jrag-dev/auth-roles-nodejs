import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";


import pkg from "../package.json";
import routerProducts from "./routes/products.routes.js";
import dbConnect from "./database/db.js";

const app = express();
app.set('pkg', pkg)

// conexión a mongo
dbConnect()


// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(helmet())
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: app.get('pkg').name,
    author: app.get('pkg').author,
    version: "1.0.0",
    description: app.get('pkg').description
  })
})

// rutas de la api
app.use("/api/products", routerProducts)

const port = process.env.PORT || 4005;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});