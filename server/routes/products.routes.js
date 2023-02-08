import { Router } from "express";
import * as productCtrl from "../controllers/products.controller.js";
import { subirArchivo } from "../middlewares/uploadFile.js";


const routerProducts = Router();


routerProducts.get("/", productCtrl.getProducts)

routerProducts.post("/", subirArchivo, productCtrl.createProduct)

routerProducts.get("/:id", productCtrl.getProduct)

routerProducts.put("/:id", subirArchivo, productCtrl.updateProduct)

routerProducts.delete("/:id", productCtrl.deleteProduct)


export default routerProducts;