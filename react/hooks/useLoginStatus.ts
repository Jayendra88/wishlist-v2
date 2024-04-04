import { useQuery } from 'react-apollo'
import { useRenderSession } from 'vtex.session-client'

import GET_ORGANIZATION from '../graphql/getOrg.graphql'

type SessionValue =
  | {
      value?: string
    }
  | undefined

const useLoginStatus = () => {
  const { data: orgData, loading: orgLoading } = useQuery(GET_ORGANIZATION, {
    ssr: false,
  })

  const sessionData = useRenderSession()

  const isAuthenticated =
    sessionData.session &&
    'namespaces' in sessionData.session &&
    (sessionData?.session?.namespaces?.profile?.isAuthenticated as SessionValue)
      ?.value === 'true'

  const getStatus = () => {
    if (isAuthenticated && orgData) return 'corporate'
    if (isAuthenticated && !orgData) return 'loggedIn'

    return 'guest'
  }

  if (!orgLoading && !sessionData.loading) {
    return { status: getStatus(), loading: false }
  }

  return { status: 'guest', loading: true }
}

export default useLoginStatus
