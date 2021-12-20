import Slot from "../../models/Slot";
import { reader, allocator } from "../opcua.controller/opcua.controller.mjs";

// ALL THE RESERVES IN SLOTS
export const reserves = async (req, res, next) => {
  const reserves = await Slot.find({ reserve: { $ne: "" } });

  if (!reserves.length)
    return res.status(404).json({
      error: {
        message: "SYSTEM_WITHOUT_RESERVES",
      },
    });
  try {
    return res.status(200).json(reserves);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////

// TAKE OUT FUNCTION
export const slotsTakeOut = async (req, res, next) => {
  const { reserves } = req.body;

  //console.log(!reserves.length);
  if (!reserves.length)
    return res.status(404).json({
      error: {
        message: "NEED_AT_LEAST_ONE_RESERVE",
      },
    });
  try {
    //console.log("length :" + reserves.length);
    if (reserves.length > 1) {
      const notFound = [];
      const resOn = [];
      for (let index = 0; index < reserves.length; index++) {
        let oneReserve = reserves[index];
        let slotObj = await Slot.find({ reserve: oneReserve });
        if (slotObj.length === 0) {
          notFound.push(oneReserve);
          continue;
        } else {
          resOn.push(oneReserve);
          console.log("node take out activated: " + slotObj[0].nodes[2]);
          await allocator(slotObj[0].nodes[2]);
        }
      }
      return res
        .status(200)
        .json({reservesInSlots:{
          takeOutON: `${resOn}`,
          reserveNotFound: `${notFound}`,
        }}
          //`reserves in slots: take out ON: ${resOn} \n reserves not foudn: ${notFound}`
        );
    } else {
      let slotObj = await Slot.find({ reserve: reserves[0] });
      //console.log(!slotObj);
      if (slotObj.length === 0) {x
        return res.status(400).json({
          error: {
            message: "RESERVE_NOT_FOUND",
          },
        });
      }
      //console.log("obj slot :" + slotObj);
      //console.log("nodes :" + slotObj[0].nodes[2]);
      await allocator(slotObj[0].nodes[2]);
      return res.status(200).json({reservesInSlots:{
        takeOutON: `${slotObj[0].reserve}`,
        reserveNotFound: ""}});
      }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
