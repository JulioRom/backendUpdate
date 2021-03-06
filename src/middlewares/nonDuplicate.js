import Product from "../models/Product";

//reserve check
const checkDuplicateReserve = async (req, res, next) => {
  try {
    const reserve = await Product.findOne({ reserve: req.body.reserve });
    if (reserve)
      return res
        .status(400)
        .json({ error: { message: "RESERVE_ALREADY_EXIST" } });
    next();
  } catch (error) {
    res.status(500).json({ error: { message: error } });
  }
};

//check if the lpns atribute is empty and if not, check if is a string  
const checkLpn = async (req, res, next) => {
  try {
    if (!req.body.lpnAssociates.length)
      return res.status(400).json({ error: { message: "CANNOT_BE_EMPTY" } });
    for (let i = 0; i < req.body.lpnAssociates.length; i++) {
      let isString = typeof req.body.lpnAssociates[i] === "string";
      if (!isString)
        return res.status(400).json({ error: { message: "MUST_BE_A_STRING" } });
    }
    next();
  } catch (e) {
    res.status(500).json({ error: { message: `${e}` } });
  }
};

export { checkDuplicateReserve, checkLpn };
