import Sentry from '@sentry/node'

import {
  packSimpleBins,
  Box,
  packTheAdjustedWeightLimitedBins,
} from './simpleBinPacking'

const PALLET_WEIGHT = 40

export default async function getProductDetails(ctx: Context, reqBody: any) {
  const {
    clients: { product: ProductClient },
  } = ctx

  const reqBodyNoShipping = reqBody.items.filter(
    (item: any) => item.refId !== 'shipping'
  )

  const productDetails = reqBodyNoShipping.map(async (product: any) => {
    return ProductClient.getProductDetails(product.id)
  })

  const productData: ProductDetails[] = await Promise.all(productDetails)

  const items: Box[] = []

  productData.forEach((product, index) => {
    const { quantity } = reqBodyNoShipping[index]

    if (
      !product.Dimension?.length ||
      !product.Dimension?.width ||
      !product.Dimension?.height ||
      !product.Dimension?.weight
    ) {
      // Fire a Sentry error with the product.ProductRefId as a payload
      Sentry.withScope((scope) => {
        scope.setContext('product', { ProductRefId: product.ProductRefId })
        Sentry.captureException(
          new Error('Missing product dimensions or weight')
        )
      })
    }

    for (let i = 0; i < quantity; i++) {
      items.push(
        new Box(
          product.Dimension.length || 12,
          product.Dimension.width || 12,
          product.Dimension.height || 12,
          product.Dimension.weight || 1
        )
      )
    }
  })

  const packedBinsSimple = packSimpleBins(items)
  const packedBinsSimplePackage = packTheAdjustedWeightLimitedBins(items)
  const productDimensionsPackageCalculated = productDimensionsPackage(
    packedBinsSimplePackage
  )

  const productDimensionsLTLCalculated = productDimensionsLTL(packedBinsSimple)

  return {
    productDimensionsLTL: productDimensionsLTLCalculated,
    productDimensionsPackage: productDimensionsPackageCalculated,
  }
}

//! Helpers

interface Package {
  weight: number
  itemCount: number
  length: number
  width: number
  height: number
}

const productDimensionsLTL = (packedBinsSimple: Package[]) => {
  return packedBinsSimple.map((bin, index) => {
    const totalVolume = (bin.length * bin.width * bin.height) / 1728 // cubic feet
    const totalWeight = bin.weight + PALLET_WEIGHT
    const density = totalWeight / totalVolume
    const freightClass = calculateFreightClass(density)

    return {
      measurements: {
        weight: {
          unit: 'lb',
          value: totalWeight,
        },
        cuboid: {
          unit: 'in',
          l: bin.length,
          w: bin.width,
          h: bin.height,
        },
      },
      description: `Pallet ${index + 1}`,
      freight_class: `${freightClass}`,
      num_pieces: bin.itemCount,
    }
  })
}

const productDimensionsPackage = (packedBinsSimplePackage: Package[]) => {
  return packedBinsSimplePackage.map((bin, index) => {
    const totalVolume = (bin.length * bin.width * bin.height) / 1728 // cubic feet
    const totalWeight = bin.weight
    const density = totalWeight / totalVolume
    const freightClass = calculateFreightClass(density)

    return {
      measurements: {
        weight: {
          unit: 'lb',
          value: totalWeight,
        },
        cuboid: {
          unit: 'in',
          l: bin.length,
          w: bin.width,
          h: bin.height,
        },
      },
      description: `Box ${index + 1}`,
      freight_class: `${freightClass}`,
      num_pieces: bin.itemCount,
    }
  })
}

const calculateFreightClass = (density: number): number => {
  let freightClass = 0

  if (density < 1) {
    freightClass = 500
  } else if (density >= 1 && density < 2) {
    freightClass = 400
  } else if (density >= 2 && density < 3) {
    freightClass = 300
  } else if (density >= 3 && density < 4) {
    freightClass = 250
  } else if (density >= 4 && density < 5) {
    freightClass = 200
  } else if (density >= 5 && density < 6) {
    freightClass = 175
  } else if (density >= 6 && density < 7) {
    freightClass = 150
  } else if (density >= 7 && density < 8.5) {
    freightClass = 125
  } else if (density >= 8.5 && density < 10.5) {
    freightClass = 110
  } else if (density >= 10.5 && density < 12) {
    freightClass = 100
  } else if (density >= 12 && density < 15) {
    freightClass = 92.5
  } else if (density >= 15 && density < 22.5) {
    freightClass = 85
  } else if (density >= 22.5 && density < 30) {
    freightClass = 70
  } else if (density >= 30 && density < 35) {
    freightClass = 65
  } else if (density >= 35 && density < 50) {
    freightClass = 60
  } else if (density >= 50) {
    freightClass = 55
  }

  return freightClass
}

export interface Dimension {
  cubicweight: number
  height: number
  length: number
  weight: number
  width: number
}

export interface RealDimension {
  realCubicWeight: number
  realHeight: number
  realLength: number
  realWeight: number
  realWidth: number
}

export interface SkuSeller {
  SellerId: string
  StockKeepingUnitId: number
  SellerStockKeepingUnitId: string
  IsActive: boolean
  FreightCommissionPercentage: number
  ProductCommissionPercentage: number
}

export interface Image {
  ImageUrl: string
  ImageName: string
  FileId: number
}

export interface ProductSpecification {
  FieldId: number
  FieldName: string
  FieldValueIds: number[]
  FieldValues: string[]
  IsFilter: boolean
  FieldGroupId: number
  FieldGroupName: string
}

export interface ProductCategories {
  63836645: string
  131266197: string
  201477174: string
  238861224: string
  210304083: string
}

export interface AlternateIds {
  RefId: string
  Ean: string
}

export interface ProductDetails {
  Id: number
  ProductId: number
  NameComplete: string
  ComplementName: string
  ProductName: string
  ProductDescription: string
  ProductRefId: string
  TaxCode: string
  SkuName: string
  IsActive: boolean
  IsTransported: boolean
  IsInventoried: boolean
  IsGiftCardRecharge: boolean
  ImageUrl: string
  DetailUrl: string
  CSCIdentification?: any
  BrandId: string
  BrandName: string
  IsBrandActive: boolean
  Dimension: Dimension
  RealDimension: RealDimension
  ManufacturerCode: string
  IsKit: boolean
  KitItems: any[]
  Services: any[]
  Categories: any[]
  CategoriesFullPath: string[]
  Attachments: any[]
  Collections: any[]
  SkuSellers: SkuSeller[]
  SalesChannels: number[]
  Images: Image[]
  Videos: any[]
  SkuSpecifications: any[]
  ProductSpecifications: ProductSpecification[]
  ProductClustersIds: string
  PositionsInClusters: any
  ProductClusterNames: any
  ProductClusterHighlights: any
  ProductCategoryIds: string
  IsDirectCategoryActive: boolean
  ProductGlobalCategoryId: number
  ProductCategories: ProductCategories
  CommercialConditionId: number
  RewardValue: number
  AlternateIds: AlternateIds
  AlternateIdValues: string[]
  EstimatedDateArrival?: any
  MeasurementUnit: string
  UnitMultiplier: number
  InformationSource: string
  ModalType?: any
  KeyWords: string
  ReleaseDate: Date
  ProductIsVisible: boolean
  ShowIfNotAvailable: boolean
  IsProductActive: boolean
  ProductFinalScore: number
}
