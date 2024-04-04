import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import readXlsxFile from 'read-excel-file'
import type { Cell } from 'read-excel-file/types'
import { Button } from '@vtex/admin-ui'
import { useQuery } from 'react-apollo'

import type { Grid } from '../../../../../graphqlTypings/masterDataV2'
import type { SingleProduct } from '../../../../helpers'
import {
  rowsToArray,
  groupedRefs,
  replaceTableHeaders,
  extractCustomNonPronto,
  assignNonProntoProperties,
} from '../../../../helpers'
import { useXlsUploadContext } from './XlsUploadContext'
import productsByRefId from '../../../../../graphql/productsByRefId.graphql'

const messages = defineMessages({
  uploadXls: {
    id: 'admin/admin-grid-table.upload.uploadXls',
  },
})

const UploadHandler: React.FC = () => {
  // ------
  // Context
  const {
    grids: { setGrids },
    tablePreviewData: { setTablePreviewData },
    tablePreviewDataIndex: { setTablePreviewDataIndex },
    listOfGridFiles: { listOfGridFiles, setListOfGridFiles },
    isModalReset: { isModalReset },
  } = useXlsUploadContext()

  // ------
  // State

  const fileUploadRef = useRef<HTMLInputElement>(null)

  const [uploadLoading, setUploadLoading] = useState(false)
  const [arrayOfRefs, setArrayOfRefs] = useState<Cell[]>([])
  const [nonProntoFields, setNonProntoFields] = useState<
    Grid['nonProntoFieldData']
  >([])

  const [headers, setHeaders] = useState<Cell[]>([])
  const [preferredHeaders, setPreferredHeaders] = useState<Cell[]>([])
  const [fileName, setFileName] = useState<string>('')

  const preferredHeadersToSave = useMemo(() => {
    const headersForGrid: Grid['categoryHeaders'] = (headers as string[]).map(
      (header, index: number) => {
        return {
          originalProperty: header,
          replacementProperty: (preferredHeaders as string[])[index],
        }
      }
    )

    return headersForGrid
  }, [headers, preferredHeaders])

  // ------
  const resetFileInput = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.value = ''
    }
  }

  const uploadHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files![0]

      setFileName(file.name)

      readXlsxFile(file).then(async (rows) => {
        // reset
        setArrayOfRefs([])

        // first item is [code], removed it
        setHeaders([...rows[0].slice(1)])

        const preferredPresent = rows[1][0] === '[preferred headers]'
        // preferred headers come in a second row

        // first item is [preferred headers], removed it
        preferredPresent
          ? setPreferredHeaders([...rows[1].slice(1)])
          : setPreferredHeaders([])

        setNonProntoFields(extractCustomNonPronto(rows, preferredPresent))

        setArrayOfRefs(rowsToArray(rows, preferredPresent))
      })

      // reset file input
      resetFileInput()
    },
    []
  )

  const updateTablePreviewData = useCallback(
    (data: SingleProduct[], gridToSave: Grid): void => {
      const updatedListOfGridFiles = [
        ...listOfGridFiles,
        {
          fileName,
          categoryData: data,
          gridToSave,
        },
      ]

      setListOfGridFiles(updatedListOfGridFiles)

      setTablePreviewData(data)

      setTablePreviewDataIndex(updatedListOfGridFiles.length - 1)

      const flatCategories = updatedListOfGridFiles.flatMap(
        (grid) => grid.gridToSave
      )

      setGrids(flatCategories)
    },
    [
      fileName,
      listOfGridFiles,
      setGrids,
      setListOfGridFiles,
      setTablePreviewData,
      setTablePreviewDataIndex,
    ]
  )

  // ------
  // Get the products by refId using graphql
  const {
    data: refData,
    loading: refLoading,
    error: refError,
  } = useQuery(productsByRefId, {
    variables: {
      refIds: [arrayOfRefs.map(String)],
    },

    // The query will not execute until category is fetched
    skip: !arrayOfRefs.length,
  })

  if (refLoading) {
    if (!uploadLoading) setUploadLoading(true)
  }

  if (refError) {
    console.error(refError)
    setUploadLoading(false)
  }

  useEffect(() => {
    if (refData && arrayOfRefs?.length) {
      setUploadLoading(false)

      const productsWithReplacedHeaders = refData.productsByRefId.map(
        (group: SingleProduct[]) => {
          return replaceTableHeaders(preferredHeadersToSave, group)
        }
      )

      const refsGroupedIntoCategory = groupedRefs(
        productsWithReplacedHeaders[0],
        preferredHeadersToSave,
        nonProntoFields
      )

      const productsWithNonProntoPropertiesAssigned = assignNonProntoProperties(
        productsWithReplacedHeaders[0],
        nonProntoFields
      )

      updateTablePreviewData(
        productsWithNonProntoPropertiesAssigned,
        refsGroupedIntoCategory
      )
    }
  }, [arrayOfRefs?.length, refData])

  useEffect(() => {
    if (isModalReset) {
      resetFileInput()
    }
  }, [isModalReset])

  return (
    <Button
      loading={uploadLoading}
      onClick={() => {
        fileUploadRef.current?.click()
      }}
    >
      <FormattedMessage {...messages.uploadXls} />
      <input
        type="file"
        ref={fileUploadRef}
        style={{ display: 'hidden' }}
        onChange={uploadHandler}
        hidden
      />
    </Button>
  )
}

export default UploadHandler
