// encountered an error while trying to import .graphql files, using ts file instead
export const QUERIES = {
  getProductsByRefId: `
  query singleProductSearch($productReference: String) {
    productSearch(fullText: $productReference)
      @context(provider: "vtex.search-graphql") {
      products {
        categoryId
        productReference
        items {
          nameComplete
          itemId
          images {
            imageUrl
          }
          unitMultiplier
        }
        link
        properties {
          name
          values
        }
      categories
        categoryTree {
          id
          name
          children {
            id
            name
          }
        }
      }
    }
  }`,
  getOrganizationCustomFields: `
  query getOrganizationShippingCode($identifier: ID) {
    getOrganizationById (id: $identifier)
    @context(provider: "vtex.b2b-organizations-graphql") {
      id
      name
      customFields {
        name
        value
      }
    }
  }`,
  getCostCenterCustomFields: `
  query getCostCenterAddressStatus($identifier: ID!) {
  getCostCenterById (id: $identifier) @context(provider: "vtex.b2b-organizations-graphql") {
        name
        id
        customFields {
          name
          value
        }
    }
  }`,
  getSubcategories: `
  query subcategories($id: Int) {
    category(id: $id) @context(provider: "vtex.store-graphql") {
      hasChildren
      name
      metaTagDescription
      children {
        id
        name
        slug
        href
        hasChildren
      }
    }
  }
  `,
}
