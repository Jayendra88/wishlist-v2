import { method } from '@vtex/api'

import { orderHistory } from '../middlewares/orderHistory'
import { getOrder } from '../middlewares/getOrder'
import { product } from '../middlewares/product'
import { shipping } from '../middlewares/shipping'
import { shippingPriceUpdate } from '../middlewares/shippingPriceUpdate'
import { shippingUpdate } from '../middlewares/shippingUpdate'
import { signedUrl } from '../middlewares/getSignedUrl'
import { validateOrgAddUser } from '../middlewares/validateOrgAddUser'
import { getUser } from '../middlewares/getUser'
import { addUser } from '../middlewares/addUser'
import {
  masterDataCategories,
  masterDataCategoriesByName,
  masterDataCategoryImage,
  masterDataCategoryHeroImage,
  masterDataCategoryHeroData,
  masterDataPutCategoryGrid,
  masterDataPatchCategoryGrid,
  masterDataDeleteCategoryGrid,
} from '../middlewares/masterDataCategories'
import { gettingBusinessDocument } from '../middlewares/retrieveBusinessDocument'
import { reportSentryError } from '../middlewares/reportSentryError'

export const resolvers = {
  Routes: {
    invoiceUrl: method({
      GET: [reportSentryError, signedUrl],
    }),
    shipping: method({
      POST: [reportSentryError, shipping],
    }),
    shippingPriceUpdate: method({
      PUT: [reportSentryError, shippingPriceUpdate],
    }),
    shippingUpdate: method({
      PUT: [reportSentryError, shippingUpdate],
    }),
    product: method({
      GET: [reportSentryError, product],
    }),
    orderHistory: method({
      GET: [reportSentryError, orderHistory],
    }),
    validateOrgAddUser: method({
      POST: [reportSentryError, validateOrgAddUser],
    }),
    getUser: method({
      GET: [reportSentryError, getUser],
    }),
    getOrder: method({
      GET: [reportSentryError, getOrder],
    }),
    addUser: method({
      POST: [reportSentryError, addUser],
    }),
    //! MasterDataCategories
    masterDataCategories: method({
      GET: [reportSentryError, masterDataCategories],
      PATCH: [reportSentryError, masterDataPatchCategoryGrid],
      DELETE: [reportSentryError, masterDataDeleteCategoryGrid],
    }),
    masterDataCategoriesByName: method({
      GET: [reportSentryError, masterDataCategoriesByName],
    }),
    masterDataCategoryImage: method({
      GET: [reportSentryError, masterDataCategoryImage],
    }),
    masterDataCategoryHeroImage: method({
      GET: [reportSentryError, masterDataCategoryHeroImage],
    }),
    masterDataCategoryHeroData: method({
      GET: [reportSentryError, masterDataCategoryHeroData],
    }),
    masterDataPutCategoryGrid: method({
      PUT: [reportSentryError, masterDataPutCategoryGrid],
    }),
    retrieveBusinessDocument: method({
      GET: [reportSentryError, gettingBusinessDocument],
    }),
  },
}
