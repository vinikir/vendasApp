import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/screens/Login';
import Index from './src/screens/Index';
import AuthProvider from './src/Contexts/auth';
import TrocarSenha from './src/screens/TrocarSenha';

import CodePush from 'react-native-code-push';


const Stack = createNativeStackNavigator();

const App = () => {

  return (
		
		<NavigationContainer>
			<AuthProvider>
				<Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}> 
					<Stack.Screen name="Login" component={Login}  />
					<Stack.Screen name="Index" component={Index}  />
					<Stack.Screen name="TrocarSenha" component={TrocarSenha}  />
				</Stack.Navigator>
			</AuthProvider>
    	</NavigationContainer>
  	)

}

export default CodePush({
	checkFrequency: CodePush.CheckFrequency.ON_APP_START,
})(App);

//export default App