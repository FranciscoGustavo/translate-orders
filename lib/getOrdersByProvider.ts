const getOrdersByProvider: GetOrdersByProvider = (orders, providers) => {

  const ordersByProvider = providers.map(({ name, products }) => {

    const productsByProvider = products.map(({ name, alias }) => {
      const product = orders.find(({ name: nameByOrder }) => nameByOrder === name);
      const amounts = product?.amounts.map((amount) => {
        let amountStr;
        if (amount < 1) {
          amountStr = `${amount * 1000} g`
        } else {
          amountStr = amount + ' k';
        }
        return amountStr;
      });

      return {
        name: alias,
        amounts 
      }
    })

    return {
      name,
      products: productsByProvider
    }
  });
  return ordersByProvider
};

export default getOrdersByProvider;
