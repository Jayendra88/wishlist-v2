import { MS_IN_DAY } from '../constants'

export default function shippingDate() {
  const deliveryBuffer = MS_IN_DAY * 3
  const deliveryDateBuffer = Date.now()
  const deliveryDate = new Date(deliveryDateBuffer + deliveryBuffer)
  const currentDay = deliveryDate.getDate()
  const currentMonth = deliveryDate.getMonth() + 1
  const currentYear = deliveryDate.getFullYear()

  return {
    currentYear,
    currentDay,
    currentMonth,
  }
}
