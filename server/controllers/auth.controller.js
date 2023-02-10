import User from '../models/users.model.js';
import Role from '../models/roles.model.js'

import jsonwebtoken from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'


// Todo: Registro de Usuario
const signupUser = async (req, res) => {
  try {
    const userdb = await User.findOne({ email: req.body.email });

    if(userdb) {
      return res.status(400).json({
        ok: false,
        message: "The user is already registered"
      })
    }

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: await User.encryptPassword(req.body.password)
    })

    if (req.body.roles) {
      const foundRoles = await Role.find({ name: {$in: req.body.roles }});
      newUser.roles = foundRoles.map( role => role._id )
    } else {
      const role = await Role.findOne({ name: 'user' });
      newUser.roles = [role._id];
    }

    const user = await newUser.save();

    const token = jsonwebtoken.sign(
      {
        user: user
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRE_IN_TOKEN
      }
    )

    res.status(201).json({
      ok: true,
      message: "User created successfully",
      user: user,
      token: token
    })

    
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'Error Server'
    })
  }
}


// Todo: Inicio de Sesión
const signinUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userdb = await User.findOne({ email: email }).populate('roles');

    if (!userdb) {
      return res.status(404).json({
        ok: false,
        message: 'User not found'
      })
    }

    // const verifyPassword = bcryptjs.compareSync(password, userdb.password);
    const verifyPassword = await User.comparePassword(password, userdb.password);
    
    if (!verifyPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Password/email incorrect'
      })
    }

    const token = jsonwebtoken.sign(
      {
        user: userdb
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRE_IN_TOKEN
      }
    )

    res.status(200).json({
      ok: true,
      message: "User loggin successfully",
      user: userdb,
      token: token
    })

  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'Error Server'
    })
  }
}

export {
  signupUser,
  signinUser
}