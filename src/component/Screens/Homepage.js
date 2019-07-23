import React, { Component } from 'react';
import { StyleSheet, ImageBackground, View, Text, TouchableOpacity, Image, Modal, Dimensions, Alert, FlatList, Animated, AsyncStorage, ActivityIndicator } from 'react-native';
import MapView, { Callout } from 'react-native-maps';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import { DoubleCircleLoader } from 'react-native-indicator';
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import firebase from 'firebase';
import User from '../../User';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 60;

export default class Homepage extends Component {
    constructor(props) {
        super(props)

        this.getLocation()
        this.updateStatus()
        this.request();
        this.state = {
            users: [],
            userId: User.userId,
            latitude: 0,
            longitude: 0,
            email: '',
            image: '',
            name: '',
            password: '',
            phone: '',
            status: '',
            cond: '',
            modalVisible: false,
            itemData: []
        }
    }
    updateStatus = async () => {
        await firebase.database().ref('users/' + User.userId)
            .onDisconnect().update({
                cond: 'offline'
            })
    }

    getLocation = async () => {
        await Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
                firebase.database().ref('users/' + User.userId).update({ latitude: position.coords.latitude, longatitude: position.coords.longitude, cond: "online" })
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }

    realTimeChangedListener = async () => {
        firebase.database().ref('users').on('child_changed', value => {
            const values = value.val();
            values.userId = value.key;
            if (value.key === User.userId) {

                this.setState({
                    users:
                        [...this.state.users]
                })
            } else {
                this.setState({
                    users: this.state.users.map(state => {
                        if (state.userId === values.userId) {
                            state = values
                        }
                        return state;
                    })
                })
            }

        }, err => {
            console.warn('child err', err)
        })
    }

    componentDidMount() {
        let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', async (val) => {
            let person = val.val();
            console.warn('start listere')
            person.userId = val.key;
            // Jika iduser sama maka mengeset state
            if (person.userId === User.userId) {
                await this.setState({
                    userId: person.userId,
                    email: person.email,
                    image: person.image,
                    name: person.name,
                    phone: person.phone,
                    password: person.password,
                    status: person.status,
                    cond: person.cond
                })
                User.email = person.email;
                User.image = person.image;
                User.name = person.name;
                User.phone = person.phone;
                User.password = person.password;
                User.status = person.status
                User.cond = person.cond
            }
            // Jika user beda maka akan mengambil data users
            else {
                await this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        });

        this.realTimeChangedListener();

        this.animation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
            if (index >= this.state.users.length) {
                index = this.state.users.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }
            clearTimeout(this.regionTimeout)
            this.regionTimeout = setTimeout(() => {
                if (this.index !== index) {
                    this.index = index
                    const latitude = this.state.users[index].latitude
                    const longitude = this.state.users[index].longatitude
                    this.map.animateToRegion(
                        {
                            latitude, longitude,
                            latitudeDelta: 0.0002,
                            longitudeDelta: 0.0002,
                        },
                        350
                    )
                }
            }, 10)
        })
    }

    componentWillMount() {
        this.index = 0;
        this.animation = new Animated.Value(0)
    }
    componentWillUnmount() {
      firebase.database().ref('users/' + User.userId).update({ cond: 'offline' })
    }
    // Logout 
    _logout = async () => {
        await firebase.database().ref('users/' + User.userId)
            .update({
                cond: 'offline'
            })
        await AsyncStorage.clear();

        this.props.navigation.navigate('Login');
    }
    // Modal
    modalHandler = (data) => {
        User.itemData = data;
        this.setState({ modalVisible: true, itemData: User.itemData })
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    // From flatlist
    renderRow = ({ item }) => {
        
        const urlImage = 'http://pluspng.com/img-png/user-png-icon-young-user-icon-2400.png';
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Chatscreen', item)}>
                <View style={styles.renderItemContainer}>
                    <View>
                        <Text style={{ paddingBottom: 13, fontWeight: 'bold', color: 'black' }} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text style={[styles.condStatus, { backgroundColor: item.cond == 'online' ? '#1da548' : '#999' }]}
                        >
                        </Text>
                    </View>
                    <Image style={{ width: 100, height: 100 }} source={{ uri: item.image == "" ? urlImage : item.image }} />
                    <Text style={styles.renderItemText} numberOfLines={1}>
                        {item.email}
                    </Text>
                    <TouchableOpacity
                        style={styles.renderItemButton} onPress={() => this.modalHandler(item)}>
                        <Text style={{ color: 'white', top:5, alignSelf:'center' }}>CHOOSE</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
    // Modal material menu
    _menu = null;
    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
        this.props.navigation.navigate('Profile')
    };

    showMenu = () => {
        this._menu.show();
    };
    // Request Gmaps
    request = async () => {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted) {
            console.warn("You can use the ACCESS_FINE_LOCATION")
        }
        else {
            console.warn("ACCESS_FINE_LOCATION permission denied")
        }
    }
    // Header navigation
    static navigationOptions = {
        header: null
    }

    render() {

        console.disableYellowBox = true;
        const urlImage = 'http://pluspng.com/img-png/user-png-icon-young-user-icon-2400.png';

        if (this.state.users != "" && this.state.longitude != 0) {
            return (
                <Container>
                    <Header style={{ backgroundColor: 'transparent', width: '100%', height: 60 }}>
                        <Left style={{ flex: 1 }}>
                            <TouchableOpacity>
                                <Image
                                    source={{ uri: this.state.image == "" ? urlImage : this.state.image }}
                                    style={styles.leftImage} />
                            </TouchableOpacity>
                        </Left>
                        <Body style={{ flex: 0 }}>
                            <View style={{ flexDirection: 'row' }}>

                                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'black' }}>
                                        Me Chat
                                    </Text>
                                </View>
                            </View>
                        </Body>
                        <Right>
                            <TouchableOpacity>
                                <Menu style={{ marginTop: '5%', paddingTop: 0, paddingBottom: 0 }}
                                    ref={this.setMenuRef}
                                    button={
                                        <TouchableOpacity onPress={this.showMenu} >
                                            <Image
                                                source={require('../../assets/option.png')}
                                                style={{ width: 25, height: 25, opacity: 0.5 }} />
                                        </TouchableOpacity>
                                    }>
                                    <MenuItem onPress={this.hideMenu} style={{ paddingTop: 5 }}>
                                        Profile
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem onPress={this._logout} style={{ paddingTop: 5 }}>Logout</MenuItem>
                                    <MenuDivider />
                                </Menu>
                            </TouchableOpacity>
                        </Right>
                    </Header>
                    <View style={styles.container}>
                        {/* MODAL */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                            }}>
                            <View style={[styles.container, { backgroundColor: 'rgba(118, 122, 77, 0.12)' }]}>
                                <View style={styles.textInput}>
                                    <View style={{ justifyContent: 'center', flex: 1, alignContent: 'center' }}>
                                        <Text style={styles.containerText}>
                                            {User.itemData === null ? this.state.name : User.itemData.name}
                                        </Text>
                                    </View>
                                    <Image
                                        source={User.itemData === null ? require('../../assets/profile.png') : { uri: User.itemData.image }}
                                        style={styles.containerImage}
                                    />
                                    <Text style={{ alignSelf: 'center', fontWeight: 'bold', paddingTop: 3 }}>
                                        {User.itemData === null ? this.state.phone : User.itemData.phone}
                                    </Text>
                                    {/* Profile Modal */}
                                    <Button onPress={() => { this.setState({ modalVisible: false }); this.props.navigation.navigate('FriendProfile', User.itemData) }} style={{ justifyContent: 'center', alignSelf: 'center', marginTop: 10, backgroundColor: '#ff496e', width: '70%' }}>
                                        <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Lihat profile</Text>
                                    </Button>
                                    {/* Chat Modal */}
                                    <Button onPress={() => { this.setState({ modalVisible: false }); this.props.navigation.navigate('Chatscreen', User.itemData) }} style={{ alignSelf: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#567afb', width: '70%' }}>
                                        <Text style={styles.containerChatModal}>Ajak chat dia !</Text>
                                    </Button>
                                    {/* Modal Close */}
                                    <TouchableOpacity
                                        style={{ position: 'absolute', right: '2%' }}
                                        onPress={() => {
                                            this.setModalVisible(!this.state.modalVisible);
                                        }}
                                    >
                                        <Image source={require('../../assets/close.png')} style={{ width: 20, height: 20 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        {/* END MODAL */}
                        <View style={styles.containerMap}>
                            <MapView style={styles.map}
                                ref={map => this.map = map}
                                initialRegion={{
                                    latitude: this.state.latitude,
                                    longitude: this.state.longitude,

                                    latitudeDelta: 0.0002,
                                    longitudeDelta: 0.0002,
                                }}
                            >
                                <MapView.Marker
                                    coordinate={{
                                        latitude: User.latitude == null ? this.state.latitude : User.latitude,
                                        longitude: User.longitude == null ? this.state.longitude : User.longitude,
                                    }}
                                    title={User.name}
                                    description="Its You !"
                                >
                                    <View style={styles.radius}>
                                        <View style={styles.marker} />
                                    </View>
                                </MapView.Marker>
                                {
                                    this.state.users.map((item, i) => {
                                        return (
                                            <MapView.Marker
                                                onClick={this.onMarkerClick}
                                                key={i}
                                                coordinate={{
                                                    latitude: item.email !== this.state.email ? Number(item.latitude) : this.state.latitude,
                                                    longitude: item.email !== this.state.email ? Number(item.longatitude) : this.state.longitude,
                                                }}
                                                title={item.name + ' Found !'}
                                                description={item.email !== this.state.email ? item.name : 'You !'}
                                            >
                                                <Callout
                                                    tooltip={false}
                                                >
                                                    <View style={{ backgroundColor: '#1c84c6' }}>
                                                        <Text style={{marginLeft:5,marginRight:5,fontSize:13,color:'white',fontWeight:'bold',alignSelf:'center'}}>{item.phone}</Text>
                                                        <TouchableOpacity onPress={() => console.warn('hey')} style={{ paddingTop:10
                                                        }} >
                                                            <Image source={{ uri: item.image == "" ? urlImage : item.image }} style={{ width: 70, height: 70, borderRadius: 70, justifyContent: 'center',alignSelf:'center',borderWidth:1,elevation:5,borderColor:'#999' }} />
                                                            <View style={{ backgroundColor: "#f8ac59", justifyContent:'center',alignSelf:'center',alignContent:'center',borderRadius:3,marginTop:10,height:20,width:'100%' }}>
                                                                <Text style={{ color: 'white',paddingTop:1,alignSelf:'center',fontSize:12,marginLeft:5,marginRight:5,fontWeight:'bold' }}>{item.name}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </Callout>
                                            </MapView.Marker>
                                        )

                                    })

                                }
                            </MapView>
                        </View>
                        <View style={{ flex: 4, width: '100%' }}>
                            <Animated.ScrollView
                                horizontal={true}
                                scrollEventThrottle={1}
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={CARD_WIDTH}
                                onScroll={Animated.event(
                                    [
                                        {
                                            nativeEvent: {
                                                contentOffset: {
                                                    x: this.animation,
                                                },
                                            },
                                        },
                                    ],
                                    { useNativeDriver: true }
                                )}>
                                <FlatList
                                    data={this.state.users}
                                    renderItem={this.renderRow}
                                    horizontal={true}
                                />
                            </Animated.ScrollView>
                        </View>
                    </View>
                </Container>
            )
        } else {
            return (
                <ImageBackground source={require('../../assets/background.jpg')} style={{ width: '100%', height: '100%' }}>
                    <View style={styles.loading}>
                        <Text style={{ fontSize: 18, color: '#f00', paddingBottom: 10, fontWeight: 'bold' }}>
                            Please wait, we are looking for your location..
                        </Text>
                        <DoubleCircleLoader size={40} color="#ff7591" />
                    </View>
                </ImageBackground>
            )
        }
    }
}

var styles = StyleSheet.create({
    // Loading screen
    loading: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 254, 241, 0.61)',
        width: '90%',
        height: '30%',
        justifyContent: 'center',
        position: 'absolute',
        borderRadius: 10,
        top: '30%'
    },
    container: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: '100%'
    },
    containerMap: {
        backgroundColor: '#F5FCFF',
        height: '60%',
        width: '100%'
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    scrollContainer: {
        height,
    },
    image: {
        width,
        height,
    },
    marker: {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 20 / 2,
        overflow: 'hidden',
        backgroundColor: '#007AFF'
    },
    radius: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,122,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,112,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    },
    textInput: {
        backgroundColor: '#fff',
        width: "70%",
        height: 250,
        padding: 10,
        elevation: 3,
        borderRadius: 5
    },
    // Render Item
    renderItemContainer: {
        flex: 1,
        width: 150,
        height: 250,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e8eaed',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    renderItemText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        paddingTop: 10
    },
    renderItemButton: {
        width: 100,
        marginBottom: '20%',
        alignSelf: 'center',
        height: 30,
        backgroundColor: '#2dc1c3'
    },
    // Header
    leftImage: {
        width: 40,
        height: 40,
        borderRadius: 25,
        borderWidth: 1
    },
    // Content
    containerText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    condStatus: {
        position: 'absolute',
        top:'5%',
        left: '-13%',
        borderRadius: 10,
        width: 10,
        height: 10,

    },
    containerImage: {
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 70,
        borderWidth: 1,
        elevation: 20
    },
    containerChatModal: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});