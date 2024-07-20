import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/screens/Login';
import Index from './src/screens/Index';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
		
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Index" screenOptions={{headerShown: false}}> 
				<Stack.Screen name="Login" component={Login}  />
				<Stack.Screen name="Index" component={Index}  />
			</Stack.Navigator>
    	</NavigationContainer>
  	)

}

export default App