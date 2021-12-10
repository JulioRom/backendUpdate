import Role from "../models/Role";
import User from "../models/User";

import bcrypt from "bcryptjs";
import Slot from "../models/Slot";

const nodeID = [
  {
    0: {
      assigned: "ns=1;s=S7-TEST.Flags.S1_ASSIGNED_BL",
      complete: "ns=1;s=S7-TEST.Flags.S1_COMPLETE_BL",
      takeout: "ns=1;s=S7-TEST.Flags.S1_TAKEOUT",
      remove: "ns=1;s=S7-TEST.Flags.S1_REMOVE",
    },
  },
  {
    1: {
      assigned: "ns=1;s=S7-TEST.Flags.S2_ASSIGNED_BL",
      complete: "ns=1;s=S7-TEST.Flags.S2_COMPLETE_BL",
      takeout: "ns=1;s=S7-TEST.Flags.S2_TAKEOUT",
      remove: "ns=1;s=S7-TEST.Flags.S2_REMOVE",
    },
  },
  {
    2: {
      assigned: "ns=1;s=S7-TEST.Flags.S3_ASSIGNED_BL",
      complete: "ns=1;s=S7-TEST.Flags.S3_COMPLETE_BL",
      takeout: "ns=1;s=S7-TEST.Flags.S3_TAKEOUT",
      remove: "ns=1;s=S7-TEST.Flags.S3_REMOVE",
    },
  },
  {
    3: {
      assigned: "ns=1;s=S7-TEST.Flags.S4_ASSIGNED_BL",
      complete: "ns=1;s=S7-TEST.Flags.S4_COMPLETE_BL",
      takeout: "ns=1;s=S7-TEST.Flags.S4_TAKEOUT",
      remove: "ns=1;s=S7-TEST.Flags.S4_REMOVE",
    },
  },
  {
    4: {
      assigned: "ns=1;s=S7-TEST.Flags.S5_ASSIGNED_BL",
      complete: "ns=1;s=S7-TEST.Flags.S5_COMPLETE_BL",
      takeout: "ns=1;s=S7-TEST.Flags.S5_TAKEOUT",
      remove: "ns=1;s=S7-TEST.Flags.S5_REMOVE",
    },
  },
  {
    5: {
      assigned: "ns=1;s=S7-TEST.Flags.S6_ASSIGNED_BL",
      complete: "ns=1;s=S7-TEST.Flags.S6_COMPLETE_BL",
      takeout: "ns=1;s=S7-TEST.Flags.S6_TAKEOUT",
      remove: "ns=1;s=S7-TEST.Flags.S6_REMOVE",
    },
  },
];

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
    console.log("Admin User Created!");
  }
};

export const createTenSlots = async (req, res) => {
  try {
    // Count Documents
    const count = await Slot.estimatedDocumentCount();

    // check for existing slots
    if (count > 0) return;

    for (let index = 0; index < 6; index++) {
      const array = nodeID[index];
      const nodos = array[index];
      const value = [nodos.assigned, nodos.complete, nodos.takeout, nodos.remove];

      console.log(nodos);

      const newSlot = new Slot({
        slot: index,
        reserve: "",
        lpnAssociates: [],
        nodes: value,
      });
      const slotSaved = await newSlot.save();
    }
    console.log("Ten slots created");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
