import Product from "../models/Product";

//reserve check 
const checkDuplicateReserve = async (req, res, next) => {
  try {
    const reserve = await Product.findOne({ reserve: req.body.reserve });
    if (reserve)
      return res.status(400).json({ error: { message: "RESERVE_ALREADY_EXIST" }});
    next();
  } catch (error) {
    res.status(500).json({ error: { message: error }});
  }
};

const checkLpnExist = async (req, res, next) => {
  try {
    if (!req.body.lpnAssociates)
      return res.status(400).json({ error: { message: "Need at least one LPN" }});
    if (req.body.lpnAssociates[0] == String)
      return res.status(400).json({ error: { message: "error type of data" + typeof(req.body.lpnAssociates[0]) }});
    next();
  } catch (error) {
    res.status(500).json({ error: { message: error }});
  }
};


export { checkDuplicateReserve, checkLpnExist };
