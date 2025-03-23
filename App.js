import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

import ManageExpense from './screens/ManageExpense';
import RecentExpenses from './screens/RecentExpenses';
import AllExpenses from './screens/AllExpenses';
import { GlobalStyles } from './constants/styles';
import IconButton from './components/UI/IconButton';
import ExpensesContextProvider  from './store/expenses-context';
import AuthContextProvider, {AuthContext} from './store/auth-context';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import * as SplashScreen from "expo-splash-screen";
import { useState, useContext, useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {backgroundColor: GlobalStyles.colors.primary500},
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary700 },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: "Login"}}
        />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{title:"Sign Up"}}
      />
    </Stack.Navigator>
  );
}

function ExpensesOverview(){

  const authCtx = useContext(AuthContext);

  return (
   <BottomTabs.Navigator 
    screenOptions={({navigation}) => ({
      headerStyle: {backgroundColor: GlobalStyles.colors.primary500},
      headerTintColor: 'white',
      tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
      tabBarActiveTintColor : GlobalStyles.colors.accent500,
      headerRight: ({tintColor}) => (
      <IconButton 
        icon="add" 
        size={24} 
        color={tintColor} 
        onPress={() => {
          navigation.navigate('ManageExpense');
        }} 
      />
    ),
    headerLeft: ({ tintColor }) => (
      <IconButton 
        icon="log-out" 
        size={24} 
        color={tintColor} 
        onPress={authCtx.logout} 
      />
    ),
   })}
   >
      <BottomTabs.Screen 
        name='RecentExpenses' 
        component={RecentExpenses} 
        options={{
          title: 'Recent Expenses',
          tabBarLabel: 'Recent',
          tabBarIcon: ({color, size}) => (
          <Ionicons name='hourglass' size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen 
        name='AllExpenses' 
        component={AllExpenses} 
        options={{
          title: 'All Expenses',
          tabBarLabel: 'All Expenses',
          tabBarIcon: ({color, size}) => (
          <Ionicons name='calendar' size={size} color={color} />
          ),
        }}/>
  </BottomTabs.Navigator>
  )
}

function Root() {
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsLoading(false);
      SplashScreen.hideAsync();
    }

    fetchToken();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {authCtx.isAuthenticated ? <ExpenseStack/> : <AuthStack/>}
    </NavigationContainer>
  )
}

function ExpenseStack() {
  return (
    <>
      <StatusBar style="light" />
      <ExpensesContextProvider>
      
        <Stack.Navigator 
          screenOptions={{
            headerStyle: {backgroundColor: GlobalStyles.colors.primary500},
            headerTintColor: 'white',
        }}>
          <Stack.Screen 
            name='ExpensesOverview' 
            component={ExpensesOverview} 
            options={{headerShown: false}} 
          />
          <Stack.Screen 
            name='ManageExpense' 
            component={ManageExpense} 
            options={{
              presentation: 'modal',

          }} />
        </Stack.Navigator>
      
      </ExpensesContextProvider>
    </>
  );
}
export default function App() {
  
  return(
    <AuthContextProvider>
      <StatusBar style="light"/>
      <Root/>
    </AuthContextProvider>
  )
}



