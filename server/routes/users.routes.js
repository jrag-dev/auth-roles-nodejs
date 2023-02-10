import { Router } from "express";
import { deleteUser, getUserById, getUsers, updateProfile, updateUser } from "../controllers/users.controller.js";

import { verifyToken } from '../middlewares/verifyToken.js'
import { verifyRoleAdmin } from '../middlewares/verifyRole.js'
import { subirArchivo } from "../middlewares/uploadFile.js";
import { checkRoleExisted } from "../middlewares/checkRoleExisted.js";

const routerUsers = Router();


routerUsers.get('/', verifyToken, getUsers)
routerUsers.get('/:id', verifyToken, getUserById)
routerUsers.put('/:id', [verifyToken, verifyRoleAdmin ], updateUser)
routerUsers.delete('/:id', [verifyToken, verifyRoleAdmin ], deleteUser)
routerUsers.put('/profile/:id', [verifyToken, checkRoleExisted, subirArchivo], updateProfile)


export default routerUsers;