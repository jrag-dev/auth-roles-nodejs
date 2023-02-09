import { Router } from "express";
import * as productCtrl from "../controllers/products.controller.js";
import { subirArchivo } from "../middlewares/uploadFile.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRoleAdmin } from "../middlewares/verifyRole.js";


const routerProducts = Router();


routerProducts.get("/", verifyToken, productCtrl.getProducts)

routerProducts.post("/", [ verifyToken, verifyRoleAdmin ], subirArchivo, productCtrl.createProduct)

routerProducts.get("/:id", productCtrl.getProduct)

routerProducts.put("/:id", [ verifyToken, verifyRoleAdmin ], subirArchivo, productCtrl.updateProduct)

routerProducts.delete("/:id", [ verifyToken, verifyRoleAdmin ], productCtrl.deleteProduct)


export default routerProducts;