import React, { useState, useEffect } from 'react'
import {
  Button,
  IconTrash,
  IconMagnifyingGlass,
  Flex,
  FlexSpacer,
  Text,
  Input,
} from '@vtex/admin-ui'

import type { ListOfGridFilesItem } from '../XlsUploadContext'
import { useXlsUploadContext } from '../XlsUploadContext'

interface UploadFilesProps {
  grid: ListOfGridFilesItem
  gridIndex: number
}

const UploadFilesListItem: React.FC<UploadFilesProps> = ({
  grid,
  gridIndex,
}) => {
  // ------
  // Context
  const {
    grids: { grids, setGrids },
    listOfGridFiles: { listOfGridFiles, setListOfGridFiles },
    tablePreviewData: { setTablePreviewData },
    tablePreviewDataIndex: { setTablePreviewDataIndex },
  } = useXlsUploadContext()

  // ------
  // State
  const [gridHeaderText, setGridHeaderText] = useState('')
  const [gridFooterText, setGridFooterText] = useState('')

  // ------
  // Initialize header/footer text
  useEffect(() => {
    if (grids.length > 0) {
      setGridHeaderText(grids[gridIndex]?.categoryName || '')
      setGridFooterText(grids[gridIndex]?.categoryFooter || '')
    }
  }, [gridIndex, grids])

  const handleCategoryDelete = (index: number): void => {
    // delete item from a listOfGridFiles by provided gridIndex
    const newListOfGridFiles = [...listOfGridFiles]
    const newGrids = [...grids]

    newListOfGridFiles.splice(index, 1)
    newGrids.splice(index, 1)

    setListOfGridFiles(newListOfGridFiles)
    setGrids(newGrids)

    // set the last grid in the list as the active grid
    setTablePreviewData(
      listOfGridFiles[listOfGridFiles.length - 1].categoryData
    )
    setTablePreviewDataIndex(listOfGridFiles.length - 1)
  }

  const handleCategoryPreview = (index: number): void => {
    setTablePreviewData(listOfGridFiles[index].categoryData)
    setTablePreviewDataIndex(index)
  }

  const updateGridHeaderText = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newGrids = [...grids]

    // replace grid categoryName at provided gridIndex
    newGrids[gridIndex].categoryName = e.target.value

    setGrids(newGrids)
    setGridHeaderText(e.target.value)
  }

  const updateGridFooterText = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newGrids = [...grids]

    // replace grid categoryName at provided gridIndex
    newGrids[gridIndex].categoryFooter = e.target.value

    setGrids(newGrids)
    setGridFooterText(e.target.value)
  }

  return (
    <Flex align="center">
      <Text csx={{ width: '120px' }}>{grid.fileName}</Text>
      <FlexSpacer />
      <Flex direction="column" grow={10}>
        <Input
          value={gridHeaderText}
          onChange={updateGridHeaderText}
          id="gridHeaderText"
          label="Grid Header Text"
        />
        <Input
          value={gridFooterText}
          onChange={updateGridFooterText}
          id="gridHeaderText"
          label="Grid Footer Text"
        />
      </Flex>
      <FlexSpacer />
      <Button onClick={() => handleCategoryPreview(gridIndex)}>
        Preview <IconMagnifyingGlass />
      </Button>
      <FlexSpacer />
      <Button
        onClick={() => handleCategoryDelete(gridIndex)}
        icon={<IconTrash title="Delete file" aria-label="Delete file" />}
      />
    </Flex>
  )
}

export default UploadFilesListItem
