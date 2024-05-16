import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Sizes, Colors, Fonts} from '../assets/style';
import MyStatusBar from '../component/MyStatusBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import {
  api_astrodetails,
  api_url,
  update_intake_status,
} from '../config/Constants';
import database from '@react-native-firebase/database';
import {connect} from 'react-redux';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import Loader from '../component/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ChatActions from '../redux/actions/ChatActions';

var Sound = require('react-native-sound');

var whoosh = new Sound('chat_request.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const {width, height} = Dimensions.get('screen');
const AcceptChat = ({navigation, route, providerData, dispatch}) => {
  
  const [message] = useState(route?.params?.message);
  const [isLoading, setIsLoading] = useState(false);

  console.log(message)

  useEffect(() => {
    whoosh.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
    whoosh.setNumberOfLoops(-1);
    return ()=>whoosh.stop()
  }, []);

  useEffect(()=>{
    try{
      // database().ref(`CurrentRequest/${providerData?.id}`).on('value', snapshot=>{
      //   if(snapshot.val() && snapshot.val()?.status == 'timeOver'){
      //     whoosh.stop();
      //     reject_in_firebase()
      //   }
      // })
    }catch(e){
      console.log(e)
    }
    return ()=>{
      database().ref(`CurrentRequest/${providerData?.id}`).off()
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp()
        return true
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  const accept_request = async (status1, status2) => {
    whoosh.stop();
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + update_intake_status,
      data: {
        request_id: providerData?.id,
        requested_user: message?.user_id,
        request_status: status1,
      },
    })
      .then(async res => {
        setIsLoading(false);
        await database()
          .ref(`CurrentRequest/${providerData?.id}`)
          .update({
            status: status2,
            invoice_id: message?.invoice_id,
          })
          .then(() => {
            console.log('sdfsdfsdf');
          })
          .catch(err => {
            console.log(err);
          });

        const nodeRef = database().ref(
          `/CustomerCurrentRequest/${message?.user_id}`,
        );

        nodeRef.update({
          status: status2 == 'Accept' ? 'astroAccept' : 'astorReject',
        });
        if (status2 == 'Accept') {
          await AsyncStorage.setItem('chatData', JSON.stringify(message));
          const astroFirebaseID = await AsyncStorage.getItem('FirebaseId');
          const customerFirebaseID = (
            await database().ref(`UserId/${message?.user_id}`).once('value')
          ).val();
          // dispatch(ChatActions.setAstroFirebaseId(astroFirebaseID));
          // dispatch(ChatActions.setCustomerFirebaseId(customerFirebaseID));
          // navigation.navigate('ChatScreen', {
          //   customerData: message,
          // });
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
    const dateNodeRef = database().ref(`/CurrentRequest/${providerData?.id}`);
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
      .then(res => {
        console.log('updated');
        home();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const home = () => {
    console.log('hme')
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home'}],
      }),
    );
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
          source={require('../assets/images/ChatBackground.png')}
          resizeMode="cover"
          style={{height: height}}>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 0.3,

                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Image
                source={{uri: message?.profile_pic}}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 1000,
                  //   alignSelf: 'flex-end',
                }}
                resizeMode="contain"
              />
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
                {message?.username}
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
                source={require('../assets/images/user.png')}
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

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
  requestData: state.provider.requestData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(AcceptChat);
