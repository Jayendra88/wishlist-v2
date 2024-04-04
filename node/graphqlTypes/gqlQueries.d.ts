export interface Image {
  imageUrl: string
}

export interface Item {
  nameComplete: string
  itemId: string
  images: Image[]
  unitMultiplier: number
}

export interface Property {
  name: string
  values: string[]
}

export interface Child {
  id: number
  name: string
}

export interface CategoryTree {
  id: number
  name: string
  children: Child[]
}

export interface Product {
  categoryId: string
  productReference: string
  items: Item[]
  link: string
  properties: Property[]
  categoryTree?: CategoryTree[]
}

export interface ProductSearch {
  products: Product[]
}

export interface Data {
  productSearch: ProductSearch
}

export interface GetProductByRefId {
  data?: Data | Serializable | undefined
}
