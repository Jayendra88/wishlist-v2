// !! A copy of https://github.com/vtex-apps/breadcrumb/blob/master/react/components/SearchBreadcrumb/index.tsx component, with minor changes, keeping it as close as possible to the original in case vtex changes it in the future

import type { FC } from 'react'
import React from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { SearchBreadcrumb as SearchBreadcrumbStructuredData } from 'vtex.structured-data'

import type { NavigationItem } from './BaseBreadcrumb'
import BaseBreadcrumb from './BaseBreadcrumb'

interface Props {
  showOnMobile?: boolean
  homeIconSize?: number
  caretIconSize?: number
}

const SearchBreadcrumb: FC<Props> = ({
  showOnMobile = true,
  homeIconSize,
  caretIconSize,
}) => {
  const { searchQuery } = useSearchPage()
  const breadcrumbData = searchQuery?.data?.facets?.breadcrumb
  const titleTag = searchQuery?.data?.searchMetadata?.titleTag
  const href = `/${titleTag}`

  let breadcrumb: NavigationItem[] = []

  if (breadcrumbData?.length) {
    breadcrumb = breadcrumbData
  } else if (titleTag) {
    breadcrumb = [{ name: titleTag, href }]
  }

  return (
    <>
      <SearchBreadcrumbStructuredData breadcrumb={breadcrumb} />
      <BaseBreadcrumb
        breadcrumb={breadcrumb}
        showOnMobile={showOnMobile}
        categories={[]} // unused prop, its OK
        homeIconSize={homeIconSize}
        caretIconSize={caretIconSize}
      />
    </>
  )
}

export default SearchBreadcrumb
