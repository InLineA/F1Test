import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from './src/types/types'

import { Provider } from 'react-redux'
import { store } from './src/redux/store'

import DriversScreen from './src/screens/DriversScreen'
import DriverDetailsScreen from './src/screens/DriverDetailsScreen'
import DriverRaceScreen from './src/screens/DriverRaceScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Drivers" component={DriversScreen} />
                    <Stack.Screen name="DriverDetails" component={DriverDetailsScreen} />
                    <Stack.Screen name="DriverRaces" component={DriverRaceScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}

export default App
