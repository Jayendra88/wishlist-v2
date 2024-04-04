export async function product(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { product: ProductClient },
  } = ctx

  const itemId = ctx.vtex.route.params.code as string

  const data = await ProductClient.getProductDetails(itemId)

  const { ProductSpecifications } = data

  // find UnitMultiplier FieldName and return its fieldvalue
  const unitMultiplier =
    Number(
      ProductSpecifications.find(
        (spec: any) => spec.FieldName === 'UnitMultiplier'
      ).FieldValues[0]
    ) || 1

  let unitOfMeasureCode = ProductSpecifications.find(
    (spec: any) => spec.FieldName === 'UOMCode'
  )

  unitOfMeasureCode = unitOfMeasureCode.FieldValues[0] || null

  ctx.set('cache-control', 'no-cache, no-store, must-revalidate, max-age=0')
  ctx.body = { unitMultiplier, unitOfMeasureCode }

  await next()
}
