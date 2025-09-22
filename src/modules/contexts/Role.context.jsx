import React from 'react'
import { useSnackbar } from 'notistack'
import RoleApi from '../apis/Role.api'
import { AuthContext } from './Auth.context'

const RoleContext = React.createContext()

const RoleContextProvider = props => {
  const [loading, setLoading] = React.useState(true)
  const { enqueueSnackbar } = useSnackbar()
  const [roles, setRoles] = React.useState([])
  const [widgets, setWidgets] = React.useState([])
  const { isAuthenticated } = React.useContext(AuthContext)

  const loadRoles = React.useCallback(() => {
    Promise.all([RoleApi.getRoles(), RoleApi.widgets()])
      .then(([res, wid]) => {
        setRoles(res.data.data)
        setWidgets(wid.data)
      })
      .catch(() =>
        enqueueSnackbar('Failed to load roles', { variant: 'error' })
      )
      .finally(() => setLoading(false))
  }, [enqueueSnackbar])

  React.useEffect(() => {
    if (isAuthenticated) {
      loadRoles()
    }
  }, [loadRoles, isAuthenticated])

  return (
    <RoleContext.Provider
      value={{ loading, setLoading, roles, setRoles, widgets, setWidgets }}
    >
      {props.children}
    </RoleContext.Provider>
  )
}

export { RoleContext, RoleContextProvider }
