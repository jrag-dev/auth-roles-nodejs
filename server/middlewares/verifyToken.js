import jsonwebtoken from "jsonwebtoken";



export const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({
      ok: false,
      message: "Access token is required"
    })
  }

  jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: "Access token invalid"
      })
    }

    req.user = decoded.user;

    return next();
  })
}