import User from "../models/User";
import Role from "../models/Role";

import jwt from "jsonwebtoken";
import config from "../config";

// SIGNUP AUTH CONTROLER:
export const signUp = async (req, res) => {
  try {
    // Getting the Request Body
    const { username, email, password, roles } = req.body;
    // Creating a new User Object , not saved yet
    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
    });
    // checking for roles
    if (!req.body.roles.length) {
      const role = await Role.findOne({
        name: "op",
      });
      newUser.roles = [role._id];
    } else {
      const foundRoles = await Role.find({
        name: {
          $in: roles,
        },
      });
      newUser.roles = foundRoles.map((role) => role._id);
    }

    // Saving the User Object in Mongodb
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      config.SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    return res.status(200).json({
      token,
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// SIGNIN AUTH CONTROLLER
export const signIn = async (req, res) => {
  try {
    // Request body username can be an username or username
    const userFound = await User.findOne({
      username: req.body.user,
      //email: req.body.email
    }).populate("roles");

    if (!userFound)
      return res.status(400).json({
        error: {
        message: "USER_NOT_FOUND",
      }});

    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res.status(401).json({
        error: {
        message: "INVALID_PASSWORD"
      }});

    const expiresIn = 86400;  // 24 hours
    const token = jwt.sign(
      {
        id: userFound._id,
      },
      config.SECRET,
      {
        expiresIn 
      }
    );
    const username = userFound.username;

    res.json({
      token,
      username,
      expiresIn
    });
  } catch (error) {
    console.log(error);
  }
};
