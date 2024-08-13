import type products from 'i18n/en/products';
export type ProductIndexColumn = keyof (typeof products)['indexColumns'];
export const productsIndexColumns: ProductIndexColumn[] = ['name', 'description', 'price', 'shopUrl'];
