import React from 'react'
import { FormattedPrice } from 'vtex.formatted-price'

import type { FixedPrice } from '../../../../typings/product'
import type { CellRowObject, Original } from '../../../../typings/react-table'
import AmountAddToCart from '../../../PDP/AmountAddToCart'
import styles from '../../styles.css'

export function createColumns({
  products,
  isPriceLoading,
  currency,
}: {
  products: Original[]
  isPriceLoading: boolean
  currency: string
}) {
  if (products.length === 0) {
    return []
  }

  const [firstProduct] = products

  // columns are created based on the properties of the first product,
  // which should be the same for all products of a single category
  const newColumns = (firstProduct.properties ?? []).map((property: any) => {
    return {
      Header: `${property.name}`,
      id: property.name,
      columns: [
        {
          Header: 'invisible header',
          displayNone: true,
          accessor: `${property.name}`,
        },
      ],
      rowSpan: 2,
    }
  })

  const partNumberColumn = {
    Header: 'Part #',
    id: 'Part #',
    accessor: 'partNumberHeader',
    columns: [
      {
        Header: 'invisible header',
        // nested header required for how table is displayed, all headers span 2 rows except for fixed price header
        displayNone: true,
        accessor: 'partNumber',
        id: 'partNumber', // id required for function-generated rows/headers
        Cell: ({ row }: any) => (
          <a href={row.original.link} className="link">
            <span>
              {row.original.link === '/not-found'
                ? `${row.original.reference} - Not Found`
                : row.original.reference}
            </span>
          </a>
        ),
      },
    ],
    rowSpan: 2,
  }

  const unitOfMeasure = firstProduct.UOM ?? 'Item'

  // nested fixed Price columns
  const priceColumns = {
    Header: `Price Per ${unitOfMeasure} (${currency})`,
    disableSortBy: true,
    id: `Price Per ${unitOfMeasure} (${currency})`,
    columns: firstProduct.fixedPricing?.map(
      (item: FixedPrice, index: number) => {
        return {
          Header: `${item.minQuantity}`,
          // in case products have same price breakdown in a row 1,1,25 it breaks the table as Id's should be unique
          id: `${firstProduct.productId}${index}`,
          accessor: `${item.minQuantity}`,
          Cell: ({ row }: any) => {
            // keeping as any because of generated rows that have different keys we cannot predict
            return (
              <span className={styles.accent}>
                {/* show an empty string until prices are loaded */}
                {row.original[`${item.minQuantity}`] ? (
                  <FormattedPrice
                    value={row.original[`${item.minQuantity}`] ?? ''}
                  />
                ) : (
                  ''
                )}
              </span>
            )
          },
        }
      }
    ),
  }

  const addToCartColumn = {
    Header: 'Add to Cart',
    className: `${styles['add-to-cart']}`,
    columns: [
      {
        Header: 'invisible header',
        id: 'add-to-cart',
        displayNone: true,
        disableSortBy: true,
        Cell: ({ row }: CellRowObject) => {
          return row.original.link !== '/not-found' ? (
            <AmountAddToCart
              ABCClassCode={row.original.ABCClassCode}
              qtyPerBundle={row.original.unitMultiplier}
              isLoading={isPriceLoading}
              addToCartText="Add"
              skuId={row.original.productId}
              isSlimSize
            />
          ) : null
        },
      },
    ],
    rowSpan: 2,
  }

  return [partNumberColumn, ...newColumns, priceColumns, addToCartColumn]
}
