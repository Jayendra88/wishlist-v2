import orderBy from 'lodash/orderBy'

import { QUERIES } from '../graphql/queries'

interface CategoryWithScore {
  Id: number
  Name: string
  FatherCategoryId: number
  Title: string
  Description: string
  Keywords: string
  IsActive: boolean
  LomadeeCampaignCode: string
  AdWordsRemarketingCode: string
  ShowInStoreFront: boolean
  ShowBrandFilter: boolean
  ActiveStoreFrontLink: boolean
  GlobalCategoryId: number
  StockKeepingUnitSelectionMode: string
  Score: number | null
  LinkId: string
  HasChildren: boolean
}

export interface Child {
  id: number
  name: string
  slug: string
  score?: number
  href: string
  hasChildren: boolean
}

export interface Category {
  hasChildren: boolean
  name: string
  metaTagDescription: string
  children: Child[]
}

export interface CategoryWrapper {
  category: Category
}

export const subcategoryWithScore = async (
  _: any,
  { id }: { id: number },
  ctx: Context
) => {
  const {
    clients: { graphQLServer, categoryScore: CategoryScoreClient },
    vtex: { logger },
  } = ctx

  const subCategoriesResponse = async () => {
    try {
      const { data }: any = await graphQLServer.query(
        QUERIES.getSubcategories,
        {
          id,
        },
        {
          persistedQuery: {
            provider: 'vtex.store-graphql@2.x',
            sender: 'whitebird.minimumtheme@10.x',
          },
        }
      )

      return data
    } catch (err) {
      logger.error({
        message: 'getProductsByRefId-error',
        err,
      })

      return []
    }
  }

  const subCategoriesResponseFinished: CategoryWrapper =
    await subCategoriesResponse()

  // make a list of all category ids that are direct children of the current category
  const subCategoriesIds =
    subCategoriesResponseFinished?.category?.children.map((item) => item.id)

  // make a call to categoryScore client with each subcategory id and get the score
  const subcategoryScore = subCategoriesIds.map(async (item: any) => {
    try {
      const data: any = await CategoryScoreClient.getCategoryScore(item)

      return data
    } catch (err) {
      logger.error({
        message: 'getProductsByRefId-error',
        err,
      })

      return []
    }
  })

  const subcategoryScoreFinished: CategoryWithScore[] = await Promise.all(
    subcategoryScore
  )

  const childrenWithScore =
    subCategoriesResponseFinished?.category?.children.map((item) => {
      const newItem = subcategoryScoreFinished.find(
        (subcategory) => subcategory.Id === item.id
      )

      return {
        ...item,

        score: newItem?.Score ?? null,
      }
    })

  const childrenSortedByname = childrenWithScore.sort((a: any, b: any) =>
    a.name.localeCompare(b.name, undefined, { numeric: true })
  )

  const childrenSortedByScore = orderBy(childrenSortedByname, 'score', 'asc')

  const response = {
    subcategoryWithScore: {
      ...subCategoriesResponseFinished.category,
      children: childrenSortedByScore,
    },
  }

  return response.subcategoryWithScore
}
