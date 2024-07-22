import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/screens/Login';
import Index from './src/screens/Index';
import AuthProvider from './src/Contexts/auth';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
		
		<NavigationContainer>
			<AuthProvider>
				<Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}> 
					<Stack.Screen name="Login" component={Login}  />
					<Stack.Screen name="Index" component={Index}  />
				</Stack.Navigator>
			</AuthProvider>
    	</NavigationContainer>
  	)

}

export default App