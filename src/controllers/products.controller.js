import Product from "../models/Product";

// Create the reserve object with lpn associates
export const createProduct = async (req, res) => {
  const { reserve, lpnAssociates, reserveStatus } = req.body;

  try {
    const newProduct = new Product({
      reserve,
      lpnAssociates,
      reserveStatus,
    });

    const productSaved = await newProduct.save();

    res.status(201).json(productSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
// Get reserve by ID mongoDB
export const getProductById = async (req, res) => {
  const { productId } = req.params;
  if (!productId)
    return res.status(404).json({
      error: {
        message: `PRODUCT_${productId}_NOT_FOUND`,
      },
    });
  try {
    const product = await Product.findById(productId);
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: `PRODUCT_${productId}_NOT_FOUND`,
    });
  }
};
// Get all the reserve in the Product collection in mongo
export const getProducts = async (req, res) => {
  const products = await Product.find();
  return res.json(products);
};
// Update the entery document, use the format of create reserve API
export const updateProductById = async (req, res) => {
  const { productId } = req.params;
  const body = req.body;
  console.log(productId);
  console.log(body);

  try {
    const product = await Product.findById(productId);
    console.log(product);
    if (!product)
      return res.status(404).json({
        error: {
          message: `PRODUCT_${productId}_NOT_FOUND`,
        },
      });

    const updatedProduct = await Product.findByIdAndUpdate(productId, body, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: `PRODUCT_${productId}_NOT_FOUND`,
    });
  }
};
// Delete the document by id
export const deleteProductById = async (req, res) => {
  const { productId } = req.params;

  const item = true
  //const item = await Product.findByIdAndDelete(productId);

  if (!item)
    return res.status(404).json({
      error: {
        message: `PRODUCT_${productId}_NOT_FOUND`,
      },
    });

  // code 200 is ok too
  res.status(203).json({ message: `PRODUCT_${productId}_WAS_DELETED_SUCCESSFULLY` });
};
