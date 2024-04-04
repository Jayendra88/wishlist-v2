import React, { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - no types provided
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import { getHeroData } from '../../utils/masterdata'
import HeroCard from './Elements/HeroCard'
import { titleize } from '../helpers'

interface SubcategoryHeroProps {
  categorySlug?: string // comes from grid component
}

const formatName = (category: string) => {
  if (!category) {
    return ''
  }

  const categoryNameArray = category.split('/')

  return categoryNameArray[categoryNameArray.length - 2]
}

const SubcategoryHero: StorefrontFunctionComponent<SubcategoryHeroProps> = ({
  categorySlug, // if categorySlug is not provided, it will be retrieved from the search query on subcategory pages
}) => {
  const runtime = useRuntime()

  // if slug is provided, we are ina a category grid page
  const urlCategoryId = categorySlug
    ? runtime.route.params.categoryId
    : runtime.route.params.id

  const { searchQuery } = useSearchPage()
  const [heroData, setHeroData] = useState([
    {
      heroImgUrl: undefined,
      categoryName: '',
      heroText: '',
      heroImgUrlHash: undefined,
      imgUrl: '',
      imgUrlHash: '',
    },
  ])

  const categoryNameFromSearch = searchQuery?.products
    ? searchQuery?.products[0]?.categories[0]
    : ''

  const categoryTitle = categorySlug
    ? titleize(categorySlug)
    : formatName(categoryNameFromSearch)

  useEffect(() => {
    // ------
    // get a div and add a class to it to change background color as not possible to target the div directly (no blockClass available)
    const extraPadding = document.getElementsByClassName(
      'whitebird-minimumtheme-5-x-extra-padding'
    )[0] as HTMLElement

    extraPadding?.classList?.add('whitebird-minimumtheme-5-x-background-color')
    // ------

    const getHeroDataFromMasterData = async () => {
      try {
        const heroDataResponce = await getHeroData(urlCategoryId)

        setHeroData(heroDataResponce)
      } catch (error) {
        console.error(error)
      }
    }

    getHeroDataFromMasterData()
  }, [categoryTitle])

  if (!heroData.length) return null

  const [firstCategory] = heroData

  return (
    <HeroCard
      category={{
        categoryId: urlCategoryId,
        categoryTitle: firstCategory.categoryName,
        heroImageHash: firstCategory?.heroImgUrlHash ?? undefined,
        categoryImageHash: firstCategory?.imgUrlHash,
        heroText: firstCategory?.heroText,
      }}
    />
  )
}

export default SubcategoryHero
