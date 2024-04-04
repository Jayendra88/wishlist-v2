/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SingleProduct } from '../components/helpers'

export interface SellingPrice {
  highPrice: number
  lowPrice: number
  __typename: string
}

export interface ListPrice {
  highPrice: number
  lowPrice: number
  __typename: string
}

export interface PriceRange {
  sellingPrice: SellingPrice
  listPrice: ListPrice
  __typename: string
}

export interface Specification {
  name: string
  originalName: string
  values: string[]
  __typename: string
}

export interface SpecificationGroup {
  name: string
  originalName: string
  specifications: Specification[]
  __typename: string
}

export interface ProductCluster {
  id: string
  name: string
  __typename: string
}

export interface ClusterHighlight {
  id: string
  name: string
  __typename: string
}

export interface Property {
  name: string
  values: string[]
  __typename: string
}

export interface ReferenceId {
  Key: string
  Value: string
  __typename: string
}

export interface Image {
  cacheId: string
  imageId: string
  imageLabel: string
  imageTag: string
  imageUrl: string
  imageText: string
  __typename: string
}

export interface CommertialOffer {
  discountHighlights: any[]
  teasers: any[]
  Price: number
  ListPrice: number
  Tax: number
  taxPercentage: number
  spotPrice: number
  PriceWithoutDiscount: number
  RewardValue: number
  PriceValidUntil: string
  AvailableQuantity: number
  __typename: string
  Installments: any[]
}

export interface Seller {
  sellerId: string
  sellerName: string
  sellerDefault: boolean
  __typename: string
  commertialOffer: CommertialOffer
}

export interface Item {
  itemId: string
  name: string
  nameComplete: string
  complementName: string
  ean: string
  variations: any[]
  referenceId: ReferenceId[]
  measurementUnit: string
  unitMultiplier: number
  images: Image[]
  __typename: string
  sellers: Seller[]
}

export interface SingleProductInterface {
  cacheId: string
  productId: string
  description: string
  productName: string
  productReference: string
  linkText: string
  brand: string
  brandId: number
  link: string
  categories: string[]
  categoryId: string
  priceRange: PriceRange
  specificationGroups: SpecificationGroup[]
  skuSpecifications: any[]
  productClusters: ProductCluster[]
  clusterHighlights: ClusterHighlight[]
  properties: Property[]
  __typename: string
  items: Item[]
  selectedProperties?: any
}

export interface GroupedProducts {
  categoryName: string
  products: SingleProduct[]
}

export interface FixedPrice {
  tradePolicyId: string
  value: number
  listPrice?: any
  minQuantity: number
  dateRange?: DateRange
}

interface DateRange {
  from: string | number | Date
  to: string | number | Date
}

export interface FixedPriceRange {
  productId: string
  fixedPrices: FixedPrice[]
}

export interface ProductCluster {
  id: string
  name: string
  __typename: string
}

export interface Child {
  name: string
  id: number
  __typename: string
}

export interface CategoryTree {
  children: Child[]
  __typename: string
}

export interface ReferenceId {
  Value: string
  __typename: string
}

export interface Image {
  cacheId: string
  imageId: string
  imageLabel: string
  imageTag: string
  imageUrl: string
  imageText: string
  __typename: string
}

export interface Item {
  referenceId: ReferenceId[]
  nameComplete: string
  itemId: string
  unitMultiplier: number
  images: Image[]
  __typename: string
}

export interface Property {
  name: string
  values: string[]
  __typename: string
}
