import axios from 'axios'

import type { MDv2Category } from '../graphqlTypings/masterDataV2'

export type Category = {
  id: number
  categories: string[]
}

interface MDv2CategoryWithPagination {
  data: MDv2Category[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export const getMDv2CategoryById = async (
  categoryId?: string
): Promise<MDv2Category[]> => {
  try {
    const response = await axios.get<MDv2Category[]>(
      `/_v/mdCategories/${categoryId}`
    )

    return response.data
  } catch (err) {
    return err
  }
}

export const getMDv2CategoryByName = async (
  categoryName?: string,
  pageNumber?: number
): Promise<MDv2CategoryWithPagination> => {
  try {
    const response = await axios.get<MDv2CategoryWithPagination>(
      `/_v/mdCategoriesByName/${categoryName}/${pageNumber ?? 1}`
    )

    return response.data
  } catch (err) {
    return err
  }
}

export const patchCategoryGrid = async (
  categoryId: string,
  requestBody: Partial<MDv2Category>
) => {
  try {
    const response = await axios.patch<[]>(
      `/_v/mdCategories/${categoryId}`,
      requestBody
    )

    return response.data
  } catch (err) {
    return err
  }
}

export const deleteCategoryGrid = async (idToDelete: string) => {
  try {
    const response = await axios.delete<[]>(`/_v/mdCategories/${idToDelete}`)

    return response.data
  } catch (err) {
    return err
  }
}

export const getHeroData = async (categoryId: string) => {
  try {
    const response = await axios.get<[]>(`/_v/mdCategories/hero/${categoryId}`)

    return response.data
  } catch (err) {
    return err
  }
}

export const saveCategoryGrid = async (requestBody?: string) => {
  try {
    const response = await axios.put<[]>(`/_v/mdCategoriesSave`, requestBody)

    return response.data
  } catch (err) {
    return err
  }
}
