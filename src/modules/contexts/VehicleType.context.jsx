import React from 'react'
import { useSnackbar } from 'notistack'
import VehicleTypeAPI from '../apis/VehicleTypes.api'
import { AuthContext } from './Auth.context'

const VehicleTypeContext = React.createContext()

const VehicleTypeContextProvider = props => {
  const [loading, setLoading] = React.useState(true)
  const { enqueueSnackbar } = useSnackbar()
  const [vehicleTypes, setVehicleTypes] = React.useState([])
  const { isAuthenticated } = React.useContext(AuthContext)

  const loadVehicleTypes = React.useCallback(() => {
    VehicleTypeAPI.getVehicleTypes()
      .then((res) => {
        setVehicleTypes(res.data.data)
      })
      .catch((error) => {
        const message = error.response?.data.message
        const status = error.response?.status
        const errorMessage = message ? message + ' - ' + status : error.message
        enqueueSnackbar(errorMessage, { variant: 'error' })
      })
      .finally(() => setLoading(false))
  }, [enqueueSnackbar])

  React.useEffect(() => {
    if (isAuthenticated) {
      loadVehicleTypes()
    }
  }, [loadVehicleTypes, isAuthenticated])

  return (
    <VehicleTypeContext.Provider
      value={{ loading, setLoading, vehicleTypes, setVehicleTypes }}
    >
      {props.children}
    </VehicleTypeContext.Provider>
  )
}

export { VehicleTypeContext, VehicleTypeContextProvider }
