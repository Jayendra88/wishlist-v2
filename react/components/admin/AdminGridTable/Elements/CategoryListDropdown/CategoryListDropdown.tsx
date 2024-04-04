import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { Select, Spinner, useToast } from '@vtex/admin-ui'
import sortBy from 'lodash/sortBy'
import { useRuntime } from 'vtex.render-runtime'

import { useXlsUploadContext } from '../XlsUploadModal/XlsUploadContext'

export interface Child {
  id: number
  name: string
  hasChildren: boolean
  url: string
  children: any[]
  Title: string
  MetaTagDescription: string
}

export interface CategoryTreeItem {
  id: number
  name: string
  hasChildren: boolean
  url: string
  children: Child[]
  Title: string
  MetaTagDescription: string
}

const categoryLoop = (
  category: CategoryTreeItem,
  parentCategoryName: string
): CategoryTreeItem[] => {
  if (category && category.children.length > 0) {
    // return parent category, in order to add images using grid builder
    return [
      { ...category },
      ...category.children.flatMap((child) =>
        categoryLoop(child, parentCategoryName)
      ),
    ]
  }

  return [category]
}

const CategoryListDropdown: React.FC = () => {
  // -----
  // Context
  const {
    categoryId: { categoryId, setCategoryId: setCategoryIdContext },
    categoryName: { setCategoryName: setCategoryNameContext },
  } = useXlsUploadContext()

  // ------
  // Toast related config
  const showToast = useToast()

  const [categoryTree, setCategoryTree] = useState<CategoryTreeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runtime = useRuntime()

  const categoryIdFromParams = useMemo(() => {
    return runtime.route.params.id
  }, [runtime.route.params.id])

  // call to get a category tree
  const fetchCategoryTree = async () => {
    try {
      setLoading(true)

      const url = `/api/catalog_system/pub/category/tree/99`

      const { data } = await axios.get(url)

      return setCategoryTree(data)
    } catch (err) {
      setError(err)

      return [{ id: 0, name: 'Error' }]
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryTree()
  }, [categoryIdFromParams])

  const sortedCategories = useMemo(() => {
    // flatten the tree to a list of categories
    const flatCategoryList = categoryTree.flatMap((category) => {
      return categoryLoop(category, category.name)
    })

    const sortedList = sortBy(flatCategoryList, 'name')

    return sortedList
  }, [categoryTree])

  useEffect(() => {
    if (sortedCategories.length > 0) {
      // find the category that matches the id from the url
      const selectedCategory = sortedCategories.find(
        (localCategory) => localCategory.id === Number(categoryIdFromParams)
      )

      // on initial load, set the value to the first category
      setCategoryIdContext(selectedCategory?.id.toString() ?? '0')
      setCategoryNameContext(selectedCategory?.name ?? '')
    } else {
      setCategoryIdContext('0')
    }
  }, [sortedCategories, categoryIdFromParams])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const currentCategory = sortedCategories.find(
      (category) => category.id === parseInt(event.target.value, 10)
    )

    setCategoryIdContext(event.target.value)
    setCategoryNameContext(currentCategory?.name ?? 'error')
  }

  if (loading) {
    return <Spinner />
  }

  if (error) {
    showToast({
      tone: 'critical',
      message: 'Failed to load categories, please refresh and try again',
      dismissible: true,
    })

    return (
      <Select label="Category" value={categoryId} disabled>
        <option value={0}>Error</option>
      </Select>
    )
  }

  return (
    <Select label="Category" value={categoryId} onChange={handleChange}>
      {sortedCategories?.map((category) => {
        return (
          <option key={category.id} value={category.id}>
            {category.name} - {category.id}
          </option>
        )
      })}
    </Select>
  )
}

export default CategoryListDropdown
