import React from 'react'

import type { Props } from './BaseBreadcrumb'
import BaseBreadcrumb from './BaseBreadcrumb'

const CustomBreadcrumb: StorefrontFunctionComponent<Props> = (props) => {
  const term = props.term ?? ''
  const categoryTree = props.categoryTree ?? []
  const categories = props.categories ?? []

  return (
    <>
      <BaseBreadcrumb
        term={term}
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

export default CustomBreadcrumb
