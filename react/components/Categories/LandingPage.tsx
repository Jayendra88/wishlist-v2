import React from 'react'

import type { MDv2Category } from '../../graphqlTypings/masterDataV2'
import styles from './styles.css'
import Grid from './Grid'
import LandingPageCardWrapper from './LandingPageCardWrapper'

export interface Child {
  id: number
  name: string
  slug: string
  score: number
  href: string
  hasChildren: boolean
  __typename: string
}

export interface Category {
  hasChildren: boolean
  name: string
  metaTagDescription?: any
  children: Child[]
  __typename: string
}

interface CategoryLandingPageProps {
  category: Category
  categoryData: MDv2Category[]
}

const CategoryLandingPage: StorefrontFunctionComponent = ({
  ...props
}: CategoryLandingPageProps) => {
  const { category } = props
  const { categoryData } = props

  // if a category doesn't have any more subcategories, but has grids, show the grids
  if (!category?.hasChildren && categoryData && categoryData[0]?.grids.length) {
    return <Grid />
  }

  // if category doesn't have any more subcategories, but has products, show the search container
  if (!category?.hasChildren) {
    return null
  }

  return (
    <>
      <div className={styles['category-page']}>
        <h1>{category.name}</h1>
        <h3>{category.metaTagDescription}</h3>
        <LandingPageCardWrapper category={category} />
      </div>
    </>
  )
}

export default CategoryLandingPage
