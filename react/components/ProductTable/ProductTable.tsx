import React, { useEffect, useMemo, useRef } from 'react'
import { useFilters, useGlobalFilter, useSortBy, useTable } from 'react-table'
import type { Cell, HeaderGroup } from 'react-table'

//! William asked to remove filter/sort from tables, keeping it in case he changes his mind, if not
// TODO: remove after 2022-Dec-31
// import { Dropdown, Input } from 'vtex.styleguide'

import useLocaleCurrency from '../../hooks/useLocaleCurrency'
import MarkdownToHtml from '../admin/AdminGridTable/Elements/MarkdownToHtml/MarkdownToHtml'
import IconCaretDown from '../Icons/IconCaretDown'
import IconCaretUp from '../Icons/IconCaretUp'
import { createColumns } from './Elements/Columns/CreateColumns'
import MobileCardList from './Elements/MobileCards/MobileCardList'
import {
  findCurrentColumn,
  flattenedLocalProducts,
  getCategoryName,
  isEvenRow,
  sortColumn,
} from './ProductTableHelpers'
import styles from './styles.css'
import type { FixedPriceRange, GroupedProducts } from '../../typings/product'

export type ProductTableProps = {
  groupedProducts: GroupedProducts
  fixedPrices: FixedPriceRange[] | null | undefined
  orderFormId?: any
  isPriceLoading: boolean
  isCollectionTable?: boolean
  categoryHeader?: string | null | undefined
  categoryFooter?: string | null | undefined
}

const ProductTable: StorefrontFunctionComponent<ProductTableProps> = ({
  groupedProducts,
  fixedPrices,
  isPriceLoading,
  isCollectionTable,
  categoryHeader,
  categoryFooter,
}) => {
  const mounted: any = useRef()
  const currency = useLocaleCurrency()

  useEffect(() => {
    if (mounted.current) {
      return
    }

    // on initial load, set The initial dropdown value
    //! William request
    // updateDropDownValue('Part #, descending')

    mounted.current = true
  })
  //! End AmountAddToCart setup

  //! SORTING/FILTERING
  //! William's request to remove filter/sort
  // const [dropdownValue, setDropdownValue] = useState('')
  // const [filteredRows, setFilteredRows] = React.useState([] as any)

  // const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value
  //   setGlobalFilter(value)
  //   setFilteredRows(convertFilteredRow(tableInstance.flatRows))
  // }

  // const dropdownHandler = (value: string) => {
  //   setFilteredRows(convertFilteredRow(tableInstance.flatRows))
  //   updateDropDownValue(value)
  // }

  // const updateDropDownValue = (value: string) => {
  //   const valueHeaderName = value.split(',')[0]
  //   setDropdownValue(value)

  //   sortColumn(
  //     // @ts-ignore
  //     headerGroups[0].headers.find(
  //       (header: any) => header.Header === valueHeaderName
  //     ),
  //     tableInstance,
  //     value
  //   )
  // }

  //! SORTING/FILTERING

  // each group of products comes with a category name and a list of products
  const { categoryName, products } = groupedProducts

  // data and columns need to be memoized to work with react-table
  const data = useMemo(() => {
    return flattenedLocalProducts(products, fixedPrices)
  }, [products, fixedPrices])

  const unitOfMeasure = data[0].UOM ?? 'Unit'

  const columns = useMemo(
    () => [
      // columns based on properties that come from VTEX
      ...createColumns({
        products: data,
        isPriceLoading,
        currency,
      }),
    ],
    [currency, data, isPriceLoading]
  )

  const tableInstance = useTable(
    {
      data,
      columns,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    //! William's request to remove filter/sort
    // setGlobalFilter,
  } = tableInstance

  return (
    <>
      <section
        className={
          isCollectionTable
            ? styles['product-table-wrap--collection']
            : styles['product-table-wrap']
        }
      >
        <div className={styles['name-filter-sort-wrap']}>
          <h3 className={styles['product-table-header']}>
            {isCollectionTable ? (
              <MarkdownToHtml markdownString={categoryHeader} />
            ) : (
              getCategoryName(categoryName)
            )}
          </h3>
          {/* //! William's request to remove filter/sort */}
          {/* <div className={styles['filter-sort-wrap']}>
            <Input
              placeholder="Search table"
              label="Filter"
              onChange={filterHandler}
            />
            <Dropdown
              label="Sort By"
              options={createDropDownOptions(headerGroups[0].headers)}
              value={dropdownValue}
              onChange={(_: any, value: string) => dropdownHandler(value)}
            />
          </div> */}
        </div>
        {/* Mobile card list, hidden by css on desktop */}
        <MobileCardList
          // if table is not filtered, filteredRowsMemo is empty
          productData={
            //! William's request to remove filter/sort
            // filteredRows.length > 0 ? filteredRows :
            data
          }
        />
        {/* End Mobile card list */}
        <table className={styles['product-table']} {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: HeaderGroup) => {
              return (
                // key is provided by props
                // eslint-disable-next-line react/jsx-key
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((header: any) => {
                    return (
                      // key is provided by props
                      // eslint-disable-next-line react/jsx-key
                      <th
                        {...header.getHeaderProps(
                          header.getSortByToggleProps()
                        )}
                        rowSpan={`${header.rowSpan ?? 1}`}
                        style={header.displayNone ? { display: 'none' } : {}}
                        className={`${
                          // If header is a number, it a fixed price header
                          Number(header.Header)
                            ? styles['price-header'] // move caret for price headers
                            : header.Header ===
                              `Price Per ${unitOfMeasure} (${currency})` // hide parent header caret
                            ? styles['parent-price-header']
                            : header.className
                        }`}
                        onClick={() => {
                          sortColumn(header, tableInstance)
                        }}
                      >
                        {header.render('Header')}
                        <span className={styles['icon-caret']}>
                          {findCurrentColumn(tableInstance, header)
                            ?.isSorted ? (
                            findCurrentColumn(tableInstance, header)
                              ?.isSortedDesc ? (
                              <IconCaretDown
                                size={10}
                                isActive
                                viewBox="0.7 0 6.2 6.2"
                              />
                            ) : (
                              <IconCaretUp
                                size={10}
                                isActive
                                viewBox="0.7 0 6.2 6.2"
                              />
                            )
                          ) : (
                            ''
                          )}
                        </span>
                      </th>
                    )
                  })}
                </tr>
              )
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)

              return (
                // key is provided by props
                // eslint-disable-next-line react/jsx-key
                <tr
                  className={isEvenRow(row.index) ? '' : `${styles['odd-row']}`}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell: Cell) => {
                    return (
                      // key is provided by props
                      // eslint-disable-next-line react/jsx-key
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className={styles['product-table-footer']}>
          <MarkdownToHtml markdownString={categoryFooter} />
        </div>
      </section>
    </>
  )
}

export default ProductTable
