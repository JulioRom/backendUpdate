import Role from "../models/Role";
import User from "../models/User";

import bcrypt from "bcryptjs";
import Slot from "../models/Slot";


export const createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing roles
    if (count > 0) return;

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "op" }).save(),
      new Role({ name: "mod" }).save(),
      new Role({ name: "adm" }).save(),
    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
};

export const createAdmin = async () => {
  // check for an existing admin user
  const user = await User.findOne({ email: "admin@localhost" });
  // get roles _id
  const roles = await Role.find({ name: { $in: ["adm", "mod"] } });

  if (!user) {
    // create a new admin user
    await User.create({
      username: "admin",
      email: "admin@localhost",
      password: await bcrypt.hash("admin", 10),
      roles: roles.map((role) => role._id),
    });
    console.log('Admin User Created!')
  }
};

export const createTenSlots = async (req, res) => {
  try {
    // Count Documents
    const count = await Slot.estimatedDocumentCount();

    // check for existing slots
    if (count > 0) return;

    for (let index = 0; index < 10; index++) 
    {
      const newSlot = new Slot({
        slot: index,
        reserve:"",
        lpnAssociates:[]
      });
      const slotSaved = await newSlot.save();
      
    };
    console.log('Ten slots created');
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
