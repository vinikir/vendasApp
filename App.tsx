import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/screens/Login';
import Index from './src/screens/Index';
import AuthProvider from './src/Contexts/auth';
import TrocarSenha from './src/screens/TrocarSenha';
import TelaPagamentos from './src/screens/TelaPagamentos';
import CodePush from 'react-native-code-push';
import Orcamentos from './src/screens/Orcamantos';
import OrcamentoDetalhe from './src/screens/OrcametoDetalhe';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
		
		<NavigationContainer>
			<AuthProvider>
				<Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}> 
					<Stack.Screen name="Login" component={Login}  />
					<Stack.Screen name="Index" component={Index}  />
					<Stack.Screen name="TrocarSenha" component={TrocarSenha}  />
					<Stack.Screen name="TelaPagamento" component={TelaPagamentos}  />
					<Stack.Screen name="Orcamentos" component={Orcamentos}  />
					<Stack.Screen name="OrcamentoDetalhe" component={OrcamentoDetalhe}  />
				</Stack.Navigator>
			</AuthProvider>
    	</NavigationContainer>
  	)

}

export default CodePush({
	checkFrequency: CodePush.CheckFrequency.ON_APP_START,
})(App);

//export default App