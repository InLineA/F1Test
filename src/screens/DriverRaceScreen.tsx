import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDriverRaces } from '../redux/slices/driverRacesSlice'
import type { AppDispatch, RootState } from '../redux/store'
import { RouteProp } from '@react-navigation/native'

type DriverRaceParamList = {
    DriverRaces: { driverId: string }
}

interface Props {
    route: RouteProp<DriverRaceParamList, 'DriverRaces'>
}

const DriverRaceScreen = ({ route }: Props) => {
    const { driverId } = route.params
    const dispatch = useDispatch<AppDispatch>()
    
    const { races, loading, error } = useSelector((state: RootState) => state.driverRaces)
    const [retry, setRetry] = useState(false)

    // Fetch races for the driver
    useEffect(() => {
        dispatch(fetchDriverRaces(driverId))
    }, [dispatch, driverId, retry])

    // Handle retry action
    const handleRetry = () => {
        setRetry(!retry)  // Trigger the useEffect again
    }

    // Loading indicator
    if (loading) {
        return <ActivityIndicator style={styles.center} size="large" />
    }

    // Error message with retry button
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity onPress={handleRetry}>
                    <Text style={styles.retryButton}>Попробовать снова</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // Empty state when no races are available
    if (!races || races.length === 0) {
        return <Text style={styles.empty}>Нет информации о гонках для этого водителя.</Text>
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={races}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.raceName} ({item.season})</Text>
                        <Text>Constructor: {item.Constructor.name}</Text>
                        <Text>Position: {item.position}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>Нет гонок для данного водителя.</Text>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    item: { marginBottom: 12, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 8 },
    title: { fontWeight: 'bold' },
    error: { color: 'red', marginTop: 20 },
    retryButton: { color: 'blue', marginTop: 10 },
    empty: { textAlign: 'center', marginTop: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default DriverRaceScreen
