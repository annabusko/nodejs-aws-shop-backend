const data = [
  {
    id: "1",
    title: "product 1",
    description: "some cool product 1",
    price: 10,
  },
  {
    id: "2",
    title: "product 2",
    description: "some cool product 2",
    price: 20,
  },
  {
    id: "3",
    title: "product 3",
    description: "some cool product 3",
    price: 30,
  },
];

export const Database = {
  getAllProducts: () => data,
  getProductById: (id: string) => {
    return data.find((i) => i.id === id);
  },
};
