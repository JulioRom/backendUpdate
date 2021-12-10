import Slot from "../../models/Slot";
import { reader, allocator } from "../opcua.controller/opcua.controller.mjs";

// Reserve filter midddleware
export const reserves = async (req, res, next) => {
  const reserves = await Slot.find({ reserve: { $ne: "" } });

  if (!reserves)
    return res.status(404).json({
      error: {
        message: "SYSTEM_WITHOUT_RESERVES",
      },
    });
  try {
    return res.json(reserves);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////

// Reserve filter midddleware
export const slotsTakeOut = async (req, res, next) => {
  const {
    reserves,
  } = req.body;

  if (!reserves)
    return res.status(404).json({
      error: {
        message: "NEED_AT_LEAST_ONE_RESERVE",
      },
    });
  try {
    console.log(reserves.length);
    if(reserves.length > 1){
      for (let index = 0; index < reserves.length; index++) {
        let oneReserve = reserves[index];
        let slotObj = await Slot.find({ reserve: oneReserve });
        await allocator(slotObj.nodes[3]);
        
      }
    } else {
        let slotObj = await Slot.find({ reserve: reserves[0] });
        console.log(slotObj);
        //await allocator(slotObj.nodes[3]);
        return res.json(slotObj);
    }
    
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
