/* eslint-disable semi */
import React, { useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native'

import { useDispatch, useSelector } from 'react-redux'
import { fetchDrivers } from '../redux/slices/driversSlice'
import type { RootState, AppDispatch } from '../redux/store'

import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { RootStackParamList } from '../types/types'

const DriversScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const { driversMap, loading, error, page, total, limit } = useSelector(
        (state: RootState) => state.drivers
    )

    const drivers = Object.values(driversMap)

    useEffect(() => {
        dispatch(fetchDrivers(0))
    }, [])

    const loadMore = () => {
        if (!loading && drivers.length < total) {
            dispatch(fetchDrivers(page + 1))
        }
    }

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('DriverDetails', { driverId: item.driverId })
            }
            style={styles.item}
        >
            <View style={styles.textContainer}>
                <Text>{`${item.givenName} ${item.familyName}`}</Text>
                <Text style={styles.nationality}>{item.nationality}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('DriverRaces', { driverId: item.driverId })}>
                <Image source={require('../assets/icons/races.png')} style={styles.icon} />
            </TouchableOpacity>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            {error && (
                <TouchableOpacity onPress={() => dispatch(fetchDrivers(page))}>
                    <Text style={styles.error}>{error} (нажмите, чтобы повторить)</Text>
                </TouchableOpacity>
            )}
            <FlatList
                data={drivers}
                keyExtractor={item => item.driverId}
                renderItem={renderItem}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator /> : null}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
    },
    textContainer: {
        flex: 1, 
    },
    nationality: {
        fontSize: 12,
        color: 'gray',
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: 'black'
    },
})

export default DriversScreen
