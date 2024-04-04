import React, { useEffect, useState } from 'react'
import type { MDv2Category } from 'graphqlTypings/masterDataV2'
import { useQuery } from 'react-apollo'

import styles from './styles.css'
import type { Category } from '../../utils/masterdata'
import GetCategory from '../../graphql/getCategory.graphql'
import { getMDv2CategoryById } from '../../utils/masterdata'
import { fallbackImgUrl } from '../helpers'
import { makeLink } from '../helpers'

interface CategorySuggestionCardProps {
  currentCategory: Category
}

const CategorySuggestionCard: StorefrontFunctionComponent<
  CategorySuggestionCardProps
> = ({ currentCategory }) => {
  const [categoryData, setCategoryData] = useState<MDv2Category[]>([])
  const {
    data: categoryDataById,
    loading,
    error,
  } = useQuery(GetCategory, {
    variables: {
      id: Number(currentCategory.id),
    },
  })

  const fetchCategory = async (category: Category) => {
    try {
      const response = await getMDv2CategoryById(category.id.toString())

      return response
    } catch (err) {
      console.error(err)

      return null
    }
  }

  useEffect(() => {
    const categoryResponse = async () => {
      const data = await fetchCategory(currentCategory)

      if (data) {
        setCategoryData(data)
      }
    }

    categoryResponse()
  }, [currentCategory])

  const categoryDetails = categoryDataById?.category

  if (loading) {
    return (
      <div className={styles['category-suggestion-card']}>
        <div className={styles['category-suggestion-image']} />
        <div className={styles['category-suggestion-name']} />
      </div>
    )
  }

  if (error) {
    return null
  }

  return (
    <a href={makeLink(currentCategory.categories[0])}>
      <div className={styles['category-suggestion-card']}>
        <img
          src={`/_v/mdCategories/img/${categoryData[0]?.imgUrlHash}/${currentCategory.id}`}
          className={styles['category-suggestion-image']}
          alt={`${categoryDetails?.name}`}
          onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
            event.currentTarget.src = fallbackImgUrl
          }}
        />
        <div className={styles['category-suggestion-name']}>
          {categoryDetails?.name}
        </div>
      </div>
    </a>
  )
}

export default CategorySuggestionCard
