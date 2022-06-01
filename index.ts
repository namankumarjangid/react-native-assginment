export interface Product {
  id: number,
  name: string,
}

export interface Orders {
  id: number,
  productId: number,
  price: number,
  quantity: number,
  created_at: any
}