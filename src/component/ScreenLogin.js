import React from 'react';
import { StyleSheet, View, Text, Image, Alert, TouchableWithoutFeedback, StatusBar, TextInput, SafeAreaView, Dimensions, TouchableOpacity, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import firebase from 'firebase'
import User from '../User'
import Loader from './Loader'

export default class Login extends React.Component {
    static navigationOptions = {
        header: null
    }
    state = {
        email: '',
        password: '',
        idUser: '',
        phone: '',
        loading: 'false',
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }
    submitForm = async () => {
        this.setState({ loading: true })
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).
            then(async (response) => {
                await AsyncStorage.setItem('userId', response.user.uid)
                User.userId = response.user.uid
                this.props.navigation.navigate('Home');
                this.setState({loading: false} )

            })
            .catch(() => {
                this.setState({loading:false})
                Alert.alert('Error', 'Please check again your email and password !')
            })
    }

    render() {
        
    console.disableYellowBox = true;
        return (
            <SafeAreaView style={styles.container}>
                <Loader
                    loading={this.state.loading} />
                <StatusBar barStyle="light-content" />
                <KeyboardAvoidingView style={styles.container}>
                    <TouchableWithoutFeedback style={styles.container}>
                        <View style={styles.container}>
                            <View style={styles.logoContainer}>
                                <Image style={styles.logo}
                                    source={require('../assets/logo.png')}>
                                </Image>
                                <Text style={styles.title}>Temukan teman dan mari mengobrol bersama !</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <TextInput style={styles.input}
                                    placeholder="Please input your email !"
                                    placeholderTextColor='rgba(255,255,255,0.8)'
                                    keyboardType='email-address'
                                    returnKeyType='next'
                                    autoCorrect={false}
                                    value={this.state.email}
                                    onChangeText={this.handleChange('email')}
                                    onSubmitEditing={() => this.refs.txtPassword.focus()} />

                                <TextInput style={styles.input}
                                    placeholder="Please input your password !"
                                    placeholderTextColor='rgba(255,255,255,0.8)'
                                    returnKeyType='go'
                                    secureTextEntry={true}
                                    value={this.state.password}
                                    onChangeText={this.handleChange('password')}
                                    ref={"txtPassword"} />
                                <View style={styles.containerStyle}>
                                    <View style={styles.sectionButton}>
                                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Register')}>
                                            <Text style={styles.textButton}>SIGN UP</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.sectionButton}>
                                        <TouchableOpacity style={styles.buttonContainer} onPress={this.submitForm}>
                                            <Text style={styles.textButton}>LOGIN</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(32,53,70)',
        flexDirection: 'column'
    },
    containerStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    logo: {
        width: 79,
        height: 79
    },
    title: {
        color: '#f7c744',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: '30%',
        opacity: 0.9
    },
    infoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 200,
        padding: 20
        // backgroundColor: 'red'
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#fff',
        borderColor: '#f7c744',
        marginBottom: 10,
        borderRadius: 5,
        paddingHorizontal: 10
    },
    textButton: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    buttonContainer: {
        backgroundColor: '#f7c744',
        paddingVertical: 15
    },
    sectionButton: {
        flex: 1,
        alignSelf: 'flex-start',
        width: '40%',
        borderWidth: 1
    }
})