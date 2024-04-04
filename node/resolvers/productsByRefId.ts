import { QUERIES } from '../graphql/queries'
import type { GetProductByRefId, Product } from '../graphqlTypes/gqlQueries'
import {
  findCurrentCategory,
  SingleProduct,
} from '../../react/components/helpers'

export const productsByRefId = async (
  _: any,
  { refIds }: { refIds: string[][] },
  ctx: Context
) => {
  const {
    clients: { graphQLServer },
    vtex: { logger },
  } = ctx

  const response = refIds.map(async (singleRefIdArray) => {
    const searchMultipleRefs = singleRefIdArray.map(async (item) => {
      try {
        const { data }: GetProductByRefId = await graphQLServer.query(
          QUERIES.getProductsByRefId,
          {
            productReference: item,
          },
          {
            persistedQuery: {
              provider: 'vtex.search-graphql@0.x',
              sender: 'whitebird.minimumtheme@3.x',
            },
          }
        )

        // in case product not found in search - return error product
        if (
          data?.productSearch.products.length > 0 &&
          // vtex could return a product with the different refId, if it has issues with it
          data?.productSearch?.products?.[0]?.productReference === item
        ) {
          return data?.productSearch?.products?.[0]
        }

        return errorProduct(item)
      } catch (err) {
        logger.error({
          message: 'getProductsByRefId-error',
          err,
        })

        return errorProduct(item)
      }
    })

    const promiseFinished: Product[] = await Promise.all(searchMultipleRefs)

    const productsWithCategories = promiseFinished.map(
      (product) =>
        new SingleProduct(
          product.productReference,
          product.items[0].nameComplete,
          product.items[0].itemId,
          findCurrentCategory(product),
          product.items[0].images[0].imageUrl,
          product.link,
          product.properties
        )
    )

    return productsWithCategories
  })

  return response
}

const errorProduct = (item: string): Product => {
  return {
    categoryId: '0',
    productReference: item,
    items: [
      {
        nameComplete: 'Error Product',
        itemId: '0',
        unitMultiplier: 1,
        images: [
          {
            imageUrl:
              'https://whitebird.vtexassets.com/arquivos/ids/160106/w1m0304.jpg?v=637865017629100000',
          },
        ],
      },
    ],
    link: '/not-found',
    properties: [{ name: 'sellerId', values: ['1'] }],
    categoryTree: [{ id: 0, name: 'error', children: [] }],
  }
}
