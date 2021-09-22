import Product from "../models/Product";

//reserve check 
const checkDuplicateReserve = async (req, res, next) => {
  try {
    const reserve = await Product.findOne({ reserve: req.body.reserve });
    if (reserve)
      return res.status(400).json({ message: "The reserve already exists" });
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const checkLpnExist = async (req, res, next) => {
  try {
    if (!req.body.lpnAssociates)
      return res.status(400).json({ message: "Need at least one LPN" });
    if (req.body.lpnAssociates[0] == String)
      return res.status(400).json({ message: "error type of data" + typeof(req.body.lpnAssociates[0]) });
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};


export { checkDuplicateReserve, checkLpnExist };
