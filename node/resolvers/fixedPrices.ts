import sortBy from 'lodash/sortBy'

import type { FixedPrice } from '../../react/typings/product'

export const fixedPrices = async (
  _: any,
  { ids }: { ids: string[] },
  { clients: { prices: PricingClient }, clients, vtex }: Context
) => {
  const sessionToken = vtex.sessionToken as string

  // grab b2b priceTables from session
  const sessionData = await clients.session.getSession(sessionToken, [
    'profile.priceTables',
    'public.sc',
  ])

  const salesChannel =
    sessionData.sessionData.namespaces?.public?.sc?.value ?? '1'

  // in case user is not logged in, return default sales channel
  const availablePriceTablesString: string =
    sessionData.sessionData.namespaces?.profile?.priceTables?.value ??
    salesChannel

  // make a list of available price tables
  const availablePriceTableIds = availablePriceTablesString.split(',')

  // add default sales channel
  availablePriceTableIds.push(salesChannel)

  const fixedPricesForProducts = ids.map(async (id) => {
    const fixedPricesForProduct: FixedPrice[] =
      await PricingClient.getFixedPrices(id)

    return {
      productId: id,
      fixedPrices: pricesToDisplay(
        fixedPricesForProduct,
        availablePriceTableIds
      ),
    }
  })

  // resolve all promises
  const fixedPricesForProductsResolved = await Promise.all(
    fixedPricesForProducts
  )

  return fixedPricesForProductsResolved
}

// Helper

export const pricesToDisplay = (
  userPriceTables: FixedPrice[],
  availablePriceTableIds: string[],
  currentDate?: Date // Optional current date for testing
) => {
  const filteredPriceTables = userPriceTables.filter((price) => {
    const isWithinDateRange = price.dateRange
      ? isDateInRange({ ...price.dateRange, currentDate })
      : true
    return (
      availablePriceTableIds.includes(price.tradePolicyId) && isWithinDateRange
    )
  })

  const reducedPriceTable = filteredPriceTables.reduce<
    Record<number, FixedPrice>
  >((acc, item) => {
    const existing = acc[item.minQuantity]

    if (!existing) {
      return { ...acc, [item.minQuantity]: item }
    }

    return {
      ...acc,
      [item.minQuantity]: item.value < existing.value ? item : existing,
    }
  }, {})

  const priceTableValues = Object.values(reducedPriceTable)

  const priceTableValuesSorted = sortBy(priceTableValues, 'minQuantity')

  // loop over sortedFinalArray and compare each item with the previous one to see if the next one has lower value than the previous one and return the lowest value
  const arrayToDisplay = priceTableValuesSorted.reduce<FixedPrice[]>(
    (acc, item, index) => {
      const previousItem = acc[index - 1]

      if (!previousItem || item.value < previousItem.value) {
        return [...acc, item]
      }

      return [...acc, { ...item, value: previousItem.value }]
    },
    []
  )

  return arrayToDisplay
}

// Utility to check if the current date is within the given date range
export const isDateInRange = (dateRange: {
  from: string | number | Date
  to: string | number | Date
  currentDate?: Date // Optional current date for testing
}) => {
  const currentDate = dateRange.currentDate || new Date()
  const from = new Date(dateRange.from)
  const to = new Date(dateRange.to)

  return currentDate >= from && currentDate <= to
}
