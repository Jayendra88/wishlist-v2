import React, { useEffect, useState } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import {
  DataGrid,
  DataView,
  DataViewControls,
  Flex,
  FlexSpacer,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  PageActions,
  PageHeader,
  PageTitle,
  Pagination,
  Search,
  useDataGridState,
  useDataViewState,
  useMenuState,
  usePaginationState,
  useSearchState,
  useToast,
} from '@vtex/admin-ui'

import {
  getMDv2CategoryByName,
  deleteCategoryGrid,
} from '../../../utils/masterdata'
import XlsUploadModal from './Elements/XlsUploadModal/XlsUploadModal'
import type { MDv2Category } from '../../../graphqlTypings/masterDataV2'
import { XlsUploadProvider } from './Elements/XlsUploadModal/XlsUploadContext'

const NUMBER_OF_ITEMS = 45
const ITEMS_PER_PAGE = 10

const messages = defineMessages({
  title: {
    id: 'admin/admin-grid-table.title',
  },
  itemId: {
    id: 'admin/admin-grid-table.itemId',
  },
  itemAction: {
    id: 'admin/admin-grid-table.item.action',
  },
  itemActionAriaLabel: {
    id: 'admin/admin-grid-table.item.actions.ariaLabel',
  },
  itemDangerousAction: {
    id: 'admin/admin-grid-table.item.dangerousAction',
  },
})

const AdminGridTable = () => {
  // ------
  // Pull the navigation function from the runtime
  const { navigate } = useRuntime()

  // ------
  // React Intl to retrieve direct strings
  const { formatMessage } = useIntl()

  // ------
  // Create a state for the categories
  const [categoriesWithGrids, setCategoriesWithGrids] = useState<
    MDv2Category[]
  >([])

  // ------
  // Delete
  // handle category delete on button click

  const showToast = useToast()

  const handleCategoryDelete = async (id: string) => {
    try {
      await deleteCategoryGrid(id)

      showToast({
        tone: 'positive',
        message: 'Category deleted successfully',
        dismissible: true,
      })
    } catch (err) {
      console.error(err)

      showToast({
        tone: 'critical',
        message: 'Failed to delete a category, please refresh and try again',
        dismissible: true,
      })
    }
  }

  // ------
  // Datagrid config
  const view = useDataViewState()
  const search = useSearchState()
  const pagination = usePaginationState({
    pageSize: ITEMS_PER_PAGE,
    total: NUMBER_OF_ITEMS,
  })

  const fetchCategories = async ({
    searchQuery,
    currentPage,
    initialFetch,
  }: {
    searchQuery?: string
    currentPage?: number
    initialFetch?: boolean
  }) => {
    try {
      const categoryResponse = await getMDv2CategoryByName(
        searchQuery && searchQuery?.length > 0 ? `${searchQuery}` : 'all',
        currentPage
      )

      if (initialFetch) {
        pagination.paginate({
          type: 'setTotal',
          total: categoryResponse.pagination.total,
        })
      }

      if (!initialFetch) {
        pagination.paginate({
          type: 'navigate',
          page: categoryResponse.pagination.page,
        })
      }

      setCategoriesWithGrids(categoryResponse.data)
    } catch (err) {
      console.error(err)
    }
  }

  // initial fetch on first render/or when search query changes
  useEffect(() => {
    fetchCategories({ searchQuery: search.debouncedValue, initialFetch: true })
  }, [pagination.currentPage === undefined, search.debouncedValue])

  // fetch on page change
  useEffect(() => {
    fetchCategories({
      searchQuery: search.debouncedValue,
      currentPage: pagination.currentPage,
    })
  }, [typeof pagination.currentPage === 'number' && pagination.currentPage])

  const grid = useDataGridState({
    view,
    columns: [
      {
        id: 'categoryName',
        header: 'Category Name',
      },
      {
        id: 'categoryId',
        header: 'Category Id',
      },
      {
        id: 'imgUrl',
        header: 'Category Image',
        resolver: {
          type: 'root',
          render: function Render({ item }) {
            return (
              <Flex>
                <img
                  style={{ maxHeight: '60px' }}
                  src={`/_v/mdCategories/img/${item.imgUrlHash}/${item.categoryId}`}
                  alt={item.categoryName}
                />
              </Flex>
            )
          },
        },
      },

      {
        id: 'menu',
        resolver: {
          type: 'root',
          render: function Render(_props) {
            const state = useMenuState({})

            return (
              <Menu
                state={state}
                onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                  event.stopPropagation()
                }
              >
                <MenuButton
                  display="actions"
                  variant="adaptative-dark"
                  aria-label={formatMessage(messages.itemActionAriaLabel)}
                />
                <MenuList>
                  {/* //TODO: add action */}
                  {/* <MenuItem onClick={() => state.toggle()}> */}
                  {/* <FormattedMessage {...messages.itemAction} /> */}
                  {/* </MenuItem> */}
                  <MenuItem
                    tone="critical"
                    onClick={() => handleCategoryDelete(_props.item.id)}
                  >
                    <FormattedMessage {...messages.itemDangerousAction} />
                  </MenuItem>
                </MenuList>
              </Menu>
            )
          },
        },
      },
    ],
    items: categoriesWithGrids,
    length: ITEMS_PER_PAGE,
    onRowClick: (el: any) => {
      navigate({
        page: 'admin.app.grid-list-detail',
        params: { id: el.id },
      })
    },
  })

  return (
    <>
      <PageHeader>
        <PageTitle>
          <FormattedMessage {...messages.title} />
        </PageTitle>

        <PageActions>
          <XlsUploadProvider>
            <XlsUploadModal />
          </XlsUploadProvider>
        </PageActions>
      </PageHeader>
      <div style={{ padding: '0 4rem' }}>
        <DataView state={view}>
          <DataViewControls>
            <Search id="search" placeholder="Search" state={search} />
            <FlexSpacer />
            <Pagination
              state={pagination}
              preposition="of"
              subject="results"
              prevLabel="Previous"
              nextLabel="Next"
            />
          </DataViewControls>
          <DataGrid state={grid} />
        </DataView>
      </div>
    </>
  )
}

export default AdminGridTable
