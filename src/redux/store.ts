import { configureStore } from '@reduxjs/toolkit'
import driversReducer from './slices/driversSlice'
import driverDetailsReducer from './slices/driverDetailsSlice'
import driverRacesReducer from './slices/driverRacesSlice'

export const store = configureStore({
    reducer: {
        drivers: driversReducer,
        driverDetails: driverDetailsReducer,
        driverRaces: driverRacesReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware() 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch