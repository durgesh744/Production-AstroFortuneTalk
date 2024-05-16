import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import CountryPicker from 'react-native-country-picker-modal';
import {Divider, Input} from '@rneui/themed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MyStatusBar from '../component/MyStatusBar';
import {connect} from 'react-redux';
import * as ProviderActions from '../redux/actions/ProviderActions';
import {
  add_or_update_device_token,
  api_url,
  astrologer_dashboard,
  astrologer_login,
  base_url,
} from '../config/Constants';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import Loader from '../component/Loader';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MyMethods} from '../methods/MyMethods';

const {width, height} = Dimensions.get('screen');

const Login = ({navigation, dispatch}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    get_token();
  }, []);

  const get_token = async () => {
    let fcm_token = await messaging().getToken();
    console.log(fcm_token)
    setFcmToken(fcm_token);
  };

  const email_validation = e => {
    let email = e;
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(email.value)) {
      // Yay! valid
      return true;
    } else {
      return false;
    }
  };

  const validation = () => {
    if (email.length == 0) {
      Alert.alert('Please enter your email');
      return false;
    } else if (email_validation(email)) {
      Alert.alert('Please enter correct email address.');
      return false;
    } else if (password.length == 0) {
      Alert.alert('Please enter your password.');
    } else {
      return true;
    }
  };

  const login = async () => {
    setIsLoading(true);
    let fcm_token = await messaging().getToken();
    await axios({
      method: 'post',
      url: base_url + astrologer_login,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        email: email,
        password: password,
      },
    })
      .then(async res => {
        if (res.data?.success == '200') {
          await AsyncStorage.setItem('userData', JSON.stringify(res.data.data));
          update_fcm_token(res.data.data.id, 'null');
        } else {
          setIsLoading(false);
          Alert.alert('Please check your email and password.');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const provider_dashboard = async id => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: id,
      },
    })
      .then(res => {
        setIsLoading(false);
        dispatch(ProviderActions.setDashboard(res.data));
        dispatch(ProviderActions.setProviderData(res.data.data2));
        set_firebase_id(res.data.data2?.id);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const update_fcm_token = async (user_id, uid) => {
    setIsLoading(true);
    let fcm_token = await messaging().getToken();
    await axios({
      method: 'post',
      url: api_url + add_or_update_device_token,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: user_id,
        user_type: 'astrologer',
        device_token: fcm_token,
        token: uid,
      },
    })
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        provider_dashboard(user_id);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home'}],
      }),
    );
  };

  const set_firebase_id = id => {
    database()
      .ref(`AstroId/${id}`)
      .once('value', snapshot => {
        dispatch(ProviderActions.setFirebaseId(snapshot.val()));
      })
      .then(() => {
        home();
      })
      .catch(err => {
        console.log(err);
      });
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
        style={{flex: 1}}>
        {/* {skipInfo()} */}
        {imageInfo()}
        <ScrollView style={styles.bottomContainer}>
          <View style={{flex: 1, marginTop: height * 0.04}}>
            {topTitleInfo()}
            {emailInput()}
            {passwordInput()}
            {termsPrivacyInfo()}
            {submiteButtonInfo()}
            {bottomViewInfo()}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  function bottomViewInfo() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginBottom: Sizes.fixPadding,
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/icon/Pure.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={{...Fonts.grayLightRobotoRegular, textAlign: 'center'}}>
            100%{'\n'}Safety Surety
          </Text>
        </View>
        <Divider orientation="vertical" />
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/icon/private.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={{...Fonts.grayLightRobotoRegular, textAlign: 'center'}}>
            100%{'\n'}Private
          </Text>
        </View>
      </View>
    );
  }

  function submiteButtonInfo() {
    return (
      <TouchableOpacity
        onPress={() => (validation() ? login() : null)}
        // onPress={()=>navigation.navigate('customerLiveClass')}
        style={{
          width: '70%',
          marginVertical: Sizes.fixPadding * 2,
          alignSelf: 'center',
          marginBottom: Sizes.fixPadding * 7.0,
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{
            width: '100%',
            paddingVertical: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 1.5,
          }}>
          <Text style={{...Fonts.white18RobotBold, textAlign: 'center'}}>
            Sign in
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function termsPrivacyInfo() {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            textAlign: 'right',
            right: width * 0.1,
            marginVertical: Sizes.fixPadding,
          }}>
          Forgot password
        </Text>
      </TouchableOpacity>
    );
  }

  function emailInput() {
    const emailinputRef = createRef();
    return (
      <Input
        ref={emailinputRef}
        placeholder="Email ID"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
        inputContainerStyle={[
          styles.inputContainer,
          {marginTop: Sizes.fixPadding * 2},
        ]}
        inputStyle={{...Fonts.black16RobotoRegular}}
      />
    );
  }

  function passwordInput() {
    const passinputRef = createRef();
    return (
      <Input
        secureTextEntry={true}
        ref={passinputRef}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        inputContainerStyle={styles.inputContainer}
        inputStyle={{...Fonts.black16RobotoRegular}}
      />
    );
  }
  function topTitleInfo() {
    return (
      <Text
        style={{
          ...Fonts.primaryDark16RobotoMedium,
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 10,
        }}>
        Get Started With Fortune Talk!
      </Text>
    );
  }

  function imageInfo() {
    return (
      <View style={{flex: 0.3, justifyContent: 'center'}}>
        <Image
          source={require('../assets/images/user.png')}
          style={{
            width: '40%',
            height: '100%',
            resizeMode: 'contain',
            alignSelf: 'center',
            marginTop: height * 0.1,
          }}
        />
      </View>
    );
  }

  function skipInfo() {
    return (
      <TouchableOpacity
        style={{
          flex: 0,
          alignSelf: 'flex-end',
          margin: Sizes.fixPadding * 2,
        }}>
        <Text style={{...Fonts.white11InterMedium}}>Skip</Text>
      </TouchableOpacity>
    );
  }
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(null, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 0.8,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Sizes.fixPadding * 7,
    paddingTop: Sizes.fixPadding * 2,
    marginTop: height * 0.09,
  },
  inputContainer: {
    marginHorizontal: Sizes.fixPadding * 3,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: 0,
    // marginTop: Sizes.fixPadding * 2,
  },
  flagContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Sizes.fixPadding * 0.8,
    borderRightWidth: 1,
    borderColor: Colors.grayLight,
  },
  socialButton: {
    flex: 0,
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 0.8,
    borderRadius: Sizes.fixPadding,
  },
});
