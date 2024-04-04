export class Box {
  public length: number
  public width: number
  public height: number
  public weight: number
  constructor(length: number, width: number, height: number, weight: number) {
    this.length = length
    this.width = width
    this.height = height
    this.weight = weight
  }

  public volume(): number {
    return this.length * this.width * this.height
  }

  public isOversized(maxSize: Box): boolean {
    return (
      this.length > maxSize.length ||
      this.width > maxSize.width ||
      this.height > maxSize.height
    )
  }
}

class SimpleBin {
  public usedVolume: number
  public maxVolume: number
  public itemCount: number
  public weight: number
  public binDimensions: Box

  constructor(binDimensions: Box) {
    this.usedVolume = 0
    this.maxVolume =
      binDimensions.length * binDimensions.width * binDimensions.height
    this.itemCount = 0
    this.weight = 0
    this.binDimensions = new Box(
      binDimensions.length,
      binDimensions.width,
      binDimensions.height,
      binDimensions.weight
    )
  }

  public addItem(item: Box): boolean {
    if (this.usedVolume + item.volume() <= this.maxVolume) {
      this.usedVolume += item.volume()
      this.itemCount++
      this.weight += item.weight

      return true
    }

    return false
  }

  public getBinInfo() {
    const usedHeight =
      this.usedVolume / (this.binDimensions.length * this.binDimensions.width)

    return {
      weight: Math.round(this.weight * 10) / 10 || this.binDimensions.weight,
      itemCount: this.itemCount,
      length: this.binDimensions.length,
      width: this.binDimensions.width,
      height: Math.round(usedHeight * 10) / 10 || this.binDimensions.height,
    }
  }
}

const simpleBinPacking = (items: Box[], binSize: Box) => {
  items = items.filter((item) => {
    return item.volume() <= binSize.length * binSize.width * binSize.height
  })

  const bins: SimpleBin[] = []
  let currentBin = new SimpleBin(binSize)

  bins.push(currentBin)

  for (const item of items) {
    if (!currentBin.addItem(item)) {
      currentBin = new SimpleBin(binSize)
      bins.push(currentBin)
      currentBin.addItem(item)
    }
  }

  return bins.map((bin) => bin.getBinInfo())
}

const palletBinSize = new Box(48, 40, 67.5, 0)

export const packSimpleBins = (items: Box[]) => {
  const binsInfo = simpleBinPacking(items, palletBinSize)

  return binsInfo
}

//! Weight adjusted bin packing

// package is 16 inches tall per Williams request for it to be 5.75 cubic feet in volume
const samplePackage = new Box(25, 25, 16, 0)

class WeightLimitedSimpleBin extends SimpleBin {
  public addItem(item: Box): boolean {
    const maxAllowedWeight = 50

    if (
      (this.usedVolume + item.volume() <= this.maxVolume &&
        this.weight + item.weight <= maxAllowedWeight) ||
      this.itemCount === 0 // Allow the first item to be added even if it exceeds the weight limit
    ) {
      this.usedVolume += item.volume()
      this.itemCount++
      this.weight += item.weight
      if (item.isOversized(samplePackage)) {
        this.binDimensions.length = item.length
        this.binDimensions.width = item.width
        this.binDimensions.height = item.height
      }

      return true
    }

    return false
  }
}

const weightLimitedBinPacking = (items: Box[], binSize: Box) => {
  const bins: WeightLimitedSimpleBin[] = []

  for (const item of items) {
    let itemAdded = false

    for (const bin of bins) {
      if (bin.addItem(item)) {
        itemAdded = true
        break
      }
    }

    // If the item wasn't added to any existing bin, create a new bin and add the item
    if (!itemAdded) {
      const newBin = new WeightLimitedSimpleBin(binSize)

      newBin.addItem(item)

      bins.push(newBin)
    }
  }

  return bins.map((bin) => bin.getBinInfo())
}

export const packTheAdjustedWeightLimitedBins = (items: Box[]) => {
  const binsInfo = weightLimitedBinPacking(items, samplePackage)

  return binsInfo
}
