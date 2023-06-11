export const isValidProduct = (product: any) => {
  return !!(
    product.id &&
    typeof product.id === "string" &&
    product.title &&
    typeof product.title === "string" &&
    (!product.title || typeof product.description === "string") &&
    (!product.price || typeof product.price === "number")
  );
};
