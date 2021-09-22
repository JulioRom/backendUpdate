import Product from "../models/Product";

// TODO: change the name product to reserve

// Create the reserve object with lpn associates
export const createProduct = async (req, res) => {
  const {
    reserve,
    lpnAssociates,
    reserveStatus
  } = req.body;

  try {
    const newProduct = new Product({
      reserve,
      lpnAssociates,
      reserveStatus
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
  const {
    productId
  } = req.params;

  const product = await Product.findById(productId);
  res.status(200).json(product);
};
// Get all the reserve in the Product collection in mongo
export const getProducts = async (req, res) => {
  const products = await Product.find();
  return res.json(products);
};
// Update the entery document, use the format of create reserve API
export const updateProductById = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body, {
      new: true,
    }
  );
  res.status(200).json(updatedProduct);
};
// Delete the document by id 
export const deleteProductById = async (req, res) => {
  const {
    productId
  } = req.params;

  await Product.findByIdAndDelete(productId);

  // code 200 is ok too
  res.status(204).json();
};