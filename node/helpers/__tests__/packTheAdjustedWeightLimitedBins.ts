import { packTheAdjustedWeightLimitedBins, Box } from '../simpleBinPacking'

describe('packTheAdjustedWeightLimitedBins', () => {
  test('oversized', () => {
    const items = [new Box(47, 17, 46, 47), new Box(47, 17, 46, 47)]

    const packedBinsSimple = packTheAdjustedWeightLimitedBins(items)

    expect(packedBinsSimple).toEqual([
      {
        length: 47,
        width: 17,
        height: 46,
        weight: 47,
        itemCount: 1,
      },
      {
        length: 47,
        width: 17,
        height: 46,
        weight: 47,
        itemCount: 1,
      },
    ])
  })

  test('small items', () => {
    const items = [
      new Box(25, 25, 10, 10),
      new Box(25, 25, 10, 10),
      new Box(25, 25, 5, 30),
    ]

    const packedBinsSimple = packTheAdjustedWeightLimitedBins(items)

    expect(packedBinsSimple).toEqual([
      {
        length: 25,
        width: 25,
        height: 15,
        weight: 40,
        itemCount: 2,
      },
      {
        length: 25,
        width: 25,
        height: 10,
        weight: 10,
        itemCount: 1,
      },
    ])
  })

  test('mix', () => {
    const items = [
      new Box(47, 17, 46, 55),
      new Box(25, 25, 10, 10),
      new Box(25, 25, 10, 10),
      new Box(25, 25, 5, 30),
    ]

    const packedBinsSimple = packTheAdjustedWeightLimitedBins(items)

    expect(packedBinsSimple).toEqual([
      {
        height: 46,
        itemCount: 1,
        length: 47,
        width: 17,
        weight: 55,
      },
      {
        length: 25,
        width: 25,
        height: 15,
        weight: 40,
        itemCount: 2,
      },
      {
        length: 25,
        width: 25,
        height: 10,
        weight: 10,
        itemCount: 1,
      },
    ])
  })
})
