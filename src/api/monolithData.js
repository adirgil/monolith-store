const host = "https://fedtest.monolith.co.il/api/";

const getProducts = async () => {
  const url = `${host}catalog/getAll`;

  try {
    const result = await fetch(url);
    const products = await result.json();
    return products?.data;
  } catch (error) {
    console.error(`cannot get products. error: ${error}`);
  }
};

const getSingleProduct = async (id) => {
  const url = `${host}catalog/get?id=${id}`;
  try {
    const result = await fetch(url);
    const product = await result.json();
    return product?.data;
  } catch (error) {
    console.error(`cannot get product. error: ${error}`);
  }
};

const addVariantToCart = async (variant_id, quantity) => {
  const url = `${host}cart/add?variant_id=${variant_id}&quantity=${quantity}`;
  try {
    const result = await fetch(url);
    const updatedCart = await result.json();
    return {
      updatedCart: updatedCart?.data,
      status: 200,
      msg: "Cart Updated!",
    };
  } catch (error) {
    const errorMsg = `cannot update cart. error: ${error}`;
    console.error(errorMsg);
    return { status: 400, msg: errorMsg };
  }
};

export { getProducts, getSingleProduct, addVariantToCart };
