import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
  BackHandler,
  AppRegistry,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Sizes, Colors, Fonts} from './src/assets/style';
import MyStatusBar from './src/component/MyStatusBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
//   import {
//     api_astrodetails,
//     api_url,
//     update_intake_status,
//   } from '../config/Constants';
import database from '@react-native-firebase/database';
import {Provider, connect} from 'react-redux';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
//   import Loader from '../component/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './src/component/Loader';
//   import * as ChatActions from '../redux/actions/ChatActions';
import {name as appName} from './app.json';
import { useNavigation } from '@react-navigation/native';
import Notifee, {EventType, Events} from '@notifee/react-native';
import * as ChatActions from './src/redux/actions/ChatActions'
import { api_url, update_intake_status } from './src/config/Constants';
import { navigate } from './src/navigation/NavigationServices';


const {width, height} = Dimensions.get('screen');

const IncommingChat = ({dispatch, chatRequestData}) => {
  const [isLoading, setIsLoading] = useState(false)

  const accept_request = async(status1, status2) => {
    setIsLoading(true)
    await Notifee.cancelAllNotifications()
    await Notifee.cancelDisplayedNotifications()
    await axios({
      method: 'post',
      url: api_url + update_intake_status,
      data: {
        request_id: chatRequestData?.astro_id,
        requested_user: chatRequestData?.user_id,
        request_status: status1,
      },
    })
      .then(async res => {
        setIsLoading(false);
        database()
          .ref(`CurrentRequest/${chatRequestData?.astro_id}`)
          .update({
            status: status2,
            invoice_id: chatRequestData?.invoice_id,
          })
          .then(() => {
            console.log(`CurrentRequest/${chatRequestData?.astro_id}`)
            console.log('sdfsdfsdf');
          })
          .catch(err => {
            console.log(err);
          });

        const nodeRef = database().ref( 
          `/CustomerCurrentRequest/${chatRequestData?.user_id}`,
        );

        nodeRef.update({
          status: status2 == 'Accept' ? 'astroAccept' : 'astorReject',
          trans_id:  chatRequestData?.invoice_id,
        }); 
        
        if (status2 == 'Accept') {
          await AsyncStorage.setItem('chatData', JSON.stringify(chatRequestData));
          dispatch(ChatActions.setScreenType('APP_SCREEN'))
        } else {
          reject_in_firebase();
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const reject_in_firebase = () => {
    console.log('rejected')
    const dateNodeRef = database().ref(`/CurrentRequest/${chatRequestData?.astro_id}`);
    dateNodeRef
      .update({
        date: '',
        msg: '',
        name: '',
        pic: '',
        rid: '',
        sid: '',
        wallet: '',
        kundli_id: '',
        minutes: '',
        status: 'Reject',
      })
  
      dispatch(ChatActions.setChatRequestData(null))
      dispatch(ChatActions.setScreenType('APP_SCREEN'))
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{
          //   flex: 1,

          borderRadius: Sizes.fixPadding,
        }}>
        <ImageBackground
          source={require('./src/assets/images/ChatBackground.png')}
          resizeMode="cover"
          style={{height: height}}>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 0.3,

                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              {/* <Image
              source={{uri: chatRequestData?.profile_pic}}
              style={{
                width: 150,
                height: 150,
                borderRadius: 1000,
                //   alignSelf: 'flex-end',
              }}
              resizeMode="contain"
            /> */}
            </View>
            <View
              style={{
                flex: 0.3,
                alignItems: 'center',
                marginHorizontal: Sizes.fixPadding,
              }}>
              <Text
                style={{
                  ...Fonts.white18RobotBold,
                  fontSize: 24,
                  fontWeight: '600',
                  marginVertical: Sizes.fixPadding,
                }}>
                {chatRequestData?.username}
              </Text>
              <Text
                style={{
                  ...Fonts.white18RobotMedium,
                  color: Colors.dullWhite,

                  marginVertical: Sizes.fixPadding * 2.0,
                }}>
                Please accept chat request
              </Text>
              <Image
                source={require('./src/assets/images/user.png')}
                style={{
                  width: height * 0.1,
                  height: height * 0.1,
                  // position: 'absolute',
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  ...Fonts.while22RighteousRegular,

                  fontWeight: '600',
                }}>
                FortuneTalk
              </Text>
            </View>
            <View
              style={{
                flex: 0.2,

                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                  onPress={() => accept_request('ACCEPTED BY ASTRO', 'Accept')}
                style={{
                  //   width: '40%',
                  backgroundColor: Colors.lightGreen,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  padding: Sizes.fixPadding + 5,
                  borderRadius: 40,
                  paddingHorizontal: Sizes.fixPadding * 4.5,
                  alignSelf: 'center',
                }}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={32}
                  color={Colors.white}
                  //   style={{marginHorizontal: Sizes.fixPadding}}
                />

                <Text
                  style={{
                    ...Fonts.white18RobotMedium,
                    fontSize: 24,
                    marginHorizontal: Sizes.fixPadding - 5,
                    textAlign: 'center',
                  }}>
                  Start Chat
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => accept_request('REJECTED', 'Reject')}
                style={{
                  //   width: '40%',
                  backgroundColor: Colors.red,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  padding: Sizes.fixPadding - 2,
                  borderRadius: 40,
                  //   paddingHorizontal: Sizes.fixPadding * 2.5,
                }}>
                <Entypo name="cross" size={30} color={Colors.white} />

                <Text
                  style={{
                    ...Fonts.white18RobotMedium,
                    fontSize: 22,
                    marginHorizontal: Sizes.fixPadding - 5,
                    textAlign: 'center',
                  }}>
                  Reject Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

const mapStateToProps = state =>({
  screenType: state.chat.screenType,
  chatRequestData: state.chat.chatRequestData
})

const mapDispatchToProps = dispatch =>({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(IncommingChat);
