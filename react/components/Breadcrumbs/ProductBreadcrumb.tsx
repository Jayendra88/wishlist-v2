// !! A copy of https://github.com/vtex-apps/breadcrumb/blob/master/react/components/ProductBreadcrumb/index.tsx component, with minor changes, keeping it as close as possible to the original in case vtex changes it in the future
import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import { ProductBreadcrumb as ProductBreadcrumbStructuredData } from 'vtex.structured-data'

import type { Props, NavigationItem } from './BaseBreadcrumb'
import BaseBreadcrumb from './BaseBreadcrumb'

const ProductBreadcrumb: React.FC<Props> = (props) => {
  const { product } = useContext(ProductContext) ?? { product: null }

  const categoryTree: NavigationItem[] = product?.categoryTree ?? []
  const categories = product?.categories ?? []

  return (
    <>
      <ProductBreadcrumbStructuredData
        categoryTree={categoryTree}
        productName={product?.productName}
        productSlug={product?.linkText}
      />
      <BaseBreadcrumb
        term={product?.productName}
        categories={categories}
        categoryTree={categoryTree}
        breadcrumb={props.breadcrumb}
        showOnMobile={props.showOnMobile}
        homeIconSize={props.homeIconSize}
        caretIconSize={props.caretIconSize}
      />
    </>
  )
}

export default ProductBreadcrumb
