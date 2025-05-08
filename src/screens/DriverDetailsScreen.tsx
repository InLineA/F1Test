import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDriverDetails } from '../redux/slices/driverDetailsSlice'
import { RootState, AppDispatch } from '../redux/store'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '../types/types'

type DriverDetailsParamList = {
    DriverDetails: { driverId: string };
}

type DriverDetailsProps = {
    route: RouteProp<RootStackParamList, 'DriverDetails'>
    navigation: NavigationProp<RootStackParamList, 'DriverDetails'>
}

const DriverDetailsScreen = ({ route, navigation }: DriverDetailsProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const { driverId } = route.params  // теперь TypeScript знает о параметре driverId

    const { details, loading, error } = useSelector(
        (state: RootState) => state.driverDetails
    )

    useEffect(() => {
        dispatch(fetchDriverDetails(driverId))
    }, [dispatch, driverId])

    if (loading) {
        return <ActivityIndicator size="large" style={styles.center} />
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity onPress={() => dispatch(fetchDriverDetails(driverId))}>
                    <Text style={styles.retry}>Попробовать снова</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (!details) {
        return <Text style={styles.error}>No details found</Text>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {details.givenName} {details.familyName}
            </Text>
            <Text style={styles.text}>Nationality: {details.nationality}</Text>
            <Text style={styles.text}>Date of Birth: {details.dateOfBirth}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(details.url)}>
                <Text style={[styles.text, { color: 'blue' }]}>More Info...</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ marginTop: 16 }}
                onPress={() => navigation.navigate('DriverRaces', { driverId })}>
                <Text style={{ color: 'blue' }}>Check races</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16,
        marginTop: 8
    },
    error: {
        color: 'red',
        marginTop: 16,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center'
    },
    retry: {
        color: 'blue',
        marginTop: 12,
        fontSize: 16,
        textAlign: 'center',
    }
})

export default DriverDetailsScreen