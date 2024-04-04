/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseRowStateCellProps,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateRowProps,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from 'react-table'

declare module 'react-table' {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<
    D extends Record<string, unknown>
  > extends UseExpandedOptions<D>,
      UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D>,
      // note that having Record here allows you to add anything to the options, this matches the spirit of the
      // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
      // feature set, this is a safe default.
      Record<string, any> {}

  export interface Hooks<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseExpandedHooks<D>,
      UseGroupByHooks<D>,
      UseRowSelectHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {}

  export interface ColumnInterface<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseFiltersColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D> {}

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Cell<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  export interface Row<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowSelectRowProps<D>,
      UseRowStateRowProps<D> {}
}

// Interfaces created manually
export interface Parent {
  Header: string
  rowSpan: number
  depth: number
  id: string
}

export interface Property {
  name: string
  value: string
}

export interface FixedPricing {
  tradePolicyId: string
  value: number
  listPrice?: any
  minQuantity: number
}

export interface Original {
  name: string
  reference: string
  productId: string
  categoryName: string
  image: string
  link: string
  properties: Property[]
  fixedPricing?: FixedPricing[]
  ABCClassCode: string
  UOM: string
  unitMultiplier: number
}

export interface PreFilteredRow {
  id: string
  original: Original
  index: number
  depth: number
  cells: any[]
  values: any
  originalSubRows: any[]
  subRows: any[]
  allCells: any[]
}

export interface CellRowObject {
  // band-aid solution
  row: PreFilteredRow
}

export interface Column {
  Header: string
  displayNone: boolean
  parent: Parent
  depth: number
  id: string
  width: number
  minWidth: number
  maxWidth: number
  sortType: string
  sortDescFirst: boolean
  canResize: boolean
  originalWidth: number
  isVisible: boolean
  totalVisibleHeaderCount: number
  totalLeft: number
  totalMinWidth: number
  totalWidth: number
  totalMaxWidth: number
  totalFlexWidth: number
  canFilter: boolean
  preFilteredRows: PreFilteredRow[]
  canSort: boolean
  isSorted: boolean
  sortedIndex: number
}

export interface ParentColumn {
  Header: string
  columns: Column[]
  rowSpan: number
  depth: number
  id: string
  parent?: any // not every object has it
  disableSortBy?: boolean
  isSortedDesc?: boolean
  originalId: string
  headers: any[]
  isVisible: boolean
  totalVisibleHeaderCount: number
  totalLeft: number
  totalMinWidth: number
  totalWidth: number
  totalMaxWidth: number
  totalFlexWidth: number
  canSort: boolean
  isSorted: boolean
  sortedIndex: number
}
