export interface CategoryHeader {
  originalProperty: string
  replacementProperty: string
}

export interface Grid {
  categoryName: string
  categoryFooter: string
  categoryHeaders: CategoryHeader[]
  productList: string[]
  nonProntoFieldData: NonProntoFieldData[]
}

export interface MDv2Category {
  id: string
  categoryId: string
  categoryName: string
  imgUrl: string
  imgUrlHash: string
  heroImgUrl: string
  heroImgUrlHash: string
  heroText: string
  grids: Grid[]
}

interface NonProntoFieldData extends CategoryHeader {
  values: string[]
}
