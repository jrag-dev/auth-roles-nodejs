import * as authCtrl from "../controllers/auth.controller.js";

import { Router } from "express";


const routerAuth = Router();


routerAuth.post("/signin", authCtrl.signinUser)
routerAuth.post("/signup", authCtrl.signupUser)


export default routerAuth;