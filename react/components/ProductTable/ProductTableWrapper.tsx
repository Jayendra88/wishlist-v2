import React, { useEffect, useState, useMemo } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - no types provided
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useQuery } from 'react-apollo'

import type { SingleProductInterface } from '../../typings/product'
// SingleProduct is a class that returns only required properties of a product
import { SingleProduct, groupedProducts } from '../helpers'
import ProductTable from './ProductTable'
import fixedPricesQuery from '../../graphql/fixedPrices.graphql'

interface ProductTableWrapperProps {
  categoryData: SingleProduct[] | null | undefined
  categoryHeader?: string | null | undefined
  categoryFooter?: string | null | undefined
}

const ProductTableWrapper: StorefrontFunctionComponent<
  ProductTableWrapperProps
> = ({ categoryData, categoryHeader, categoryFooter }) => {
  // get the search query from the context
  const { searchQuery } = useSearchPage()

  const [products, setProducts] = useState<SingleProduct[]>([])

  const flatProductList = useMemo(() => {
    return products?.map((product) => product.productId)
  }, [products])

  const { data: fixedPricesData, loading: fixedPricesLoading } = useQuery(
    fixedPricesQuery,
    {
      variables: {
        ids: flatProductList,
      },
      // The query will not execute until grid is available
      skip: !flatProductList?.length,
    }
  )

  //! Get products hook.
  useEffect(() => {
    // in case of collection page
    if (categoryData) {
      setProducts(categoryData)
    } else {
      // in case not a collection, get products from a search query
      const productsFromSearch = searchQuery?.data.productSearch?.products

      setProducts(
        productsFromSearch?.map(
          (product: SingleProductInterface) =>
            new SingleProduct(
              product.productReference,
              product.items[0].nameComplete,
              product.items[0].itemId,
              product.categories[0],
              product.items[0].images[0].imageUrl,
              product.link,
              product.properties
            )
        )
      )
    }

    currentLayoutIsList()

    // cleanup function
    return () => {
      setProducts([])
    }
  }, [categoryData, searchQuery?.data.productSearch?.products])

  // if current view is a product view or no collection data is available, display nothing
  if (!currentLayoutIsList() && !categoryData) {
    return <></>
  }

  // if category data is present, we are in a grid page, otherwise we are in a search page
  return categoryData?.length ? (
    <ProductTable
      key={categoryData[0]?.categoryName}
      groupedProducts={{
        categoryName: categoryData[0]?.categoryName,
        products: categoryData,
      }}
      fixedPrices={fixedPricesData?.fixedPrices}
      isPriceLoading={fixedPricesLoading}
      isCollectionTable={!!categoryData}
      categoryHeader={categoryHeader}
      categoryFooter={categoryFooter}
    />
  ) : (
    <>
      {groupedProducts(products)?.map((group) => (
        <ProductTable
          key={group.categoryName}
          groupedProducts={group}
          fixedPrices={fixedPricesData?.fixedPrices}
          isPriceLoading={fixedPricesLoading}
          isCollectionTable={!!categoryData}
          categoryHeader={categoryHeader}
          categoryFooter={categoryFooter}
        />
      ))}
    </>
  )
}

export default ProductTableWrapper

//! Helper functions
function currentLayoutIsList() {
  // regex to grab query from a URL string
  const href = window?.location?.href
  const string = href?.match(/\?.*/)?.[0]?.replace('?', '')

  // separate query string into an object
  const query = string?.split('&').reduce((acc: any, curr: any) => {
    const [key, value] = curr.split('=')

    acc[key] = value

    return acc
  }, {})

  // make sure that query exists first
  if (query) {
    return query.layout === 'list'
  }

  // if query doesn't exist, return false for default layout (grid)
  return false
}
