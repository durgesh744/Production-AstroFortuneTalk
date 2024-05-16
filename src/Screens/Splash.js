import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import React, { useEffect } from 'react';
import MyStatusBar from '../component/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import Video from 'react-native-video';
import { SCREEN_WIDTH } from '../config/Screen';
import { Colors } from '../assets/style';
import { api_url, astrologer_dashboard } from '../config/Constants';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ProviderActions from '../redux/actions/ProviderActions';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

const Splash = ({ navigation, dispatch, route, chatRequestData }) => {
  useEffect(() => {
    setTimeout(() => {
      navigate();
    }, 2000);
  }, []);

  const navigate = async () => {
    let providerData = await AsyncStorage.getItem('userData');
    let data = JSON.parse(providerData);
    if (data) {
      provider_dashboard(data.id);
    } else {
      go_login();
    }
  };

  const get_is_request_active = async () => {
    try {
      const value = await AsyncStorage.getItem('request');
      return value;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      let message = remoteMessage.data;
      if (message?.type == 'Request') {
        get_is_request_active().then(value => {
          if (value == '0') {
            go_provider_chat_pickup(message);
          }
        });
      }
    });
    return () => {
      // unsubscribe;
    };
  }, []);

  const go_provider_chat_pickup = async message => {
    await AsyncStorage.setItem('request', '1').then(res => {
      navigation.replace('acceptChat', { message: message });
    });
  };

  const provider_dashboard = async id => {
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: id,
      },
    })
      .then(res => {
        dispatch(ProviderActions.setDashboard(res.data));
        dispatch(ProviderActions.setProviderData(res.data.data2));
        set_firebase_id(res.data.data2?.id);
        // get_provider_firebase_id(id);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const go_login = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'login' }],
      }),
    );
  };

  const home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { 
            name: 'home',
          },
        ],
      }),
    );
  };

  const set_firebase_id = async id => {
    if (!chatRequestData) {
      home();
    } else {
      navigation.replace('ChatScreen')
    }
  };

  return ( 
    <View style={{ flex: 1 }}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../assets/vedios/splash.gif')}
          style={{ width: SCREEN_WIDTH * 0.9, height: SCREEN_WIDTH * 0.9 }}
        />
        {/* 
        <Video
          source={require('../assets/vedios/splash.mp4')} // Can be a URL or a local file.
          resizeMode="cover"
          muted={true}
          repeat
          style={styles.backgroundVideo}
        /> */}
      </LinearGradient>
    </View>
  );
};

const mapStateToProps = state => ({
  chatRequestData: state.chat.chatRequestData
})

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Splash);

const styles = StyleSheet.create({
  backgroundVideo: {
    height: SCREEN_WIDTH * 0.6,
    width: SCREEN_WIDTH * 0.6,
    backgroundColor: 'transparent',
  },
});
