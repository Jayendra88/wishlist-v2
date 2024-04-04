import { matchSorter } from 'match-sorter'
import type { Row, TableInstance } from 'react-table'

import type {
  //! William's request to remove filter/sort
  // PreFilteredRow,
  ParentColumn,
} from '../../typings/react-table'
import type { SingleProduct } from '../helpers'
import type { ProductTableProps } from './ProductTable'

// convert "/Corrugated Products/Gaylords/Large Single Wall Boxes/" to grab "Large Single Wall Boxes"
export const getCategoryName = (categoryName: string) => {
  const categoryNameArray = categoryName.split('/')

  return categoryNameArray[categoryNameArray.length - 2]
}

export const findCurrentColumn = (
  tableInstance: TableInstance,
  column: ParentColumn
) => {
  // if column has a parent, it's a price column
  if (column.parent) {
    return column
  }

  const currentColumn = tableInstance?.columns.find(
    (instanceHeader) => instanceHeader.Header === column.originalId
  )

  return currentColumn?.columns?.[0]
}

export const sortColumn = (
  column: ParentColumn,
  tableInstance: TableInstance,
  dropdownValue?: string
) => {
  const isValueDescending = dropdownValue?.split(',')[1].includes('descending')

  const currentHeader = findCurrentColumn(tableInstance, column)

  // Sorting column is not disabled
  if (!currentHeader?.disableSortBy) {
    if (
      dropdownValue ? isValueDescending : !currentHeader?.isSortedDesc // isSortedDesc is undefined by default
    ) {
      return tableInstance.toggleSortBy(currentHeader!.id, true, false)
    }

    return tableInstance.toggleSortBy(currentHeader!.id, false, false)
  }
}

export const fuzzyTextFilterFn = (
  rows: Row[],
  id: string,
  filterValue: string
) => {
  return matchSorter(rows, filterValue, {
    keys: [(row: Row) => row.values[id]],
  })
}

// in case value is empty, clear it
fuzzyTextFilterFn.autoRemove = (val: string) => !val

//! William's request to remove filter/sort
// export const createDropDownOptions = (headers: HeaderGroup<object>[]) => {
//   let ascDescOptions = [] as { value: string; label: string }[]
//   headers.forEach((header: HeaderGroup<object>) => {
//     // guard statement
//     if (header.Header === 'Add to Cart') return

//     ascDescOptions.push({
//       value: `${header.Header}, ascending`,
//       label: `${header.Header}, ascending`,
//     })

//     ascDescOptions.push({
//       value: `${header.Header}, descending`,
//       label: `${header.Header}, descending`,
//     })
//   })

//   return ascDescOptions
// }

//! William's request to remove filter/sort
// export const convertFilteredRow = (filteredRows: any | PreFilteredRow[]) => {
//   return filteredRows.map((item: PreFilteredRow) => {
//     return item.original
//   })
// }

// flatten properties array inside of localProducts array

export const isEvenRow = (index: number) => {
  return index % 2 === 0
}

export const flattenedLocalProducts = (
  prod: SingleProduct[],
  fixedPrices: ProductTableProps['fixedPrices']
) => {
  if (prod.length === 0) {
    return
  }

  // object could have different amount of keys, keeping interface as any
  const localArray: any = []

  prod.forEach((product) => {
    // convert [{ properties: [{}, {}] }] to {}
    const flatProperties = product.properties?.reduce(
      (obj, item) => Object.assign(obj, { [item.name]: item.value }),
      {}
    )

    const fixedPricing = fixedPrices?.find(
      (obj) => obj.productId === product.productId
    )

    const flatFixedPricing = fixedPricing?.fixedPrices?.reduce(
      (obj: any, item: any) =>
        Object.assign(obj, { [item.minQuantity]: item.value }),
      {}
    )

    localArray.push({
      ...product,
      ...flatProperties,
      fixedPricing:
        fixedPricing && fixedPricing?.fixedPrices.length > 0
          ? fixedPricing?.fixedPrices
          : [
              {
                tradePolicyId: '1',
                value: 1.02,
                listPrice: null,
                minQuantity: 25,
              },
            ],
      ...flatFixedPricing,
    })
  })

  return localArray
}
