import React, { useContext, useState } from 'react'

import type { Grid } from '../../../../../graphqlTypings/masterDataV2'
import type { SingleProduct } from '../../../../helpers'

export interface ListOfGridFilesItem {
  fileName: string
  categoryData: SingleProduct[]
  gridToSave: Grid
}

interface UploadContext {
  categoryId: { categoryId: string; setCategoryId: (value: string) => void }
  categoryName: {
    categoryName: string
    setCategoryName: (value: string) => void
  }
  imgUrl: { imgUrl: string; setImgUrl: (value: string) => void }
  imgUrlHash: { imgUrlHash: string; setImgUrlHash: (value: string) => void }
  heroImgUrl: { heroImgUrl: string; setHeroImgUrl: (value: string) => void }
  heroImgUrlHash: {
    heroImgUrlHash: string
    setHeroImgUrlHash: (value: string) => void
  }
  heroText: { heroText: string; setHeroText: (value: string) => void }
  grids: { grids: any[]; setGrids: (value: any) => void }

  // ----- Preview
  tablePreviewData: {
    tablePreviewData: SingleProduct[]
    setTablePreviewData: (value: SingleProduct[]) => void
  }
  tablePreviewDataIndex: {
    tablePreviewDataIndex: number
    setTablePreviewDataIndex: (value: number) => void
  }
  listOfGridFiles: {
    listOfGridFiles: ListOfGridFilesItem[]
    setListOfGridFiles: (value: ListOfGridFilesItem[]) => void
  }
  isModalReset: {
    isModalReset: boolean
    updateIsModalReset: (value: boolean) => void
  }
}

const XlsUploadContext = React.createContext<UploadContext>({
  // ----- Upload
  categoryId: { categoryId: '', setCategoryId: () => {} },
  categoryName: { categoryName: '', setCategoryName: () => {} },
  imgUrl: { imgUrl: '', setImgUrl: () => {} },
  imgUrlHash: { imgUrlHash: '', setImgUrlHash: () => {} },
  heroImgUrl: { heroImgUrl: '', setHeroImgUrl: () => {} },
  heroImgUrlHash: { heroImgUrlHash: '', setHeroImgUrlHash: () => {} },
  heroText: { heroText: '', setHeroText: () => {} },
  grids: { grids: [], setGrids: () => {} },

  // ----- Preview
  tablePreviewData: { tablePreviewData: [], setTablePreviewData: () => {} },
  tablePreviewDataIndex: {
    tablePreviewDataIndex: 0,
    setTablePreviewDataIndex: () => {},
  },
  listOfGridFiles: { listOfGridFiles: [], setListOfGridFiles: () => {} },
  isModalReset: { isModalReset: false, updateIsModalReset: () => {} },
})

type Props = {
  children: React.ReactNode
}

export const useXlsUploadContext = () => useContext(XlsUploadContext)

export const updateProductsContext = (values = {}) => ({ products: values })

export const XlsUploadProvider: React.FC<Props> = ({ children }) => {
  const [categoryId, setCategoryId] = useState<string>('')
  const [categoryName, setCategoryName] = useState<string>('')
  const [imgUrl, setImgUrl] = useState<string>('')
  const [imgUrlHash, setImgUrlHash] = useState<string>('')
  const [heroImgUrl, setHeroImgUrl] = useState<string>('')
  const [heroImgUrlHash, setHeroImgUrlHash] = useState<string>('')
  const [heroText, setHeroText] = useState<string>('')
  const [grids, setGrids] = useState<any>('')

  const [tablePreviewData, setTablePreviewData] = useState<any>({})
  const [tablePreviewDataIndex, setTablePreviewDataIndex] = useState<number>(0)
  const [listOfGridFiles, setListOfGridFiles] = useState<any>([])
  const [isModalReset, setIsModalReset] = useState<boolean>(false)

  const updateIsModalReset = (isModalResetToggled: boolean) => {
    if (!isModalResetToggled) return
    setCategoryId('')
    setCategoryName('')
    setImgUrl('')
    setImgUrlHash('')
    setHeroImgUrl('')
    setHeroImgUrlHash('')
    setHeroText('')
    setGrids([])
    setTablePreviewData([])
    setTablePreviewDataIndex(0)
    setListOfGridFiles([])
    setIsModalReset(false)
  }

  const providerValue = {
    categoryId: { categoryId, setCategoryId },
    categoryName: { categoryName, setCategoryName },
    imgUrl: { imgUrl, setImgUrl },
    imgUrlHash: { imgUrlHash, setImgUrlHash },
    heroImgUrl: { heroImgUrl, setHeroImgUrl },
    heroImgUrlHash: { heroImgUrlHash, setHeroImgUrlHash },
    heroText: { heroText, setHeroText },
    grids: { grids, setGrids },

    tablePreviewData: { tablePreviewData, setTablePreviewData },
    tablePreviewDataIndex: { tablePreviewDataIndex, setTablePreviewDataIndex },
    listOfGridFiles: { listOfGridFiles, setListOfGridFiles },
    isModalReset: { isModalReset, updateIsModalReset },
  }

  return (
    <XlsUploadContext.Provider value={providerValue}>
      {children}
    </XlsUploadContext.Provider>
  )
}
