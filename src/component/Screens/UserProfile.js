import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import firebase from 'firebase';
import User from '../../User';
import { Container, Header, Left, Body, Right } from 'native-base';

export default class UserProfile extends Component {
  constructor(props) {
    super(props)
    const {name,phone,image,status,email} = User; //user destruction
    this.state = {
      userId : User.userId,
      name: name,
      phone: phone,
      image: image,
      status: status,
      email: email,
      modalVisible: false
    }
  }
  static navigationOptions = {
    header: null
  }


  handleChange = key => val => {
    this.setState({ [key]: val })
  }
  modalHandler = () => {
    this.setState({ modalVisible: true })
  }
  updateUser = async () => {
    const { userId, name, phone, image, status, email } = this.state; // state destruction
    if (name !== '' && phone != "" && image != "" && status != "") {
      firebase.database()
        .ref('users/' + User.userId)
        .update({ name: name, phone: phone, image: image, status: status })
        .then(() => {
          Alert.alert('Data has been success changed !');
          User.name = name;
          User.email = email;
          User.phone = phone;
          User.image = image;
          User.status = status;

          this.setState({ modalVisible: false })
        })
        .catch(() => {
          Alert.alert('Something Wrong !')
        })
    } else {
      Alert.alert('Data cant be null, please check again your form !');
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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
                PROFILE
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
          {/* MODAL */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible === undefined ? false : this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={[styles.containerModal, { backgroundColor: 'rgba(118, 122, 77, 0.12)' }]}>
              <View style={styles.textInput}>
                <View style={{ alignSelf: 'center', top: 10 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Edit your profile</Text>
                </View>
                <View style={{ top: 15 }}>
                  <TextInput
                    style={styles.input}
                    placeholder='Your name'
                    value={this.state.name}
                    onChangeText={this.handleChange('name')}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder='Your Phone'
                    value={this.state.phone}
                    onChangeText={this.handleChange('phone')}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder='Your Image (Please only the URL)'
                    value={this.state.image}
                    onChangeText={this.handleChange('image')}
                  />
                  <TextInput
                    placeholder="Your status"
                    rowSpan={2}
                    value={this.state.status}
                    style={[styles.input, { borderWidth: 1, height: 50 }]}
                    maxLength={50}
                    onChangeText={this.handleChange('status')} />

                  <TouchableOpacity
                    style={[styles.buttonModal, { alignSelf: 'flex-start', backgroundColor: '#DA2C38' }]}
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Text style={styles.textButton}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.buttonModal, styles.buttonRightModal]}
                    onPress={this.updateUser}>
                    <Text style={styles.textButton}>Save</Text>
                  </TouchableOpacity>
                </View>
                {/* Modal Close */}
                <View style={{ position: 'absolute', right: '25%', top: '3%' }}>
                  <Image source={require('../../assets/edit.png')} style={{ width: 20, height: 20, opacity: 0.4 }} />
                </View>
              </View>
            </View>
          </Modal>
          {/* END MODAL */}
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{ uri: this.state.image =='' ? urlImage : this.state.image  }} />
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <TouchableOpacity style={styles.buttonEdit} onPress={() => this.modalHandler()}>
                <Image source={require('../../assets/edit.png')} style={{ width: 20, height: 20, opacity: 0.4 }} />
              </TouchableOpacity>
              <Text style={styles.name}>{this.state.name}</Text>
              <Text style={styles.info}>{this.state.phone} / {this.state.email}</Text>
              <Text style={styles.description}>
                {this.state.status}
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
    backgroundColor: "#00BFFF",
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
  buttonEdit: {
    right: '10%', 
    alignSelf: 'flex-end', 
    height: 20
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
  buttonRightModal : {
    alignSelf: 'flex-end', 
    position: 'absolute', 
    bottom: 0, 
    backgroundColor: '#00BFFF'
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