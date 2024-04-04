import MarkdownIt from 'markdown-it'
import MarkdownItColor from 'markdown-it-color'
import React, { useEffect, useMemo } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import TurndownService from 'turndown'
import {
  Box,
  Button,
  Center,
  Divider,
  Modal,
  ModalContent,
  ModalDisclosure,
  ModalFooter,
  ModalHeader,
  Text,
  TextArea,
  useModalState,
  useToast,
} from '@vtex/admin-ui'

import {
  saveCategoryGrid,
  patchCategoryGrid,
} from '../../../../../utils/masterdata'
import ProductTableWrapper from '../../../../ProductTable/ProductTableWrapper'
import Base64Uploader from '../Base64Uploader/Base64Uploader'
import CategoryListDropdown from '../CategoryListDropdown/CategoryListDropdown'
import UploadFilesListItem from './Elements/UploadFilesListItem'
import styles from './styles.css'
import UploadHandler from './UploadHandler'
import { useXlsUploadContext } from './XlsUploadContext'
import HeroCard from '../../../../SubcategoryHero/Elements/HeroCard'
import type { MDv2Category } from '../../../../../graphqlTypings/masterDataV2'
import type { SingleProduct } from '../../../../helpers'

const messages = defineMessages({
  modalTrigger: {
    id: 'admin/admin-grid-table.create.modalTrigger',
  },
  modalTriggerUpdate: {
    id: 'admin/admin-grid-table.update.modalTrigger',
  },
  modalHeader: {
    id: 'admin/admin-grid-table.create.modalHeader',
  },
  modalHeaderUpdate: {
    id: 'admin/admin-grid-table.update.modalHeader',
  },
  cancel: {
    id: 'admin/admin-grid-table.create.cancel',
  },
  confirm: {
    id: 'admin/admin-grid-table.create.confirm',
  },
  confirmUpdate: {
    id: 'admin/admin-grid-table.update.confirm',
  },
  categorySaved: {
    id: 'admin/admin-grid-table.create.confirmMessage',
  },
  categoryPatched: {
    id: 'admin/admin-grid-table.update.confirmMessage',
  },
  categoryPatchFailed: {
    id: 'admin/admin-grid-table.update.failedMessage',
  },
  categoryPatchFailedTooLarge: {
    id: 'admin/admin-grid-table.update.failedTooLarge',
  },
  categorySaveFail: {
    id: 'admin/admin-grid-table.create.categorySaveFail',
  },
  categorySaveFailTooLarge: {
    id: 'admin/admin-grid-table.create.categorySaveFailTooLarge',
  },
  categoryPatchFail: {
    id: 'admin/admin-grid-table.update.categoryUpdateFail',
  },
})

const markdownParser = new MarkdownIt().use(MarkdownItColor, {
  inline: true,
})

const turndownService = new TurndownService()

interface XlsUploadModalProps {
  categoryToUpdate?: MDv2Category
  categoryToUpdateProducts?: SingleProduct[][]
}

const XlsUploadModal: React.FC<XlsUploadModalProps> = ({
  categoryToUpdate,
  categoryToUpdateProducts,
}) => {
  const runtime = useRuntime()

  // if id is present, we are editing a category
  const categoryIdFromParams = useMemo(() => {
    return runtime.route.params.id
  }, [runtime.route.params.id])

  // -----
  // Context
  const {
    imgUrl: { imgUrl, setImgUrl },
    imgUrlHash: { imgUrlHash, setImgUrlHash },
    heroImgUrl: { heroImgUrl, setHeroImgUrl },
    heroImgUrlHash: { heroImgUrlHash, setHeroImgUrlHash },
    categoryId: { categoryId, setCategoryId },
    categoryName: { categoryName, setCategoryName },
    heroText: { heroText, setHeroText },
    grids: { grids, setGrids },
    tablePreviewDataIndex: { tablePreviewDataIndex, setTablePreviewDataIndex },
    listOfGridFiles: { listOfGridFiles, setListOfGridFiles },
    tablePreviewData: { tablePreviewData, setTablePreviewData },
    isModalReset: { updateIsModalReset },
  } = useXlsUploadContext()

  // if updating category, add all data to context first
  useEffect(() => {
    if (categoryIdFromParams && categoryToUpdate) {
      setImgUrl(categoryToUpdate.heroImgUrl)
      setImgUrlHash(categoryToUpdate.imgUrlHash)
      setHeroImgUrl(categoryToUpdate.heroImgUrl)
      setHeroImgUrlHash(categoryToUpdate.heroImgUrlHash)
      setCategoryId(categoryIdFromParams)
      setCategoryName(categoryToUpdate.categoryName)
      setHeroText(turndownService.turndown(categoryToUpdate.heroText))
      setGrids(categoryToUpdate.grids)

      // if grids are available
      if (categoryToUpdate.grids.length > 0 && categoryToUpdateProducts) {
        setListOfGridFiles(
          categoryToUpdate.grids.map((grid: any, index: number) => ({
            fileName: `File ${index + 1}`,
            categoryData: categoryToUpdateProducts![index],
            gridToSave: grid,
          }))
        )

        setTablePreviewData(categoryToUpdateProducts[0])
        setTablePreviewDataIndex(0)
      }
    }
  }, [
    categoryIdFromParams,
    categoryToUpdate,
    categoryToUpdateProducts,
    setCategoryId,
    setCategoryName,
    setGrids,
    setHeroImgUrl,
    setHeroImgUrlHash,
    setHeroText,
    setImgUrl,
    setImgUrlHash,
    setListOfGridFiles,
    setTablePreviewData,
    setTablePreviewDataIndex,
  ])

  // ------
  // React Intl to retrieve direct strings
  const { formatMessage } = useIntl()

  // ------
  // Modal related configs
  const modal = useModalState()

  // ------
  // Toast related config
  const showToast = useToast()

  // ------

  const modalHandlerClose = (): void => {
    modal.hide()
    // reset if modal is for creation a new category modal
    if (!categoryIdFromParams) {
      updateIsModalReset(true)
    }
  }

  const modalHandlerConfirm = async (): Promise<void> => {
    if (
      (imgUrlHash.length > 0, categoryId.length > 0, categoryName.length > 0)
    ) {
      try {
        await saveCategoryGrid(
          JSON.stringify({
            id: `${categoryId}`,
            categoryId,
            categoryName,
            imgUrl,
            imgUrlHash,
            // Hero image is not required
            heroImgUrl,
            heroImgUrlHash,
            // parse markdown string to html
            heroText: heroText ? markdownParser.render(heroText) : '',
            grids: grids.length > 0 ? grids : [],
          })
        )

        showToast({
          tone: 'positive',
          message: formatMessage(messages.categorySaved),
          dismissible: true,
        })
      } catch (error) {
        console.error(error)
        if (error.response && error.response.status === 408) {
          showToast({
            tone: 'warning',
            message: formatMessage(messages.categorySaveFailTooLarge),
            dismissible: true,
          })
        } else {
          showToast({
            tone: 'warning',
            message: formatMessage(messages.categorySaveFail),
            dismissible: true,
          })
        }
      } finally {
        modalHandlerClose()
      }
    }
  }

  const patchCategory = async () => {
    try {
      await patchCategoryGrid(categoryId, {
        id: `${categoryId}`,
        categoryId,
        categoryName,
        // only update images if they were changed
        ...(typeof imgUrl === 'string' && { imgUrl }),
        ...(typeof imgUrl === 'string' && { imgUrlHash }),
        ...(typeof heroImgUrl === 'string' && { heroImgUrl }),
        ...(typeof heroImgUrl === 'string' && { heroImgUrlHash }),
        heroText: markdownParser.render(heroText), // parse markdown string to html
        grids: grids.length > 0 ? grids : [],
      })

      showToast({
        tone: 'positive',
        message: formatMessage(messages.categoryPatched),
        dismissible: true,
      })
    } catch (error) {
      showToast({
        tone: 'warning',
        message: formatMessage(messages.categoryPatchFail),
        dismissible: true,
      })
      console.error(error)
      if (error.response && error.response.status === 408) {
        showToast({
          tone: 'warning',
          message: formatMessage(messages.categoryPatchFailedTooLarge),
          dismissible: true,
        })
      } else {
        showToast({
          tone: 'warning',
          message: formatMessage(messages.categoryPatchFail),
          dismissible: true,
        })
      }
    } finally {
      modalHandlerClose()
    }
  }

  const [currentGrid, setCurrentGrid] = React.useState<any>([])

  useEffect(() => {
    setCurrentGrid(grids[tablePreviewDataIndex])
  }, [grids, tablePreviewDataIndex])

  return (
    <div>
      <ModalDisclosure state={modal}>
        <Button>
          <FormattedMessage
            id={
              categoryIdFromParams
                ? messages.modalTriggerUpdate.id
                : messages.modalTrigger.id
            }
          />
        </Button>
      </ModalDisclosure>
      <Modal
        aria-label="Product creation modal"
        size="large"
        state={modal}
        onClose={modalHandlerClose}
      >
        <ModalHeader
          title={
            categoryIdFromParams
              ? formatMessage(messages.modalHeaderUpdate)
              : formatMessage(messages.modalHeader)
          }
        />
        <ModalContent>
          <Base64Uploader
            buttonText="Category Image Upload"
            isHeroImage={false}
            categoryIdFromParams={categoryIdFromParams}
          />
          <Base64Uploader
            buttonText="Hero Image Upload"
            isHeroImage
            categoryIdFromParams={categoryIdFromParams}
          />
          <TextArea
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            id="heroText"
            label="Hero Text"
            helperText="Please provide valid markdown"
            charLimit={750}
          />

          <HeroCard
            category={{
              categoryId,
              categoryTitle: categoryName,
              heroImgPreview: !categoryIdFromParams
                ? heroImgUrl || imgUrl
                : undefined,
              categoryImageHash: imgUrlHash,
              heroImageHash: heroImgUrlHash,
              previewText: heroText,
            }}
          />
          <Box>
            {listOfGridFiles.map((grid, index) => {
              return (
                <UploadFilesListItem
                  grid={grid}
                  gridIndex={index}
                  key={grid.fileName}
                />
              )
            })}
          </Box>
          <Divider csx={{ marginY: 6 }} />
          <Box className={styles['preview-table']}>
            {tablePreviewData && tablePreviewData.length > 0 ? (
              <ProductTableWrapper
                categoryData={tablePreviewData}
                categoryHeader={currentGrid?.categoryName}
                categoryFooter={currentGrid?.categoryFooter}
              />
            ) : (
              <Center>
                <Text tone="primary" variant="title2">
                  Preview table will appear here
                </Text>
              </Center>
            )}
          </Box>
        </ModalContent>
        <ModalFooter csx={{ zIndex: '3' }}>
          <CategoryListDropdown />
          <Button onClick={() => modalHandlerClose()} variant="secondary">
            <FormattedMessage {...messages.cancel} />
          </Button>
          <UploadHandler />
          {categoryIdFromParams ? (
            <Button onClick={() => patchCategory()}>
              <FormattedMessage {...messages.confirmUpdate} />
            </Button>
          ) : (
            <Button onClick={() => modalHandlerConfirm()}>
              <FormattedMessage {...messages.confirm} />
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default XlsUploadModal
