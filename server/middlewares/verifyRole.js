import Role from "../models/roles.model.js";

export const verifyRoleAdmin = async (req, res, next) => {
  const user = req.user;
  const roles = await Role.find({ _id: { $in: user.roles }})

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      return next();
    } 
  }
  return res.status(403).json({
    ok: false,
    message: "Require Admin role"
  })
}



export const verifyRoleEmployeer = async (req, res, next) => {
  const user = req.user;
  const roles = await Role.find({ _id: { $in: user.roles }})

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "employeer") {
      return next();
    } 
  }
  return res.status(403).json({
    ok: false,
    message: "Require Employeer role"
  })
}