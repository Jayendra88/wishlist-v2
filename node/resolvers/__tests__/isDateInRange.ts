import { isDateInRange } from '../fixedPrices'

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

test('isDateInRange utility function', () => {
  const testCases = [
    {
      dateRange: {
        from: '2022-01-13T00:00:00Z', // 2 days before stubbed date
        to: '2022-01-14T23:59:59Z', // 1 day before stubbed date
      },
      expected: false,
    },
    {
      dateRange: {
        from: '2022-01-16T00:00:00Z', // 1 day after stubbed date
        to: '2022-01-17T23:59:59Z', // 2 days after stubbed date
      },
      expected: false,
    },
    {
      dateRange: {
        from: '2022-01-14T00:00:00Z', // 1 day before stubbed date
        to: '2022-01-16T23:59:59Z', // 1 day after stubbed date
      },
      expected: true,
    },
    {
      dateRange: {
        from: '2022-01-15T00:00:00Z', // same as stubbed date
        to: '2022-01-16T23:59:59Z', // 1 day after stubbed date
      },
      expected: true,
    },
  ]

  // Run the tests
  testCases.forEach(({ dateRange, expected }) => {
    expect(isDateInRange({ ...dateRange, currentDate: stubbedDate })).toEqual(
      expected
    )
  })
})
