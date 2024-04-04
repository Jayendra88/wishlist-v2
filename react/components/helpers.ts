/* eslint-disable @typescript-eslint/explicit-member-accessibility */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - no types provided
import type { Row } from 'read-excel-file'

import type { Product } from '../../node/graphqlTypes/gqlQueries'
import type { Grid } from '../graphqlTypings/masterDataV2'
import type { GroupedProducts } from '../typings/product'

export class SingleProduct {
  name: string
  reference: string
  productId: string
  categoryName: string
  image: string
  link: string
  UOM: string
  properties: Array<{ name: string; value: string }> | null
  ABCClassCode: string
  unitMultiplier: number
  constructor(
    reference: string,
    name: string,
    productId: string,
    categoryName: string,
    image: string,
    link: string,
    // properties could be null in case none are defined in VTEX
    properties: Array<{ name: string; values: string[] }> | null
  ) {
    const flattenArrayOfObjects = (
      propertiesArray: SingleProduct['properties']
    ) => {
      if (propertiesArray) {
        const sellerIdRemoved = propertiesArray?.filter(
          (property) => property.name !== 'sellerId' // only interested in other properties such as color, dimensions, etc
        )

        const flattenedArrayOfObjects = sellerIdRemoved?.map((property) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { name: propertyName, values: propertyValues } = property

          return { name: propertyName, value: propertyValues[0] }
        })

        return flattenedArrayOfObjects
      }

      return null
    }

    const productBundleMinQty =
      properties?.find((property) => property.name === 'UnitMultiplier')
        ?.values[0] ?? '1'

    const productBundleMinQtyNumber = parseInt(productBundleMinQty, 10)

    this.name = name
    this.reference = reference
    this.productId = productId
    this.categoryName = categoryName
    this.image = image
    this.link = link
    this.UOM =
      properties?.find((property) => property.name === 'UOM')?.values[0] ??
      'item'

    // TODO: properties that are provided into the constructor are not of the same type as the ones returned after conversion
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.properties = flattenArrayOfObjects(properties)
    this.ABCClassCode =
      properties?.find((property) => property.name === 'ABCClassCode')
        ?.values[0] ?? 'X'
    this.unitMultiplier = productBundleMinQtyNumber
  }
}

export const findCurrentCategory = (product: Product) => {
  // flatten the list of categories to be simple array
  const flatCategoryList = product.categoryTree?.flatMap((element) => {
    if (element.children !== null) {
      return element.children
    }

    return { id: element.id, name: element.name }
  })

  // find current category
  const currentCategory = flatCategoryList?.find((element) => {
    return element.id === parseInt(product.categoryId, 2)
  })?.name

  // returns right side if left side is null or undefined
  return currentCategory ?? ''
}

export const replaceTableHeaders = (
  preferredHeaders: Grid['categoryHeaders'],
  categoryData: SingleProduct[]
) => {
  const newCategoryData = categoryData.map((product) => {
    // if no properties are defined, return the product
    if (!product.properties?.length) return { ...product }

    // need to replace the original property name with a preferred one
    const preferredProperties = preferredHeaders?.map((header) => {
      const productWithReplacedProperties = product.properties?.find(
        (property) => {
          return property.name === header.originalProperty
        }
      )

      // replace the property name with the preferred one
      return {
        ...productWithReplacedProperties,
        // if the property name is in preferredHeaders, replace it with the new one otherwise return the original one
        name: header.replacementProperty ?? header.originalProperty,
      }
    })

    const propertiesToShow = preferredProperties.reduce(
      (acc: any[], property) => {
        if (property.name) {
          acc.push(property)
        }

        return acc
      },
      []
    )

    return { ...product, properties: propertiesToShow }
  })

  return newCategoryData
}

// group products by category to display header above each category table
export const groupedProducts = (products: SingleProduct[]) => {
  return products?.reduce((acc: GroupedProducts[], product: SingleProduct) => {
    const category = product.categoryName
    const currentGroup = acc.find((group) => group.categoryName === category)

    if (currentGroup) {
      currentGroup.products.push(product)
    } else {
      acc.push({
        categoryName: category,
        products: [product],
      })
    }

    return acc
  }, [])
}

// group products by category to display header above each category table
export const groupedRefs = (
  products: SingleProduct[],
  headers?: Grid['categoryHeaders'],
  nonProntoFields?: Grid['nonProntoFieldData']
) => {
  return {
    categoryName: products[0].categoryName,
    productList: products.map((product) => product.reference),
    categoryHeaders: headers ?? [],
    categoryFooter: '',
    nonProntoFieldData: nonProntoFields ?? [],
  }
}

export const titleize = (slug: string) => {
  if (!slug) {
    return ''
  }

  // regex split by - and capitalize each word
  const splitSlug = slug.split('-').map((word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  return splitSlug.join(' ')
}

export const rowsToArray = (rows: Row[], preferredPresent: boolean) => {
  const products = preferredPresent
    ? rows.slice(2) // skip first two rows as they will be headers
    : rows.slice(1)

  const arrayOfRefs = products.map((product) => {
    // refId
    return product[0]
  })

  return arrayOfRefs
}

export const makeLink = (str: string) =>
  str
    .normalize('NFD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[-\s]+/g, '-')
    // replace slashes in the category name with dashes to make a valid link
    .replace('-/-', '---')

export const fallbackImgUrl =
  'https://whitebird.vtexassets.com/assets/vtex.file-manager-graphql/images/55e6053a-f76a-4fd7-868c-131208067ab8___e8f9c81b4c1bc8ba5a1871a7b142e453.jpg'

export const extractCustomNonPronto = (
  data: Row[],
  preferredPresent: boolean
): any[] => {
  const customNonProntoIndexes: { [key: string]: number } = {}
  const result: Grid['nonProntoFieldData'] = []

  data.forEach((row, i) => {
    if (i === 0) {
      // In the first row, we look for "custom-non-pronto" headers
      row.forEach((item: any, j: number) => {
        if (typeof item === 'string' && item.startsWith('custom-non-pronto')) {
          customNonProntoIndexes[item] = j
          result.push({
            originalProperty: item,
            replacementProperty: item,
            values: [],
          })
        }
      })
    } else {
      // If preferredPresent is true, we save the first data row to replacementProperty
      if (preferredPresent && i === 1) {
        // fill in the replacement property from the index
        Object.entries(customNonProntoIndexes).forEach(
          ([originalProperty, index]) => {
            const item = result.find(
              (x) => x.originalProperty === originalProperty
            )

            if (item) {
              item.replacementProperty = (row[index] as string) || ''
            }
          }
        )
      }

      if (preferredPresent && i === 1) return // don't need to save preferred header into values

      // In other rows, we collect values
      Object.entries(customNonProntoIndexes).forEach(
        ([originalProperty, index]) => {
          const item = result.find(
            (x) => x.originalProperty === originalProperty
          )

          if (item) {
            item.values.push((row[index] || '') as string)
          }
        }
      )
    }
  })

  return result
}

export const assignNonProntoProperties = (
  products: SingleProduct[],
  customNonProntoData: Grid['nonProntoFieldData']
): SingleProduct[] => {
  // If customNonProntoData is not provided or it is an empty array, return the products array as is
  if (!customNonProntoData || customNonProntoData.length === 0) {
    return products
  }

  const productsWithNonProntoFields = products.map((product, index) => {
    if (product?.properties) {
      product.properties.forEach((property: any) => {
        customNonProntoData.forEach((item) => {
          if (property.name === item.replacementProperty) {
            property.value = item.values[index] || ''
            property.__typename = 'Property'
          }
        })
      })
    }

    return product
  })

  return productsWithNonProntoFields
}
