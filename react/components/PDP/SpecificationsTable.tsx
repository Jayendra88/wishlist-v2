import React from 'react'
import { useProduct } from 'vtex.product-context'

import styles from './Table.css'
import { titleize } from '../helpers'

const SpecificationsTable: StorefrontFunctionComponent = () => {
  const productContextValue = useProduct()

  const propertiesToHide = [
    'ABCClassCode',
    'miscellaneous',
    'UnitMultiplier',
    'UOM',
    'UOMCode',
  ]

  const filteredProperties = productContextValue?.product?.properties?.filter(
    (property) => !propertiesToHide.includes(property.name)
  )

  return (
    <div className={styles['specification-table-wrapper']}>
      <table className={styles['specification-table']}>
        <tbody>
          {filteredProperties?.map((property) => {
            if (property?.values[0].length < 1) {
              return null
            }

            return (
              <tr key={property.name}>
                <td>{titleize(property.name)}</td>
                <td>{property?.values[0]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SpecificationsTable
