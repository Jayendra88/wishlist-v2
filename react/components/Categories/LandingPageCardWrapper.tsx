import React, { Fragment, useEffect, useState } from 'react'

import type { Category } from './LandingPage'
import type { MDv2Category } from '../../graphqlTypings/masterDataV2'
import LandingPageCard from './LandingPageCard'
import styles from './styles.css'
import { getHeroData } from '../../utils/masterdata'

interface CategoryLandingPageProps {
  category: Category
  categoryData: MDv2Category[]
}

export interface HeroData {
  categoryId: string
  heroImgUrl?: string
  categoryName: string
  heroText?: string
  heroImgUrlHash?: string
  imgUrl?: string
  imgUrlHash: string
}

const CategoryLandingPage: StorefrontFunctionComponent = ({
  ...props
}: CategoryLandingPageProps) => {
  const { category } = props

  const [subcategoriesData, setSubcategoriesData] = useState<any[]>([])

  // combine all subcategories into one string of ids, separated by commas
  const subcategoriesIds = category.children
    .map((subcategory) => {
      return subcategory.id
    })
    .join(',')

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getHeroData(subcategoriesIds)

        // Sort the received data based on the order of category.children to keep the order of the cards
        const orderedSubcategories = category.children.map((child) => {
          const matchingSubcategory = response.find(
            (subCategory: any) => Number(subCategory.categoryId) === child.id
          )

          // if the category grid was re-used from another category, it's name in masterdata would become different from the internal category name
          const matchingSubcategoryWithInternalName = {
            ...matchingSubcategory,
            categoryName: child.name,
          }

          const categoryWithNoHeroData = {
            categoryId: child.id,
            categoryName: child.name,
          }

          return matchingSubcategoryWithInternalName || categoryWithNoHeroData
        })

        setSubcategoriesData(orderedSubcategories)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCategory()
  }, [category.children])

  return (
    <div className={styles['category-page-grid']}>
      {subcategoriesData?.map((subCategory: HeroData, index: number) => {
        return (
          <Fragment key={`${category.name.toString()} ${index}`}>
            <LandingPageCard
              heroData={subCategory}
              index={index}
              href={category.children[index].href}
            />
            {/* // return HR after 3rd element */}
            {index === 2 && category.children.length > 3 ? <hr /> : null}
          </Fragment>
        )
      })}
    </div>
  )
}

export default CategoryLandingPage
