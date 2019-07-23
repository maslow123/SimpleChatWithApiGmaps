import React from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import AuthLoadingScreen from './src/component/AuthLoadingScreen';
import LoginScreen from './src/component/ScreenLogin'
import RegisterScreen from './src/component/ScreenRegister';
import Homepage from './src/component/Screens/Homepage';
import UserProfile from './src/component/Screens/UserProfile';
import PersonProfile from './src/component/Screens/PersonProfile';
import SplashScreen from './src/SplashScreen';

import ChatScreen from './src/component/Screens/Chatscreen';


const AppStack = createStackNavigator({ Home: Homepage , 
                                        Register: RegisterScreen, 
                                        Chatscreen: ChatScreen,
                                        Profile : UserProfile,
                                        FriendProfile : PersonProfile
                                      });
const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
    Splash: SplashScreen
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

