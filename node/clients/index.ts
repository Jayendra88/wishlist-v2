import { IOClients } from '@vtex/api'

import { Pricing } from './fixedPrices'
import { Shipping } from './freightcom/index'
import { ShippingRates } from './freightcom/getRates'
import { Product } from './product'
import { ProntoLogin } from './pronto/login'
import { OrderHistory } from './pronto/orderHistory'
import { GetOrganization } from './B2B/getOrganization'
import { GetUser } from './B2B/getUser'
import { AddUser } from './B2B/addUser'
import { ShippingPriceUpdate } from './shippingPriceUpdate'
import { ShippingUpdate } from './shippingUpdate'
import { MasterDataCategories } from './masterDataCategories'
import { GraphQLServer } from './graphqlServer'
import { CategoryScore } from './categoryScore'

export class Clients extends IOClients {
  public get prices() {
    return this.getOrSet('prices', Pricing)
  }

  public get shipping() {
    return this.getOrSet('shipping', Shipping)
  }

  public get shippingRates() {
    return this.getOrSet('shippingRates', ShippingRates)
  }

  public get shippingPriceUpdate() {
    return this.getOrSet('shippingPriceUpdate', ShippingPriceUpdate)
  }

  public get product() {
    return this.getOrSet('product', Product)
  }

  public get shippingUpdate() {
    return this.getOrSet('shippingUpdate', ShippingUpdate)
  }

  public get graphQLServer() {
    return this.getOrSet('graphQLServer', GraphQLServer)
  }

  public get prontoLogin() {
    return this.getOrSet('pronto', ProntoLogin)
  }

  public get orderHistory() {
    return this.getOrSet('orderHistory', OrderHistory)
  }

  public get organization() {
    return this.getOrSet('organization', GetOrganization)
  }

  public get user() {
    return this.getOrSet('user', GetUser)
  }

  public get addUser() {
    return this.getOrSet('addUser', AddUser)
  }

  public get masterDataCategories() {
    return this.getOrSet('masterDataCategories', MasterDataCategories)
  }

  public get categoryScore() {
    return this.getOrSet('categoryScore', CategoryScore)
  }
}
