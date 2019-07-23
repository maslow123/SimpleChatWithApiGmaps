import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import firebase from 'firebase';
import User from '../User';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  componentWillMount(){
    // Your web app's Firebase configuration
    let firebaseConfig = {your firebase config}
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    firebase.database().ref('users/' + User.userId).update({ cond: 'online' })
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync =  async () => {

    await AsyncStorage.getItem('userId').then(response => User.userId = response);
    this.props.navigation.navigate(User.userId ? 'App' : 'Splash');
  };

  // Render any loading content that you like here
  render() {
    
    console.disableYellowBox = true;
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}