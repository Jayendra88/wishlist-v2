import type { ShippingCode } from './clients/shipping/whitebirdShipping'

export const FREIGHTCOM_AUTH_KEY =
  'FvL4dK0C7MgvmCE1KLi76RqSXNIZ9INuqXFX4AWOaj8wS68nQaTq60Yzq7amDpfw'

export const B2B_DEFAULT_ADMIN_ROLE = '17c36328-7f6d-11ec-82ac-0a1a75c2776b'

export const WAREHOUSE_ADDRESS = {
  name: 'Whitebird',
  address: {
    address_line_1: '690 Rennie St',
    address_line_2: '',
    unit_number: '',
    city: 'Hamilton',
    region: 'ON',
    country: 'CA',
    postal_code: 'L8H 3R2',
  },
  residential: false,
  tailgate_required: false,
  contact_name: 'William',
  phone_number: {
    number: '905.544.7575',
    extension: '',
  },
}

export const FREE_PICK_UP_VALUE = 150000

export const FREE_DELIVERY_VALUE = 150000

export const WHITEBIRD_PRICE_BUFFER = 1.2

export const DEFAULT_SURCHARGE_CODE = 'A'

export const DEFAULT_SURCHARGE = 0.019

export const MS_IN_DAY = 86400000

export const freePickUp = {
  min_charge: '0',
  service_name: 'Pick Up',
} as ShippingCode

export const pickUp = {
  min_charge: '0',
  service_name: 'Pick Up',
} as ShippingCode
