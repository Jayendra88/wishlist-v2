import { json } from 'co-body'

const DATA_ENTITY_PREFIX = 'whitebird_'
const SCHEMA_VERSION = 'v5'
const DATA_ENTITY = 'categories'

export async function masterDataCategories(
  ctx: Context,
  next: () => Promise<any>
) {
  const MasterDataClient = ctx.clients.masterdata

  const categoryId = ctx.vtex.route.params.categoryId as string

  const data = await MasterDataClient.searchDocuments({
    dataEntity: `${DATA_ENTITY_PREFIX}${DATA_ENTITY}`,
    fields: [
      'id',
      'categoryId',
      'categoryName',
      'imgUrl',
      'imgUrlHash',
      'heroImgUrl',
      'heroImgUrlHash',
      'heroText',
      'grids',
    ],
    where: `(categoryId  = "${categoryId}")`,
    sort: 'categoryName ASC',
    pagination: {
      page: 1,
      pageSize: 1,
    },
    schema: SCHEMA_VERSION,
  })

  ctx.body = shortenedImages(data)
  await next()
}

export async function masterDataCategoriesByName(
  ctx: Context,
  next: () => Promise<any>
) {
  const MasterDataClient = ctx.clients.masterdata

  const categoryName = decodeURI(ctx.vtex.route.params.categoryName as string)

  const pageNumber = parseInt(ctx.vtex.route.params.pageNumber as string, 10)

  const data = await MasterDataClient.searchDocumentsWithPaginationInfo({
    dataEntity: `${DATA_ENTITY_PREFIX}${DATA_ENTITY}`,
    fields: [
      'id',
      'categoryId',
      'categoryName',
      'imgUrl',
      'imgUrlHash',
      'heroImgUrl',
      'heroImgUrlHash',
      'heroText',
      'grids',
    ],
    where:
      categoryName === 'all'
        ? undefined
        : `(categoryName = "*${categoryName}*")`,
    sort: 'categoryName ASC',
    pagination: {
      page: pageNumber,
      pageSize: 10,
    },
    schema: SCHEMA_VERSION,
  })

  ctx.body = {
    data: shortenedImages(data.data),
    pagination: data.pagination,
  }
  await next()
}

export async function masterDataCategoryImage(
  ctx: Context,
  next: () => Promise<any>
) {
  const MasterDataClient = ctx.clients.masterdata

  const categoryId = ctx.vtex.route.params.categoryId as string

  const data: Array<{ imgUrl: string; imgUrlHash: string }> =
    await MasterDataClient.searchDocuments({
      dataEntity: `${DATA_ENTITY_PREFIX}${DATA_ENTITY}`,
      fields: ['imgUrl', 'imgUrlHash'],
      where: `(categoryId  = "${categoryId}")`,
      pagination: {
        page: 1,
        pageSize: 1,
      },
      schema: SCHEMA_VERSION,
    })

  // in case data is not found, return 404 status
  if (!data[0]?.imgUrl) {
    ctx.status = 404

    await next()
  } else {
    ctx.set('Content-Type', imageType(data[0]?.imgUrl))
    // set cache for 1 year
    ctx.set('cache-control', 'public, max-age=31536000')
    ctx.body = imageToReturn(data[0]?.imgUrl)

    await next()
  }
}

export async function masterDataCategoryHeroImage(
  ctx: Context,
  next: () => Promise<any>
) {
  const MasterDataClient = ctx.clients.masterdata

  const categoryId = ctx.vtex.route.params.categoryId as string

  const data: Array<{ heroImgUrl: string; heroImgUrlHash: string }> =
    await MasterDataClient.searchDocuments({
      dataEntity: `${DATA_ENTITY_PREFIX}${DATA_ENTITY}`,
      fields: ['heroImgUrl', 'imgUrlHash'],
      where: `(categoryId  = "${categoryId}")`,
      pagination: {
        page: 1,
        pageSize: 1,
      },
      schema: SCHEMA_VERSION,
    })

  // in case data is not found, return 404 status
  if (!data[0]?.heroImgUrl) {
    ctx.status = 404

    await next()
  } else {
    // set cache for 1 year
    ctx.set('cache-control', 'public, max-age=31536000')
    ctx.set('Content-Type', imageType(data[0]?.heroImgUrl))
    ctx.body = imageToReturn(data[0]?.heroImgUrl)

    await next()
  }
}

export async function masterDataCategoryHeroData(
  ctx: Context,
  next: () => Promise<any>
) {
  const MasterDataClient = ctx.clients.masterdata

  const categoryId = ctx.vtex.route.params.categoryId as string
  let data = []

  const fetchData = async (
    whereClause: string,
    pageSize: number,
    retries = 3
  ): Promise<
    Array<{
      heroImgUrl: string
      heroImgUrlHash: string
      heroText: string
    }>
  > => {
    try {
      const result = await MasterDataClient.searchDocuments({
        dataEntity: `${DATA_ENTITY_PREFIX}${DATA_ENTITY}`,
        fields: [
          'categoryId',
          'heroImgUrl',
          'heroImgUrlHash',
          'heroText',
          'imgUrl',
          'imgUrlHash',
          'categoryName',
        ],
        where: whereClause,
        pagination: {
          page: 1,
          pageSize,
        },
        schema: SCHEMA_VERSION,
      })

      // Make sure the result is of the expected type
      if (
        Array.isArray(result) &&
        result.every(
          (item) =>
            'heroImgUrl' in item &&
            'heroImgUrlHash' in item &&
            'heroText' in item
        )
      ) {
        return result
      }

      throw new Error(
        'Unexpected result structure from MasterDataClient.searchDocuments'
      )
    } catch (error) {
      if (retries <= 0)
        throw new Error(
          `Failed to fetch data after 3 attempts: ${error.message}`
        )

      await new Promise((resolve) => setTimeout(resolve, 50))

      // Recursive call
      return fetchData(whereClause, pageSize, retries - 1)
    }
  }

  const categoryIds = categoryId.split(',').map((id) => id.trim())

  // Construct the where clause
  const whereClause = categoryIds
    .map((id) => `categoryId = "${id}"`)
    .join(' OR ')

  const fetchedData: Array<{
    heroImgUrl: string
    heroImgUrlHash: string
    heroText: string
  }> = await fetchData(whereClause, categoryIds.length)

  data = shortenedImages(fetchedData)

  ctx.body = data
  await next()
}

export async function masterDataPutCategoryGrid(
  ctx: Context,
  next: () => Promise<any>
) {
  const reqBody = await json(ctx.req)

  const MasterDataClient = ctx.clients.masterdata

  const data = await MasterDataClient.createDocument({
    dataEntity: `${DATA_ENTITY_PREFIX}${DATA_ENTITY}`,
    fields: reqBody,
    schema: SCHEMA_VERSION,
  })

  ctx.body = data

  await next()
}

export async function masterDataPatchCategoryGrid(
  ctx: Context,
  next: () => Promise<any>
) {
  const categoryId = ctx.vtex.route.params.categoryId as string

  const MasterDataClient = ctx.clients.masterdata

  const reqBody = await json(ctx.req)

  const data = await MasterDataClient.updatePartialDocument({
    dataEntity: `${DATA_ENTITY_PREFIX}${DATA_ENTITY}`,
    id: categoryId,
    fields: reqBody,
    schema: SCHEMA_VERSION,
  })

  ctx.body = data

  await next()
}

export async function masterDataDeleteCategoryGrid(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { masterDataCategories: MasterDataCategoriesClient },
  } = ctx

  //
  const categoryId = ctx.vtex.route.params.categoryId as string

  // TODO June 20, 2022: delete category grid gives 403 error when doing it through VTEX client, but works when doing through our client. Need to investigate, make an issue.
  // const MasterDataClient = ctx.clients.masterdata

  // const data = await MasterDataClient.deleteDocument({
  //   dataEntity: `${DATA_ENTITY_PREFIX}${DATA_ENTITY}`,
  //   id: categoryId,
  // })

  const data = await MasterDataCategoriesClient.deleteCategoryGrid(categoryId)

  ctx.body = data

  await next()
}

//! ------
//! Helpers

const imageToReturn = (base64Image: string) => {
  const [, base64image] = base64Image.split('base64,')

  // if image was not uploaded, return empty string
  const imageBuffer = Buffer.from(base64image, 'base64')

  return imageBuffer
}

// returning only a boolean of strings to make sure image exists, as the image is too large
// images are handled by /_v/mdCategories/img/:categoryId and /_v/mdCategories/heroImg/:categoryId endpoints

const shortenedImages = (data: any) => {
  return data.map((category: any) => {
    return {
      ...category,
      imgUrl: !!category.imgUrl,
      heroImgUrl: !!category.heroImgUrl,
    }
  })
}

const imageType = (image: string) => {
  // image: data:image/jpeg;base64,ADASDAS...
  const [imageTypeString] = image.split(';')
  const contentType = imageTypeString.startsWith('data:image/png')
    ? 'image/png'
    : 'image/jpg'

  return contentType
}
