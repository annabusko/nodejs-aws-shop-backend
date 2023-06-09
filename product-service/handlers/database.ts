const data = [
  {
    id: "1",
    title: "book 1",
    description: "some cool book 1",
    price: 10,
  },
  {
    id: "2",
    title: "book 2",
    description: "some cool book 2",
    price: 20,
  },
  {
    id: "3",
    title: "book 3",
    description: "some cool book 3",
    price: 30,
  },
];

export const Database = {
  getAllProducts: () => data,
  getProductById: (id: string) => {
    return data.find((i) => i.id === id);
  },
};
