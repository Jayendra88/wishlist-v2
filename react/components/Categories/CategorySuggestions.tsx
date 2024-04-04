import React from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - no types provided
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import styles from './styles.css'
import type { SingleProductInterface } from '../../typings/product'
import CategorySuggestionCard from './CategorySuggestionCard'
import { titleize } from '../helpers'

const CategorySuggestions: StorefrontFunctionComponent = () => {
  const { searchQuery } = useSearchPage()

  const products: SingleProductInterface[] = searchQuery.products || []

  const categories = products.map((product) => {
    return {
      categories: product.categories,
      id: Number(product.categoryId),
      catergoryId: product.categoryId,
    }
  })

  const duplicateCategoriesRemoved = categories.filter(
    (category, index, self) =>
      index === self.findIndex((t) => t.id === category.id)
  )

  // want to rerender if the current categories change without infinite loop

  return (
    <>
      <div className={styles['category-suggestion']}>
        <h1 className={styles['category-title']}>
          Results for:{' '}
          {titleize(searchQuery.data.searchMetadata?.titleTag ?? '')}
        </h1>
        <h2 className={styles['category-subTitle']}>Explore by Category</h2>
        <div className={styles['category-suggestion-container']}>
          {duplicateCategoriesRemoved.map((category) => {
            return (
              <CategorySuggestionCard
                currentCategory={category}
                key={category.id}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default CategorySuggestions

// Helper Functions
