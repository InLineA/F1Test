import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface DriverDetails {
    driverId: string
    givenName: string
    familyName: string
    nationality: string
    dateOfBirth: string
    url: string
}

interface DriverDetailsState {
    details: DriverDetails | null
    loading: boolean
    error: string | null
}

const initialState: DriverDetailsState = {
    details: null,
    loading: false,
    error: null,
}

export const fetchDriverDetails = createAsyncThunk(
    'driverDetails/fetchDriverDetails',
    async (driverId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://ergast.com/api/f1/drivers/${driverId}.json`
            )
            const data = response.data.MRData.DriverTable.Drivers[0]
            return data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load driver details')
        }
    }
)

const driverDetailsSlice = createSlice({
    name: 'driverDetails',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDriverDetails.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchDriverDetails.fulfilled, (state, action) => {
                state.loading = false
                state.details = action.payload
            })
            .addCase(fetchDriverDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default driverDetailsSlice.reducer