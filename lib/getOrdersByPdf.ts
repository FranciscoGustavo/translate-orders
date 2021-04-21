import pdfParse from 'pdf-parse';
import readFile from './readFile';

const renderPage = (pageData: any) => {
  // check documents https://mozilla.github.io/pdf.js/
  const render_options = {
    // replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    // do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(render_options).then((textContent: any) => {
    let lastY;
    let text = '';

    for (const item of textContent.items) {
      if (lastY === item.transform[5] || !lastY) {
        text += `-${item.str}`;
      } else {
        text += `\n${item.str}`;
      }
      lastY = item.transform[5];
    }

    return text.toLowerCase();
  });
};

const getOrdersByPdf: GetOrdersByPdf = async (path) => {
  const options = {
    pagerender: renderPage,
  };

  const buffer = await readFile(path);
  const data = await pdfParse(buffer as Buffer, options);
  const text = data.text.split('\n');
  
  const isValidProduct = new RegExp(/(-(kilogramo|pieza)-[0-9]+(\.[0-9][0-9]?)?-[0-9]+((\.|\,)[0-9][0-9]?)?)/g);
  const isValidAmount = new RegExp(
    /-([0-9][0-9])\/([a-z][a-z][a-z].)\/([0-9][0-9][0-9][0-9])/
  );
  const isKeepGoing = new RegExp(/continuación/);

  const orders: Array<OrderByPdfProps> = [];
  let ordersIndex = 0;
  let existKeepGoing: number | boolean = false;

  text.forEach((line: string) => {
    /**
     * Validate if position array has a object
     */
    if (typeof orders[ordersIndex] !== 'object') {
      orders[ordersIndex] = { name: '', amounts: [] };
    }

    /**
     * When line is a keep going product
     */
    if (isKeepGoing.test(line)) {
      existKeepGoing = 1;
      return;
    }

    /**
     * When line is a keep going product ans has an amount
     */
    if (existKeepGoing === 2 && isValidAmount.test(line)) {
      orders[ordersIndex - 1].amounts.push(Number(line.split('-')[2]));
      return;
    }

    /**
     * When there is a keep going product and check the first line that is not valid
     */
    if (existKeepGoing === 1 && !isValidAmount.test(line)) {
      existKeepGoing += 1;
      return;
    }

    /**
     * When there is a keep going product and check the last line that is not valid
     */
    if (existKeepGoing === 2 && !isValidAmount.test(line)) {
      existKeepGoing = false;
      return;
    }

    /**
     * When line has a product name
     */
    if (isValidProduct.test(line.replace(/\s/g, ''))) {
      orders[ordersIndex].name = line.split('-')[0];
      ordersIndex += 1;
      return;
    }

    /**
     * When line has an amount
     */
    if (isValidAmount.test(line)) {
      const amount = Number(line.split('-')[2]);
      orders[ordersIndex].amounts.push(amount);
    }
  });
  orders.pop();
  return orders;
};

export default getOrdersByPdf;
