import { extractCustomNonPronto } from '../helpers'

describe('extractCustomNonPronto', () => {
  test('extractCustomNonPronto with preferred', () => {
    const data = [
      [
        '[code]',
        'size',
        'thickness',
        'custom-non-pronto-1',
        'custom-non-pronto-2',
        'custom-non-pronto-3',
        'custom-non-pronto-4',
      ],
      [
        '[preferred headers]',
        'Case',
        'Thickness',
        'Test 1',
        'Test 2',
        'Test 3',
        'Test 4',
      ],
      ['S2937', null, null, 'a', 'aa', 'aaa', 'aaa'],
      ['S2687', null, null, 'b', 'bb', 'bbb', 'bbb'],
      ['S2714', null, null, null, null, null, null],
      ['S2953', null, null, null, null, null, null],
      ['W1M040208', null, null, 'f', 'ff', 'fff', 'fff'],
      ['W1M050212', null, null, 'g', 'gg', 'ggg', 'ggg'],
    ]

    const expectedResult = [
      {
        originalProperty: 'custom-non-pronto-1',
        replacementProperty: 'Test 1',
        values: ['a', 'b', '', '', 'f', 'g'],
      },
      {
        originalProperty: 'custom-non-pronto-2',
        replacementProperty: 'Test 2',
        values: ['aa', 'bb', '', '', 'ff', 'gg'],
      },
      {
        originalProperty: 'custom-non-pronto-3',
        replacementProperty: 'Test 3',
        values: ['aaa', 'bbb', '', '', 'fff', 'ggg'],
      },
      {
        originalProperty: 'custom-non-pronto-4',
        replacementProperty: 'Test 4',
        values: ['aaa', 'bbb', '', '', 'fff', 'ggg'],
      },
    ]

    const result = extractCustomNonPronto(data as any, true)

    expect(result).toEqual(expectedResult)
  })

  test('extractCustomNonPronto without preferred', () => {
    const data = [
      [
        '[code]',
        'size',
        'thickness',
        'custom-non-pronto-1',
        'custom-non-pronto-2',
        'custom-non-pronto-3',
        'custom-non-pronto-4',
      ],
      ['S2937', null, null, 'a', 'aa', 'aaa', 'aaa'],
      ['S2687', null, null, 'b', 'bb', 'bbb', 'bbb'],
      ['S2714', null, null, null, null, null, null],
      ['S2953', null, null, null, null, null, null],
      ['W1M040208', null, null, 'f', 'ff', 'fff', 'fff'],
      ['W1M050212', null, null, 'g', 'gg', 'ggg', 'ggg'],
    ]

    const expectedResult = [
      {
        originalProperty: 'custom-non-pronto-1',
        replacementProperty: 'custom-non-pronto-1',
        values: ['a', 'b', '', '', 'f', 'g'],
      },
      {
        originalProperty: 'custom-non-pronto-2',
        replacementProperty: 'custom-non-pronto-2',
        values: ['aa', 'bb', '', '', 'ff', 'gg'],
      },
      {
        originalProperty: 'custom-non-pronto-3',
        replacementProperty: 'custom-non-pronto-3',
        values: ['aaa', 'bbb', '', '', 'fff', 'ggg'],
      },
      {
        originalProperty: 'custom-non-pronto-4',
        replacementProperty: 'custom-non-pronto-4',
        values: ['aaa', 'bbb', '', '', 'fff', 'ggg'],
      },
    ]

    const result = extractCustomNonPronto(data as any, false)

    expect(result).toEqual(expectedResult)
  })
})
