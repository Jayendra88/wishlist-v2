import { packSimpleBins, Box } from '../simpleBinPacking'

test('packSimpleBins volume calculation', () => {
  const items = [
    new Box(48, 40, 10, 47),
    new Box(48, 40, 10, 47),
    new Box(48, 40, 10, 47),
    new Box(20, 20, 10, 47),
  ]

  const packedBinsSimple = packSimpleBins(items)

  expect(packedBinsSimple).toEqual([
    {
      length: 48,
      width: 40,
      height: 32.1,
      weight: 188,
      itemCount: 4,
    },
  ])
})
