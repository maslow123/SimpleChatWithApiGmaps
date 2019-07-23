import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Image,
    Alert,
    TouchableOpacity
} from 'react-native';
import firebase from 'firebase';
import User from '../User';

export default class SignUp extends React.Component {
    
    static navigationOptions = {
        header: null
    }
    state = {
        userId: '',
        name: '',
        email: '',
        password: '',
        image: '',
        latitude: '',
        longatitude: '',
        phone: '',
        image: ''
    }
    handleChange = key => val => {
        this.setState({ [key]: val })
    }
    
    submitForm = async () => {
        if (this.state.name.length <= 6) {
            Alert.alert('Error', 'Name cant be less from 6 character')
        } else if (this.state.password.length <= 6) {
            Alert.alert('Error', 'Password cant be less from 6 character')
        } else {
            if(this.state.name !== "",this.state.password !== "",this.state.email !== "",this.state.phone !== ""){
            // Save user data to database
            
                firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((response) => {

                    User.userId = response.user.uid;
                    firebase.database().ref('users/' + User.userId).set({ name: this.state.name, password: this.state.password, email: this.state.email, phone: this.state.phone,image:this.state.image,status:'Available',latitude:0,longatitude:0 })
                    Alert.alert('Success', 'Data has been created ! please login in application')
                    this.props.navigation.navigate('Login');


                })
                .catch(() => {
                    Alert.alert('Email has been used, please change your email !');
                })
            }else {
                Alert.alert('Error', 'only image can be null !')
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo}
                        source={require('../assets/logo.png')}>
                    </Image>
                    <Text style={styles.title}>REGISTER</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/male-user/ultraviolet/50/3498db' }} />
                    <TextInput style={styles.inputs}
                        returnKeyType='next'
                        placeholder="Full name"
                        placeholderTextColor='rgba(255,255,255,0.8)'
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        value={this.state.name}
                        onChangeText={this.handleChange('name')} 
                        onSubmitEditing={() => this.refs.txtPassword.focus()} />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }} />
                    <TextInput style={styles.inputs}
                        returnKeyType='next'
                        placeholder="Password"
                        ref={"txtPassword"}
                        onSubmitEditing={() => this.refs.email.focus()}
                        placeholderTextColor='rgba(255,255,255,0.8)'
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        value={this.state.password}
                        onChangeText={this.handleChange('password')} />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/message/ultraviolet/50/3498db' }} />
                    <TextInput style={styles.inputs}
                        returnKeyType='next'
                        ref={"email"}
                        onSubmitEditing={() => this.refs.phone.focus()}
                        placeholder="Email"
                        placeholderTextColor='rgba(255,255,255,0.8)'
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        value={this.state.email}
                        onChangeText={this.handleChange('email')} />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/phone-2/ultraviolet/50/3498db' }} />
                    <TextInput style={styles.inputs}
                        ref={"phone"}
                        returnKeyType='next'
                        onSubmitEditing={() => this.refs.image.focus()}
                        placeholder="phone"
                        keyboardType="number-pad"
                        placeholderTextColor='rgba(255,255,255,0.8)'
                        underlineColorAndroid='transparent'
                        value={this.state.phone}
                        onChangeText={this.handleChange('phone')} />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/image-2/ultraviolet/50/3498db' }} />
                    <TextInput style={styles.inputs}
                        ref={"phone"}
                        onSubmitEditing={() => this.refs.phone.focus()}
                        placeholder="Your url image"
                        placeholderTextColor='rgba(255,255,255,0.8)'
                        underlineColorAndroid='transparent'
                        value={this.state.image}
                        onChangeText={this.handleChange('image')}
                        returnKeyType='go' />
                </View>
                <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={this.submitForm}>
                    <Text style={styles.signUpText}>SIGN UP</Text>
                </TouchableHighlight>
                <View style={{ flex: 0, flexDirection: 'row', alignSelf: 'center', }}>
                    <Text style={{ color: 'white' }}>Already have account ? </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Auth')}>
                        <Text style={styles.signIn}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(32,53,70)',
    },
    logoContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingRight: 20
    },
    logo: {
        width: 30,
        height: 30
    },
    title: {
        color: '#f7c744',
        fontSize: 25,
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: '10%',
        opacity: 0.9,
        paddingLeft: 5,
        fontWeight: 'bold'
    },
    inputContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 7,
        borderBottomWidth: 1,
        width: 300,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
        color: '#fff'
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 300,
        borderRadius: 7,
    },
    signupButton: {
        backgroundColor: "#f7c744",
    },
    signUpText: {
        color: 'white',
        fontWeight: 'bold'
    },
    signIn: {
        borderBottomColor: 'white', 
        color: '#f7c744', 
        borderBottomWidth: 1, 
        borderBottomColor: '#f7c744' 
    }
});