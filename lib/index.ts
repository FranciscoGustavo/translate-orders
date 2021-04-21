import getOrdersByPdf from './getOrdersByPdf';
import getOrdersByProvider from './getOrdersByProvider';
import writeFile from './writeFile';
import providers from './providers';

const getAmountsStr: GetAmountsString = (amounts) => amounts.join('\n')

const getProductsStr: GetProductsString = (products) => {
  return products.map(({ name, amounts }) => `${name}\n${getAmountsStr(amounts)}`).join('\n')
}

const getOrdersByProviderStr: GetOrderString = (orders) => {
  return orders.map(({ name, products }) => `${name}\nPedido\n${getProductsStr(products)}`).join('\n\n\n');
}

const main = async () => {
  const orders = await getOrdersByPdf('./order.pdf');
  const ordersByProviers = await getOrdersByProvider(orders, providers)

  const ordersByProviersStr = getOrdersByProviderStr(ordersByProviers)

  writeFile('./order-2.txt', ordersByProviersStr);
}

main()