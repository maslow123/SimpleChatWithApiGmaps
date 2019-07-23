import React from 'react';
import { View, SafeAreaView, Text, TextInput, TouchableOpacity, Dimensions, FlatList, StyleSheet, Image } from 'react-native';
import { Container, Header, Left, Body, Right } from 'native-base';

import firebase from 'firebase';
import User from '../../User';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

export default class Chatscreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    _menu = null;
    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
        this.props.navigation.navigate('FriendProfile',this.state.person)
    };

    showMenu = () => {
        this._menu.show();
    };
    constructor(props) {
        super(props);
        this.state = {
            person: {
                userId: props.navigation.getParam('userId'),
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone'),
                email: props.navigation.getParam('email'),
                image: props.navigation.getParam('image'),
                status: props.navigation.getParam('status'),
                cond: props.navigation.getParam('cond')
            },
            textMessage: '',
            messageList: []
        }
    }
    componentDidMount() {
        firebase.database().ref('messages').child(User.userId).child(this.state.person.userId)
            .on('child_added', (value) => {
                this.setState((prevState) => {
                    return {
                        messageList: [...prevState.messageList, value.val()]
                    }
                })
            })
    }
    handleChange = key => val => {
        this.setState({ [key]: val })
    }
    convertTime = (time) => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';

        result += (d.getHours() && d.getMinutes() < 10 ? '0' : '') + d.getMinutes(); // Jika jam kurang dari 10, maka nambah 0 sebelum menit

        if (c.getDay() !== d.getDay()) {
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
        }
        return result;
    }
    sendMessage = async () => {
        if (this.state.textMessage.length > 0) {
            let msgId = firebase.database().ref('messages').child(User.userId).child(this.state.person.userId).push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.userId,
            }
            updates['messages/' + User.userId + '/' + this.state.person.userId + '/' + msgId] = message;
            updates['messages/' + this.state.person.userId + '/' + User.userId + '/' + msgId] = message;
            firebase.database().ref().update(updates);
        }
        this.setState({ textMessage: "" });
    }

    renderRow = ({ item }) => {
        return (

            <View style={[styles.renderItem, {
                alignSelf: item.from === User.userId ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User.userId ? '#2dc1c3' : '#f5f9fa',
            }]}>
                <Image
                    source={item.from === User.userId ? '' : { uri: this.state.person.image }}
                    style={
                        [styles.renderItemImage, {
                            position: item.from === User.userId ? 'absolute' : 'relative',
                            alignSelf: item.from === User.userId ? 'flex-end' : 'flex-start',
                            marginTop: item.from === User.userId ? 10 : 0
                        }
                        ]
                    }
                />
                <Text style={{
                    color: item.from === User.userId ? '#eee' : '#b4b9c5',
                    position: item.from === User.userId ? 'absolute' : 'relative',
                    right: 0,
                    alignSelf: item.from === User.userId ? 'flex-start' : 'flex-start',
                    paddingLeft: item.from === User.useId ? 0 : 10,
                    paddingRight: item.from === User.userId ? 10 : 0,
                    fontSize: 12,
                }}>
                    {this.convertTime(item.time)}
                </Text>
                <Text style={[styles.renderItemText, {
                    color: item.from === User.userId ? '#fff' : '#7d8889',
                    paddingLeft: item.from === User.userId ? 20 : 0,
                    paddingRight: item.from === User.userId ? 0 : 20,
                }]}>
                    {item.message}
                </Text>
            </View>
        )
    }
    render() {
        
        const urlImage = 'http://pluspng.com/img-png/user-png-icon-young-user-icon-2400.png';
        let { height } = Dimensions.get('window');
        return (
            <Container>
                <Header style={{ backgroundColor: 'white', borderRadius: 20, height: 70 }}>
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image
                                source={require('../../assets/left.png')}
                                style={{ width: 20, height: 20, opacity: 0.4 }}
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 6 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginLeft: 10, marginRight: 10 }}>
                                <Image source={{ uri: this.state.person.image == "" ? urlImage : this.state.person.image }} style={styles.bodyContainer} />
                                <Text
                                    style={[styles.bodyContainerText,{
                                        backgroundColor: this.state.person.cond == 'online' ? '#1da548' : '#999',
                                        color: this.state.person.cond == 'online' ? '#1da548' : '#999',
                                    }]}>
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                                    {this.state.person.name}
                                </Text>
                                <Text
                                    style={{
                                        color: '#999',
                                        fontFamily: 'calibri',
                                        fontWeight: this.state.person.cond == 'online' ? 'bold' : 'normal'
                                    }}>
                                    {this.state.person.cond == 'online' ? 'Active now' : 'Offline'}
                                </Text>
                            </View>
                        </View>
                    </Body>
                    <Right>
                        <TouchableOpacity>
                            <Menu
                                ref={this.setMenuRef}
                                button={
                                    <TouchableOpacity onPress={this.showMenu}>
                                        <Image
                                            source={require('../../assets/option.png')}
                                            style={{ width: 25, height: 25, opacity: 0.5 }} />
                                    </TouchableOpacity>
                                }>
                                <MenuItem onPress={this.hideMenu}>Profile</MenuItem>
                                <MenuDivider />
                            </Menu>
                        </TouchableOpacity>
                    </Right>
                </Header>
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        style={{ padding: 10, height: height * 0.8 }}
                        data={this.state.messageList}
                        renderItem={this.renderRow}
                        ref={ref => this.flatList = ref}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.flatList.scrollToEnd({ animated: true });
                        }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5 }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={this.handleChange('textMessage')}
                            placeholder="Type message..."
                            multiline={true}
                            numberOfLines={3}
                            value={this.state.textMessage}
                        />
                        <TouchableOpacity onPress={this.sendMessage} style={{ width: '10%', paddingBottom: 10, marginLeft: 5 }}>
                            <Image source={require('../../assets/send.png')} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        width: "90%",
        borderWidth: 1,
        borderRadius: 5,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#2dc1c3'
    },
    btnText: {
        color: "darkblue",
        fontSize: 20
    },
    // Render item
    renderItem: {
        borderRadius: 10,
        marginBottom: 10,
        flex: 1,
        flexDirection: 'row',
        width: '60%',
    },
    renderItemImage: {
        width: 20,
        height: 20,
        borderRadius: 30,
        flexDirection: 'row',
        right: 0,
    },
    renderItemText: {
        padding: 7,
        fontSize: 16,
        width: '80%',
        marginTop: 5,
        marginBottom: 10,
    },
    // Body Title
    bodyContainer: {
        width: 45, 
        height: 45, 
        borderRadius: 25, 
        borderWidth: 1
    },
    bodyContainerText: {
        width: 15,
        height: 15,
        position: 'absolute',
        right: 0,
        bottom: 0,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#eafee9'
    }
});