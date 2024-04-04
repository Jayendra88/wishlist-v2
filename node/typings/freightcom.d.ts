/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Attributes {
  xmlns: string
  version: string
}

export interface Attributes2 {
  carrierId: string
  carrierName: string
  serviceId: string
  serviceName: string
  modeTransport: string
  transitDays: string
  currency: string
  baseCharge: string
  fuelSurcharge: string
  totalCharge: string
  cubedWeight: string
}

export interface Quote {
  _attributes: Attributes2
  Surcharge: any
}

export interface QuoteReply {
  Quote: Quote[]
}

export interface ValidUntil {
  year: number
  month: number
  day: number
}

export interface Total {
  value: string
  currency: string
}

export interface Base {
  value: string
  currency: string
}

export interface Amount {
  value: string
  currency: string
}

export interface Surcharge {
  type: string
  amount: Amount
}

export interface Amount2 {
  value: string
  currency: string
}

export interface Tax {
  type: string
  amount: Amount2
}

export interface Freightcom {
  service_id: string
  total: Total
  transit_time_days: number
}

export interface FreightcomResponse {
  rates: [Freightcom]
}

export interface Rates {
  item: Freightcom
}

export interface AdditionalInfo {
  dimension?: any
  brandName: string
  brandId: string
  offeringInfo?: any
  offeringType?: any
  offeringTypeId?: any
}

export interface ProductCategories {
  1: string
  39: string
}

export interface PriceTag {
  name: string
  value: number
  rawValue: number
  isPercentual: boolean
  identifier: string
}

export interface SellingPrice {
  value: number
  quantity: number
}

export interface PriceDefinition {
  calculatedSellingPrice: number
  total: number
  sellingPrices: SellingPrice[]
}

export interface Item {
  uniqueId: string
  id: string
  productId: string
  productRefId: string
  refId: string
  ean: string
  name: string
  skuName: string
  modalType?: any
  parentItemIndex?: any
  parentAssemblyBinding?: any
  assemblies: any[]
  priceValidUntil: Date
  tax: number
  price: number
  listPrice: number
  manualPrice?: number
  manualPriceAppliedBy: string
  sellingPrice: number
  rewardValue: number
  isGift: boolean
  additionalInfo: AdditionalInfo
  preSaleDate?: any
  productCategoryIds: string
  productCategories: ProductCategories
  quantity: number
  seller: string
  sellerChain: string[]
  imageUrl: string
  detailUrl: string
  components: any[]
  bundleItems: any[]
  attachments: any[]
  attachmentOfferings: any[]
  offerings: any[]
  priceTags: PriceTag[]
  availability: string
  measurementUnit: string
  unitMultiplier: number
  manufacturerCode?: any
  priceDefinition: PriceDefinition
}

export interface Totalizer {
  id: string
  name: string
  value: number
}

export interface Address {
  addressType: string
  receiverName: string
  addressId: string
  isDisposable: boolean
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number?: any
  neighborhood?: any
  complement?: any
  reference?: any
  geoCoordinates: number[]
}

export interface DeliveryId {
  courierId: string
  warehouseId: string
  dockId: string
  courierName: string
  quantity: number
  kitItemDetails: any[]
}

export interface PickupStoreInfo {
  isPickupStore: boolean
  friendlyName?: any
  address?: any
  additionalInfo?: any
  dockId?: any
}

export interface Sla {
  id: string
  deliveryChannel: string
  name: string
  deliveryIds: DeliveryId[]
  shippingEstimate: string
  shippingEstimateDate?: any
  lockTTL?: any
  availableDeliveryWindows: any[]
  deliveryWindow?: any
  price: number
  listPrice: number
  tax: number
  pickupStoreInfo: PickupStoreInfo
  pickupPointId?: any
  pickupDistance: number
  polygonName: string
  transitTime: string
}

export interface DeliveryChannel {
  id: string
}

export interface LogisticsInfo {
  itemIndex: number
  selectedSla: string
  selectedDeliveryChannel: string
  addressId: string
  slas: Sla[]
  shipsTo: string[]
  itemId: string
  deliveryChannels: DeliveryChannel[]
}

export interface SelectedAddress {
  addressType: string
  receiverName: string
  addressId: string
  isDisposable: boolean
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number?: any
  neighborhood?: any
  complement?: any
  reference?: any
  geoCoordinates: number[]
}

export interface AvailableAddress {
  addressType: string
  receiverName: string
  addressId: string
  isDisposable: boolean
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number?: any
  neighborhood?: any
  complement?: any
  reference?: any
  geoCoordinates: number[]
}

export interface ShippingData {
  address: Address
  logisticsInfo: LogisticsInfo[]
  selectedAddresses: SelectedAddress[]
  availableAddresses: AvailableAddress[]
  pickupPoints: any[]
}

export interface ClientProfileData {
  email: string
  firstName: string
  lastName: string
  document?: any
  documentType: string
  phone: string
  corporateName?: any
  tradeName?: any
  corporateDocument?: any
  stateInscription?: any
  corporatePhone?: any
  isCorporate: boolean
  profileCompleteOnLoading: boolean
  profileErrorOnLoading: boolean
  customerClass?: any
}

export interface SellerMerchantInstallment {
  id: string
  count: number
  hasInterestRate: boolean
  interestRate: number
  value: number
  total: number
}

export interface Installment {
  count: number
  hasInterestRate: boolean
  interestRate: number
  value: number
  total: number
  sellerMerchantInstallments: SellerMerchantInstallment[]
}

export interface InstallmentOption {
  paymentSystem: string
  bin?: any
  paymentName?: any
  paymentGroupName?: any
  value: number
  installments: Installment[]
}

export interface Validator {
  regex: string
  mask: string
  cardCodeRegex: string
  cardCodeMask: string
  weights: number[]
  useCvv: boolean
  useExpirationDate: boolean
  useCardHolderName: boolean
  useBillingAddress: boolean
}

export interface PaymentSystem {
  id: number
  name: string
  groupName: string
  validator: Validator
  stringId: string
  template: string
  requiresDocument: boolean
  isCustom: boolean
  description: string
  requiresAuthentication: boolean
  dueDate: Date
  availablePayments?: any
}

export interface MerchantSellerPayment {
  id: string
  installments: number
  referenceValue: number
  value: number
  interestRate: number
  installmentValue: number
}

export interface Payment {
  paymentSystem: string
  bin?: any
  accountId?: any
  tokenId?: any
  installments: number
  referenceValue: number
  value: number
  merchantSellerPayments: MerchantSellerPayment[]
}

export interface PaymentData {
  updateStatus: string
  installmentOptions: InstallmentOption[]
  paymentSystems: PaymentSystem[]
  payments: Payment[]
  giftCards: any[]
  giftCardMessages: any[]
  availableAccounts: any[]
  availableTokens: any[]
  availableAssociations: any
}

export interface Seller {
  id: string
  name: string
  logo: string
}

export interface ClientPreferencesData {
  locale: string
  optinNewsLetter: boolean
}

export interface CurrencyFormatInfo {
  currencyDecimalDigits: number
  currencyDecimalSeparator: string
  currencyGroupSeparator: string
  currencyGroupSize: number
  startsWithCurrencySymbol: boolean
}

export interface StorePreferencesData {
  countryCode: string
  saveUserData: boolean
  timeZone: string
  currencyCode: string
  currencyLocale: number
  currencySymbol: string
  currencyFormatInfo: CurrencyFormatInfo
}

export interface Item2 {
  id: string
  seller: string
  name: string
  skuName: string
  productId: string
  refId: string
  ean: string
  imageUrl: string
  detailUrl: string
  assemblyOptions: any[]
}

export interface ItemMetadata {
  items: Item2[]
}

export interface RatesAndBenefitsData {
  rateAndBenefitsIdentifiers: any[]
  teaser: any[]
}

export interface ShippingPriceUpdateResponse {
  orderFormId: string
  salesChannel: string
  loggedIn: boolean
  isCheckedIn: boolean
  storeId?: any
  checkedInPickupPointId?: any
  allowManualPrice: boolean
  canEditData: boolean
  userProfileId: string
  userType?: any
  ignoreProfileData: boolean
  value: number
  messages: any[]
  items: Item[]
  selectableGifts: any[]
  totalizers: Totalizer[]
  shippingData: ShippingData
  clientProfileData: ClientProfileData
  paymentData: PaymentData
  marketingData?: any
  sellers: Seller[]
  clientPreferencesData: ClientPreferencesData
  commercialConditionData?: any
  storePreferencesData: StorePreferencesData
  giftRegistryData?: any
  openTextField?: any
  invoiceData?: any
  customData?: any
  itemMetadata: ItemMetadata
  hooksData?: any
  ratesAndBenefitsData: RatesAndBenefitsData
  subscriptionData?: any
  itemsOrdination?: any
}
