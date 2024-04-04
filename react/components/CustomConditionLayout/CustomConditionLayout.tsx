import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import type { Category } from '../Categories/LandingPage'
import { getMDv2CategoryById } from '../../utils/masterdata'
import type { MDv2Category } from '../../graphqlTypings/masterDataV2'
import subcategoryWithScore from '../../graphql/subcategoryWithScore.graphql'
import styles from '../Categories/styles.css'

interface CustomConditionLayoutProps {
  Grid: FC
  Search: FC
}

const CustomConditionLayout: StorefrontFunctionComponent<
  CustomConditionLayoutProps
> = ({ Grid, Search, ...props }) => {
  const runtime = useRuntime()

  const { data, loading, error } = useQuery(subcategoryWithScore, {
    variables: {
      id: parseInt(runtime.route.params.id, 10),
    },
    ssr: false,
  })

  const category: Category = data?.subcategoryWithScore

  // Grid data
  const [categoryData, setCategoryData] = useState<MDv2Category[]>([])

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getMDv2CategoryById(
          parseInt(runtime.route.params.id, 10).toString()
        )

        setCategoryData(response)
      } catch (err) {
        console.error(err)
      }
    }

    fetchCategory()
  }, [runtime.route.params.id])

  const showSearch =
    category?.hasChildren === false &&
    categoryData &&
    (categoryData.length === 0 || categoryData[0]?.grids.length === 0)

  if (loading) {
    return (
      <div className={styles['category-page']}>
        <div className={styles.loader} />
      </div>
    )
  }

  if (error) {
    window.location.replace('/not-found')
  }

  const extendedProps = {
    ...props,
    category,
    categoryData,
  }

  return showSearch ? <Search {...props} /> : <Grid {...extendedProps} />
}

export default CustomConditionLayout
