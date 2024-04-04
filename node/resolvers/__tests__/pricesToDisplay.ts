import { pricesToDisplay } from '../fixedPrices'

import type { FixedPrice } from '../../../react/typings/product'

// Stub the Date object with a fixed past date
const stubbedDate = new Date('2022-01-15')
const originalDate = global.Date

global.Date = jest.fn((arg) =>
  arg ? new originalDate(arg) : stubbedDate
) as unknown as DateConstructor

afterAll(() => {
  // Restore the original Date object in cleanup
  global.Date = originalDate
})

describe('pricesToDisplay function', () => {
  it('should correctly reduce and sort price tables', () => {
    const inputPrices: FixedPrice[] = [
      { tradePolicyId: '1', value: 1.17, listPrice: null, minQuantity: 1 },
      {
        tradePolicyId: '1',
        value: 1.17,
        listPrice: null,
        minQuantity: 125,
      },
      {
        tradePolicyId: '1',
        value: 1.17,
        listPrice: null,
        minQuantity: 250,
      },
      {
        tradePolicyId: '1',
        value: 1.17,
        listPrice: null,
        minQuantity: 500,
      },
      {
        tradePolicyId: '1',
        value: 1.17,
        listPrice: null,
        minQuantity: 750,
      },
      {
        tradePolicyId: '1',
        value: 1.15,
        listPrice: 1.17,
        minQuantity: 1,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2076-12-05T00:00:00Z' }, // valid date range
      },
      {
        tradePolicyId: '1',
        value: 1.15,
        listPrice: 1.17,
        minQuantity: 1,
        dateRange: { from: '2021-01-01T00:00:00Z', to: '2021-12-05T00:00:00Z' }, // expired date range
      },
      {
        tradePolicyId: '1',
        value: 1.3,
        listPrice: null,
        minQuantity: 1,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2022-12-31T00:00:00Z' }, // valid range, but price is higher than the one in the valid range above
      },
      {
        tradePolicyId: '2',
        value: 1.25,
        listPrice: null,
        minQuantity: 100,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2022-12-31T00:00:00Z' },
      },
      {
        tradePolicyId: '3',
        value: 1.2,
        listPrice: null,
        minQuantity: 1,
        dateRange: { from: '2023-01-01T00:00:00Z', to: '2023-12-31T00:00:00Z' },
      },
      {
        tradePolicyId: '3',
        value: 1.14,
        listPrice: null,
        minQuantity: 100,
        dateRange: { from: '2023-01-01T00:00:00Z', to: '2023-12-31T00:00:00Z' },
      },
    ]

    const expectedOutput: FixedPrice[] = [
      {
        tradePolicyId: '1',
        value: 1.15,
        listPrice: 1.17,
        minQuantity: 1,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2076-12-05T00:00:00Z' },
      },
      {
        tradePolicyId: '1',
        value: 1.15,
        listPrice: null,
        minQuantity: 125,
      },
      {
        tradePolicyId: '1',
        value: 1.15,
        listPrice: null,
        minQuantity: 250,
      },
      {
        tradePolicyId: '1',
        value: 1.15,
        listPrice: null,
        minQuantity: 500,
      },
      {
        tradePolicyId: '1',
        value: 1.15,
        listPrice: null,
        minQuantity: 750,
      },
    ]

    expect(pricesToDisplay(inputPrices, ['1'], stubbedDate)).toEqual(
      expectedOutput
    )
  })

  it('should handle empty input', () => {
    const inputPrices: FixedPrice[] = []
    const expectedOutput: FixedPrice[] = []

    expect(pricesToDisplay(inputPrices, ['1'], stubbedDate)).toEqual(
      expectedOutput
    )
  })

  it('should correctly handle multiple trade policies with valid date ranges', () => {
    const inputPrices = [
      {
        tradePolicyId: '1',
        value: 1.1,
        listPrice: null,
        minQuantity: 1,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-01-01T00:00:00Z' },
      },
      {
        tradePolicyId: '2',
        value: 1.2,
        listPrice: null,
        minQuantity: 50,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-01-01T00:00:00Z' },
      },
      {
        tradePolicyId: '1',
        value: 1.15,
        listPrice: null,
        minQuantity: 100,
        dateRange: { from: '2022-02-01T00:00:00Z', to: '2023-02-01T00:00:00Z' },
      },
      {
        tradePolicyId: '3',
        value: 1.25,
        listPrice: null,
        minQuantity: 1,
        dateRange: { from: '2022-01-15T00:00:00Z', to: '2023-01-15T00:00:00Z' },
      },
      {
        tradePolicyId: '2',
        value: 1.3,
        listPrice: null,
        minQuantity: 200,
        dateRange: { from: '2022-03-01T00:00:00Z', to: '2023-03-01T00:00:00Z' },
      },
      {
        tradePolicyId: '1',
        value: 1.05,
        listPrice: null,
        minQuantity: 500,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-01-01T00:00:00Z' },
      },
      {
        tradePolicyId: '3',
        value: 1.35,
        listPrice: null,
        minQuantity: 250,
        dateRange: { from: '2022-04-01T00:00:00Z', to: '2023-04-01T00:00:00Z' },
      },
      {
        tradePolicyId: '2',
        value: 1.4,
        listPrice: null,
        minQuantity: 750,
        dateRange: { from: '2022-05-01T00:00:00Z', to: '2023-05-01T00:00:00Z' },
      },
      {
        tradePolicyId: '1',
        value: 1.0,
        listPrice: null,
        minQuantity: 1000,
        dateRange: { from: '2022-06-01T00:00:00Z', to: '2023-06-01T00:00:00Z' },
      },
      {
        tradePolicyId: '3',
        value: 1.5,
        listPrice: null,
        minQuantity: 1500,
        dateRange: { from: '2022-07-01T00:00:00Z', to: '2023-07-01T00:00:00Z' },
      },
    ]

    const expectedOutput = [
      {
        tradePolicyId: '1',
        value: 1.1,
        listPrice: null,
        minQuantity: 1,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-01-01T00:00:00Z' },
      },
      {
        tradePolicyId: '2',
        value: 1.1,
        listPrice: null,
        minQuantity: 50,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-01-01T00:00:00Z' },
      },
      {
        tradePolicyId: '1',
        value: 1.05,
        listPrice: null,
        minQuantity: 500,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-01-01T00:00:00Z' },
      },
    ]

    expect(pricesToDisplay(inputPrices, ['1', '2', '3'], stubbedDate)).toEqual(
      expectedOutput
    )
  })

  it('should handle overlapping date ranges across different trade policies', () => {
    const inputPrices = [
      {
        tradePolicyId: '1',
        value: 1.1,
        listPrice: null,
        minQuantity: 1,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-01-01T00:00:00Z' },
      },
      {
        tradePolicyId: '1',
        value: 1.15,
        listPrice: null,
        minQuantity: 100,
        dateRange: { from: '2022-06-01T00:00:00Z', to: '2023-06-01T00:00:00Z' },
      },
      {
        tradePolicyId: '2',
        value: 1.2,
        listPrice: null,
        minQuantity: 50,
        dateRange: { from: '2022-03-01T00:00:00Z', to: '2023-03-01T00:00:00Z' },
      },
      {
        tradePolicyId: '2',
        value: 1.25,
        listPrice: null,
        minQuantity: 200,
        dateRange: { from: '2022-05-01T00:00:00Z', to: '2023-05-01T00:00:00Z' },
      },
      {
        tradePolicyId: '3',
        value: 1.3,
        listPrice: null,
        minQuantity: 1,
        dateRange: { from: '2022-02-01T00:00:00Z', to: '2023-02-01T00:00:00Z' },
      },
      {
        tradePolicyId: '3',
        value: 1.35,
        listPrice: null,
        minQuantity: 250,
        dateRange: { from: '2022-04-01T00:00:00Z', to: '2023-04-01T00:00:00Z' },
      },
      {
        tradePolicyId: '1',
        value: 1.05,
        listPrice: null,
        minQuantity: 500,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2022-12-31T00:00:00Z' },
      },
      {
        tradePolicyId: '2',
        value: 1.4,
        listPrice: null,
        minQuantity: 750,
        dateRange: { from: '2022-06-01T00:00:00Z', to: '2023-06-01T00:00:00Z' },
      },
      {
        tradePolicyId: '3',
        value: 1.02,
        listPrice: null,
        minQuantity: 50,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-07-01T00:00:00Z' },
      },
      {
        tradePolicyId: '1',
        value: 1.0,
        listPrice: null,
        minQuantity: 1500,
        dateRange: { from: '2022-08-01T00:00:00Z', to: '2023-08-01T00:00:00Z' },
      },
    ]

    const expectedOutput = [
      {
        tradePolicyId: '1',
        value: 1.1,
        listPrice: null,
        minQuantity: 1,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-01-01T00:00:00Z' },
      },
      {
        tradePolicyId: '3',
        value: 1.02,
        listPrice: null,
        minQuantity: 50,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2023-07-01T00:00:00Z' },
      },
      {
        tradePolicyId: '1',
        value: 1.02,
        listPrice: null,
        minQuantity: 500,
        dateRange: { from: '2022-01-01T00:00:00Z', to: '2022-12-31T00:00:00Z' },
      },
    ]

    expect(pricesToDisplay(inputPrices, ['1', '2', '3'])).toEqual(
      expectedOutput
    )
  })
})
