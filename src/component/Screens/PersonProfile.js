import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Container, Header, Left, Body, Right, } from 'native-base';

export default class PersonProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: {
        userId: props.navigation.getParam('userId'),
        name: props.navigation.getParam('name'),
        phone: props.navigation.getParam('phone'),
        email: props.navigation.getParam('email'),
        image: props.navigation.getParam('image'),
        status: props.navigation.getParam('status')
      },
      textMessage: '',
      messageList: []
    }
  }
  static navigationOptions = {
    header: null
  }

  render() {

    const urlImage = 'http://pluspng.com/img-png/user-png-icon-young-user-icon-2400.png';
    return (
      <Container>
        <Header style={{ backgroundColor: 'white', borderRadius: 20, height: 70 }}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image source={require('../../assets/left.png')} style={{ width: 20, height: 20, opacity: 0.4 }} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 0 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                {this.state.person.name}
              </Text>
            </View>
          </Body>
          <Right>
            <TouchableOpacity>
              <Image source={require('../../assets/logout.png')} style={{ width: 20, height: 20, opacity: 0.4 }} />
            </TouchableOpacity>
          </Right>
        </Header>
        <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{ uri: this.state.person.image == "" ? urlImage : this.state.person.image }} />
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{this.state.person.name}</Text>
              <Text style={styles.info}>{this.state.person.phone} / {this.state.person.email}</Text>
              <Text style={styles.description}>
                {this.state.person.status}
              </Text>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#3994e2",
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },

  // Modal
  containerModal: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: '100%'
  },
  textInput: {
    backgroundColor: '#53d8fb',
    width: "100%",
    padding: 10,
    elevation: 3,
    borderRadius: 5
  },
  // Text input'
  input: {
    height: 40,
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Source Sans Pro',
    borderColor: '#d7acc2',
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    marginTop: 10
  },
  // Button modal
  buttonModal: {
    height: 30,
    width: 100,
    backgroundColor: '#f7c744',
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    alignSelf: 'flex-end'
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    top: 5
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
});