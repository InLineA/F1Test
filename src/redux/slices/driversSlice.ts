import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface Driver {
    driverId: string
    givenName: string
    familyName: string
    nationality: string
    dateOfBirth: string
    url: string
}

interface DriversState {
    driversMap: Record<string, Driver>
    total: number
    loading: boolean
    error: string | null
    page: number
    limit: number
}

const initialState: DriversState = {
    driversMap: {},
    total: 0,
    loading: false,
    error: null,
    page: 0,
    limit: 30,
}

export const fetchDrivers = createAsyncThunk(
    'drivers/fetchDrivers',
    async (page: number, { rejectWithValue }) => {
        try {
            const offset = page * initialState.limit
            const response = await axios.get(
                `https://ergast.com/api/f1/drivers.json?limit=${initialState.limit}&offset=${offset}`,
                { headers: { Accept: 'application/json' } }
            )
            const data = response.data.MRData
            return {
                drivers: data.DriverTable.Drivers,
                total: parseInt(data.total),
                page,
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load drivers')
        }
    }
)

const driversSlice = createSlice({
    name: 'drivers',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDrivers.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchDrivers.fulfilled, (state, action) => {
                state.loading = false
                state.page = action.payload.page

                action.payload.drivers.forEach((driver: Driver) => {
                    state.driversMap[driver.driverId] = driver
                })

                state.total = action.payload.total
            })
            .addCase(fetchDrivers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default driversSlice.reducer