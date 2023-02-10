import * as authCtrl from "../controllers/auth.controller.js";

import { Router } from "express";
import { checkRoleExisted } from "../middlewares/checkRoleExisted.js";


const routerAuth = Router();


routerAuth.post("/signin", authCtrl.signinUser)
routerAuth.post("/signup", checkRoleExisted, authCtrl.signupUser)


export default routerAuth;