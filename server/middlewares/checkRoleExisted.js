import {ROLES} from '../models/users.model.js'

export const checkRoleExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          ok: false,
          message: `Role ${req.body.roles[i]} does not exists`
        })
      }
    }
  }
  next()
}