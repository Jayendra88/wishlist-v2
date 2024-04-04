import React, { useEffect, useState, useCallback } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import TurndownService from 'turndown'
import { useRuntime } from 'vtex.render-runtime'
import {
  Card,
  Center,
  createSystem,
  Flex,
  FlexSpacer,
  PageHeader,
  PageTitle,
  Text,
  ToastProvider,
  PageActions,
} from '@vtex/admin-ui'
import { useQuery } from 'react-apollo'

import productsByRefId from '../../../graphql/productsByRefId.graphql'
import type { SingleProduct } from '../../helpers'
import {
  fallbackImgUrl,
  replaceTableHeaders,
  assignNonProntoProperties,
} from '../../helpers'
import ProductTableWrapper from '../../ProductTable/ProductTableWrapper'
import { getMDv2CategoryById } from '../../../utils/masterdata'
import HeroCard from '../../SubcategoryHero/Elements/HeroCard'
import type { MDv2Category } from '../../../graphqlTypings/masterDataV2'
import DetailsFooter from './Elements/DetailsFooter'
import styles from './styles.css'
import { XlsUploadProvider } from '../AdminGridTable/Elements/XlsUploadModal/XlsUploadContext'
import XlsUploadModal from '../AdminGridTable/Elements/XlsUploadModal/XlsUploadModal'

interface Props {
  params: ProductParams
}

interface ProductParams {
  id: string
}

// html to markdown parser
const turndownService = new TurndownService()

const [ThemeProvider] = createSystem({
  key: 'admin-ui-example-details',
})

const messages = defineMessages({
  title: {
    id: 'admin/admin-grid-table.details.title',
  },
  params: {
    id: 'admin/admin-grid-table.details.params',
  },
})

const AdminGridTableDetail = ({ params: { id } }: Props) => {
  // ------
  // Pull the navigation function from the runtime
  const { navigate } = useRuntime()

  // ------
  // Input config

  const [heroText, setHeroText] = React.useState('')

  // ------
  // Category state
  const [category, setCategory] = useState<MDv2Category>()

  const fetchCategory = useCallback(async () => {
    try {
      const categoryResponse = await getMDv2CategoryById(id)

      setCategory(categoryResponse[0])

      const heroHtml = categoryResponse[0]?.heroText ?? ''
      const htmlToMarkdown = turndownService.turndown(heroHtml)

      setHeroText(htmlToMarkdown)
    } catch (err) {
      console.error(err)
    }
  }, [id])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory, id])

  // ------
  // get the products by refId using graphql
  const flatProductList = category?.grids.map((grid) => grid.productList)

  const { data, error } = useQuery(productsByRefId, {
    variables: {
      refIds: flatProductList,
    },

    // The query will not execute until category is fetched
    skip: !flatProductList && !category,
  })

  if (error) {
    console.error(error)
  }

  // ------
  // Grid state
  const [tablePreviewData, setTablePreviewData] = useState<SingleProduct[][]>(
    []
  )

  useEffect(() => {
    if (data && category?.grids?.length) {
      const productsWithReplacedHeaders = data.productsByRefId.map(
        (group: SingleProduct[], groupIndex: number) => {
          return replaceTableHeaders(
            category.grids[groupIndex]?.categoryHeaders,
            group
          )
        }
      )

      const productsWithNonProntoProperties = productsWithReplacedHeaders.map(
        (group: SingleProduct[], groupIndex: number) => {
          return assignNonProntoProperties(
            group,
            category.grids[groupIndex].nonProntoFieldData
          )
        }
      )

      setTablePreviewData(productsWithNonProntoProperties)
    }
  }, [category?.grids, data])

  return (
    <ThemeProvider>
      <ToastProvider>
        <Flex direction="column" justify="center" csx={{ bg: '$secondary' }}>
          <PageHeader
            onPopNavigation={() =>
              navigate({
                page: 'admin.app.grid-list',
              })
            }
          >
            <PageTitle>
              <FormattedMessage {...messages.title} values={{ id }} />
            </PageTitle>
            <PageActions>
              <XlsUploadProvider>
                <XlsUploadModal
                  categoryToUpdate={category}
                  categoryToUpdateProducts={tablePreviewData}
                />
              </XlsUploadProvider>
            </PageActions>
          </PageHeader>

          <Flex justify="center">
            <div
              style={{
                padding: '4rem',
                maxWidth: '1500px',
                width: '100%',
              }}
            >
              <Card className={styles.card}>
                <Flex className={styles['flex-container']}>
                  <Text className={styles['text-style']}>Category Name:</Text>
                  <FlexSpacer />
                  <Text>{category?.categoryName}</Text>
                </Flex>
                <Flex className={styles['flex-container']}>
                  <Text className={styles['text-style']}>Category ID:</Text>
                  <FlexSpacer />
                  <Text>{category?.categoryId}</Text>
                </Flex>
                <Flex className={styles['flex-container']}>
                  <Text className={styles['text-style']}>Category Image:</Text>
                  <FlexSpacer />
                  {category?.imgUrl ? (
                    <img
                      className={styles.image}
                      src={`/_v/mdCategories/img/${category.imgUrlHash}/${id}`}
                      alt={category?.categoryName}
                      onError={(
                        event: React.SyntheticEvent<HTMLImageElement>
                      ) => {
                        event.currentTarget.src = fallbackImgUrl
                      }}
                    />
                  ) : (
                    <Text>No Image Provided</Text>
                  )}
                </Flex>
                <Flex className={styles['flex-container__input']}>
                  <HeroCard
                    category={{
                      categoryId: category?.categoryId,
                      categoryTitle: category?.categoryName,
                      heroImageHash: category?.heroImgUrlHash,
                      categoryImageHash: category?.imgUrlHash,
                      heroText,
                    }}
                  />
                </Flex>
              </Card>

              <Card className={styles.card}>
                <Flex className={styles['flex-container']}>
                  <Text>Grid Preview:</Text>
                </Flex>
                {tablePreviewData && tablePreviewData.length > 0 ? (
                  // data comes as arrays of arrays of objects
                  tablePreviewData.map((group, index: number) => {
                    return (
                      <ProductTableWrapper
                        key={category?.grids[index].categoryName}
                        categoryData={group}
                        categoryHeader={category?.grids[index].categoryName}
                        categoryFooter={category?.grids[index].categoryFooter}
                      />
                    )
                  })
                ) : (
                  <Center>
                    <Text tone="primary" variant="title2">
                      Preview table will appear here
                    </Text>
                  </Center>
                )}
              </Card>
              <DetailsFooter />
            </div>
          </Flex>
        </Flex>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default AdminGridTableDetail
