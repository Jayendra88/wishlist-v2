import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import productsByRefId from '../../graphql/productsByRefId.graphql'
import type { MDv2Category } from '../../graphqlTypings/masterDataV2'
import { getMDv2CategoryById } from '../../utils/masterdata'
import {
  assignNonProntoProperties,
  replaceTableHeaders,
  titleize,
} from '../helpers'
import ProductTableWrapper from '../ProductTable/ProductTableWrapper'
import SubcategoryHero from '../SubcategoryHero/SubcategoryHero'
import styles from './styles.css'
import type { SingleProduct } from '../helpers'
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader'

const Grid: StorefrontFunctionComponent = () => {
  const runtime = useRuntime()
  const urlCategoryId = runtime.route.params.id

  // add title to the page (tab)
  useEffect(() => {
    document.title = `${titleize(
      decodeURI(
        runtime.route.params.terms ??
          runtime.route.params.subcategory ??
          runtime.route.params.category ??
          runtime.route.params.department
      )
    )} - Whitebird`
  }, [runtime.route.params.terms])

  const [categoryMasterData, setCategoryMasterData] = useState<MDv2Category[]>(
    []
  )

  const [categoryData, setCategoryData] = useState<
    SingleProduct[][] | null | undefined
  >([])

  useEffect(() => {
    const getCategoryData = async () => {
      try {
        const response = await getMDv2CategoryById(urlCategoryId)

        setCategoryMasterData(response)
      } catch (error) {
        console.error(error)
      }
    }

    getCategoryData()
  }, [urlCategoryId])

  const flatProductList = categoryMasterData[0]?.grids.map(
    (grid) => grid.productList
  )

  const { data, loading, error } = useQuery(productsByRefId, {
    variables: {
      refIds: flatProductList,
    },

    // The query will not execute until category is fetched
    skip: !flatProductList?.length,
  })

  if (error) {
    console.error(error)
  }

  useEffect(() => {
    // eslint-disable-next-line vtex/prefer-early-return
    if (data?.productsByRefId.length) {
      // don't show not-found products (they are still kept in the master data)
      const availableProduct = data.productsByRefId.map(
        (group: SingleProduct[]) => {
          return group.filter((product) => product.productId !== '0')
        }
      )

      const productsWithReplacedHeaders = availableProduct.map(
        (group: SingleProduct[], groupIndex: number) => {
          return replaceTableHeaders(
            categoryMasterData[0].grids[groupIndex]?.categoryHeaders,
            group
          )
        }
      )

      const productsWithNonProntoProperties = productsWithReplacedHeaders.map(
        (group: SingleProduct[], groupIndex: number) => {
          return assignNonProntoProperties(
            group,
            categoryMasterData[0].grids[groupIndex].nonProntoFieldData
          )
        }
      )

      setCategoryData(productsWithNonProntoProperties)
    }
  }, [data?.productsByRefId.length])

  return (
    <section className={styles['extra-padding']}>
      <SubcategoryHero categorySlug={runtime.route.params.slug} />
      {loading ? (
        <SkeletonLoader height={600} />
      ) : (
        categoryData?.map((category, index: number) => {
          return (
            <ProductTableWrapper
              key={categoryMasterData[0].grids[index].categoryName}
              categoryData={category}
              categoryHeader={categoryMasterData[0].grids[index].categoryName}
              categoryFooter={categoryMasterData[0].grids[index].categoryFooter}
            />
          )
        })
      )}
    </section>
  )
}

export default Grid
