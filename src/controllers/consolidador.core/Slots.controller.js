import Slot from "../../models/Slot";

// ALL THE slots IN SLOTS
export const slots = async (req, res, next) => {
  const slots = await Slot.find();
  if (!slots.length)
    return res.status(404).json({
      error: {
        message: "SYSTEM_WITHOUT_SLOTS",
      },
    });
  try {
    const filterSlots = [];
    for (let index = 0; index < slots.length; index++) {
      const slot = slots[index];
      const slotF = {
        slotId: slot.slot,
        reserve: slot.reserve,
        lpns: slot.lpnAssociates,
      }
      filterSlots.push(slotF)
    }
    return res.status(200).json(filterSlots);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////

