import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";
import Role from "../models/Role";

export const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "TOKEN_DOESNT_EXIST" });

  try {
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ error: {message: "USER_NOT_FOUND" }});
    next();
  } catch (error) {
    return res.status(401).json({ error: {message: "UNAUNTHORIZED" }});
  }
};

export const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "mod") {
        next();
        return;
      }
    }

    return res.status(403).json({ error: {message: "MOD_ROLE_REQUIRED" }});
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: {message: error }});
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "adm") {
        next();
        return;
      }
    }

    return res.status(403).json({ error: {message: "ADM_ROLE_REQUIRED" }});
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};
