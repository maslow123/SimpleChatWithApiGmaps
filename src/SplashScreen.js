import React from 'react';
import {
    Text,
    View, StyleSheet,Image
} from 'react-native';

export default class SplashScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    async componentWillMount() {
        setTimeout(
            () => {
                this.props.navigation.navigate('Auth');
            }, 3000
        );
    }
    render() {
        const viewStyles = [
            styles.container,
            { backgroundColor: 'rgb(32,53,70)' }
        ];
        const textStyles = {
            color: 'white',
            fontSize: 40,
            fontWeight: 'bold'
        };

        return (
            <View style={viewStyles}>
                <Image source={require('../src/assets/logoo.png')} style={{right:2}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: '100%'
    },
})