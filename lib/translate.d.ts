/** 
 * This definitions is about providers saved on JSON files
 * {
 *    name: ''
 *    products: [
 *      {
 *          name: ''
 *          alias: ''
 *      }
 *    ]
 * }
*/
declare type ProductByProviderProps = {
  name: string;
  alias: string;
}

declare type ProviderProps = {
  name: string;
  products: Array<ProductByProviderProps>
}

/** 
 * This section is whe file is tranformed between PDF to array
 * {
 *    name: '',
 *    amounts: [number, number, number]
 * }
*/
declare type OrderByPdfProps = {
  name: string;
  amounts: Array<number>;
}

type GetOrdersByPdf = (path: string) => Promise<Array<OrderByPdfProps>>; 

/** 
 * 
*/
declare type ProductByOrderProviderProps = {
  name: string;
  amounts: Array<string>
}

declare type OrderByProviderProps = {
  name: string;
  products: Array<ProductByOrderProviderProps> | any
}

type GetOrdersByProvider = (orders: Array<OrderByPdfProps>, providers: Array<ProviderProps>) => Array<OrderByProviderProps>;

/** */
type GetAmountsString = (amounts: Array<string>) => string
type GetProductsString = (products: Array<ProductByOrderProviderProps>) => string
type GetOrderString = (orders: Array<OrderByProviderProps>) => string

/** */
declare module "*.json" {
  const value: any;
  export default value;
}