import Role from "../models/roles.model.js";
import User from "../models/users.model.js";


import path from 'node:path';
import { fileURLToPath } from 'node:url';
import deleteFile from "../helpers/deleteFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Todo: Obtener todos los usuarios
const getUsers = async (req, res) => {
  let offset = req.query.offset;
  offset = Number(offset) || 0;

  let limit = req.query.limit;
  limit = Number(limit) || 2;

  try {
    const usersdb = await User.find({}).skip(offset).limit(limit).populate('roles').exec()

    res.status(200).json({
      ok: true,
      users: usersdb
    })
    
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "Error server"
    })
  }
}

// Todo: Obtener un user por su id
const getUserById = async (req, res) => {
  try {
    const userdb = await User.findById({ _id: req.params.id });

    if (!userdb) return res.status(404).json({ ok: false, message: "User not found"});

    res.status(200).json({ ok: true, user: userdb });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Error server" })
  }
}

// Todo: actualizar un usuario
const updateUser = async (req, res) => {
  if (req.body.password) {
    try {
      req.body.password = await User.encryptPassword(req.body.password)
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error updating password" })
    }
  }

  const newUser = {
    firstName: req.body.firstName || req.user.firstName,
    lastName: req.body.lastName || req.user.lastName,
    userName: req.body.userName || req.user.userName,
    email: req.body.email || req.user.email,
    password: req.body.password
  }

  if (req.body.roles) {
    const foundRoles = await Role.find({ name: {$in: req.body.roles }});
    newUser.roles = foundRoles.map( role => role._id )
  } else if (req.user.roles) {
    const rolesActuales = req.user.roles.map( role => role._id)
    newUser.roles = rolesActuales;
  } else {
    const role = await Role.findOne({ name: 'user' });
    newUser.roles = [role._id];
  }


  User.findOneAndUpdate({ _id: req.params.id }, 
    newUser, { new: true}, (err, user) => {
      if (err) {
        return res.status(500).json({ ok: false, message: "Error Server"})
      }

      res.status(200).json({
        ok: true,
        message: "User updated successfully"
      })
    }
  );
}

// Todo: Eliminar un usuario por id
const deleteUser = async (req, res) => {
  try {
    const userdb = await User.findById({ _id: req.params.id });
    if(!userdb) return res.status(404).json({ ok: false, message: "User not found" });

    const userDeleted = await userdb.deleteOne();

    res.status(200).json({ 
      ok: true, 
      message: "User deleted successfully",
      user: userDeleted
    })
  } catch (err) {
    res.status(500).json({ ok: false, message: "Error server" })
  }
}


// Todo: actualizar profile de un usuario
const updateProfile = async (req, res) => {

  if (req.user._id === req.params.id) {

    let userdb = await User.findById({ _id: req.params.id });
    if (!userdb) return res.status(404).json({ ok: false, message: "User not found" });
  
    if (req.body.password) {
      try {
        req.body.password = await User.encryptPassword(req.body.password)
      } catch (err) {
        return res.status(500).json({ ok: false, message: "Server error updating password" })
      }
    }
  
    let update = {
      firstName: req.body.firstName || req.user.firstName,
      lastName: req.body.lastName || req.user.lastName,
      userName: req.body.userName || req.user.userName,
      email: req.body.email || req.user.email,
      password: req.body.password
    }

    const rolesActuales = req.user.roles.map( role => role._id)
    update.roles = rolesActuales;

    // verificar si viene una imagen
    if (req.file) {
      update.imgURL = req.file.filename;
    } else {
      update.imgURL = userdb.imgURL;
    }    

    const userUpdate = await userdb.updateOne({ $set: update })

    if (userUpdate.modifiedCount === 1 && userdb.imgURL) {
      const url = req.baseUrl.split('/')[2];
      const dirname = path.join(__dirname, `../../uploads/${url}`)
      deleteFile(dirname, userdb.imgURL)
    }
    

    res.status(200).json({
      ok: true,
      message: "User profile updated successfully",
      product: userUpdate
    })

  } else {
    return res.status(404).json({ ok: false, message: "You can only update your profile"})
  }
}

export {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile
}