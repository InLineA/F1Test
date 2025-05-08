import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface RaceResult {
    season: string
    raceName: string
    Constructor: { name: string }
    position: string
}

interface DriverRacesState {
    races: RaceResult[]
    loading: boolean
    error: string | null
}

const initialState: DriverRacesState = {
    races: [],
    loading: false,
    error: null,
}

export const fetchDriverRaces = createAsyncThunk(
    'driverRaces/fetchDriverRaces',
    async (driverId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://ergast.com/api/f1/drivers/${driverId}/results.json?limit=1000`
            )
            const results = response.data.MRData.RaceTable.Races.map((race: any) => ({
                season: race.season,
                raceName: race.raceName,
                Constructor: race.Results[0].Constructor,
                position: race.Results[0].position,
            }))
            return results
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load race results')
        }
    }
)

const driverRacesSlice = createSlice({
    name: 'driverRaces',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDriverRaces.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchDriverRaces.fulfilled, (state, action) => {
                state.loading = false
                state.races = action.payload
            })
            .addCase(fetchDriverRaces.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default driverRacesSlice.reducer