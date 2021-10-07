import User from "../models/User";
import { ROLES } from "../models/Role";

//email check 
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user)
      return res.status(400).json({ error: { message: "USER_EXIST" }});
    const email = await User.findOne({ email: req.body.email });
    if (email)
      return res.status(400).json({ error: { message: "EMAIL_EXIST" }});
    next();
  } catch (error) {
    res.status(500).json({ error: { message: error }});
  }
};

// check roles 
const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          error: { message: "INVALID_ROLE",
        }});
      }
    }
  }

  next();
};

export { checkDuplicateUsernameOrEmail, checkRolesExisted };
