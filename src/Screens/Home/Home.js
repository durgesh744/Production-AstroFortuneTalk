import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import MyStatusBar from '../../component/MyStatusBar';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Switch} from 'react-native-switch';
import LinearGradient from 'react-native-linear-gradient';
import {Divider} from '@rneui/themed';
import {SCREEN_WIDTH} from '../../config/Screen';
import {
  api_url,
  astrologer_dashboard,
  boost_astrologer,
  change_status,
  change_status_call,
  feedback_astro_application,
  footer_slider_astrologer,
  get_boost_amount,
  go_live_astro,
  img_url,
  img_url_2,
  moa_update,
  next_log_status,
  traning_reel_astro_id,
  trending_astrologer,
} from '../../config/Constants';
import {connect} from 'react-redux';
import axios from 'axios';
import * as ProviderActions from '../../redux/actions/ProviderActions';
import moment from 'moment';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import Loader from '../../component/Loader';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {provider_img_url} from '../../config/Constants';
import {ApiRequests} from '../../config/requests';
import Banner from '../../component/Banner';
import Carousel from 'react-native-reanimated-carousel';
import {SafeAreaView} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

const {width, height} = Dimensions.get('screen');


const tabsData = [
  {
    id: 1,
    name: 'Call',
    icon: require('../../assets/icon/phone_icon.png'),
    navigate_to: 'callHistory',
  },
  {
    id: 2,
    name: 'Chat',
    icon: require('../../assets/icon/chat_icon.png'),
    navigate_to: 'chatHistory',
  },
  {
    id: 3,
    name: 'Wallet',
    icon: require('../../assets/icon/wallet_icon.png'),
    navigate_to: 'walletHistory',
  },
  {
    id: 4,
    name: 'LIve Events',
    icon: require('../../assets/icon/zoom_icon.png'),
    navigate_to: 'LiveEvent',
  },
  {
    id: 5,
    name: 'Waitlist',
    icon: require('../../assets/icon/waitlist_icon.png'),
    navigate_to: 'waitList',
  },
  {
    id: 6,
    name: 'Support',
    icon: require('../../assets/icon/support_icon.png'),
    navigate_to: 'SupportChat',
  },
  {
    id: 7,
    name: 'Offers',
    icon: require('../../assets/icon/offer_icon.png'),
    navigate_to: 'Offer',
  },
  {
    id: 8,
    name: 'Reviews',
    icon: require('../../assets/icon/star_icon.png'),
    navigate_to: 'ReviwList',
  },
  {
    id: 9,
    name: 'Remedy',
    icon: require('../../assets/icon/flower_icon.png'),
    navigate_to: 'Remedy',
  },
  {
    id: 10,
    name: 'Learning',
    icon: require('../../assets/icon/earnigs_icon.png'),
    navigate_to: 'courseList',
  },
  {
    id: 11,
    name: 'Followers',
    icon: require('../../assets/icon/check.png'),
    navigate_to: 'Followers',
  },
  {
    id: 12,
    name: 'Settings',
    icon: require('../../assets/icon/settings_icon.png'),
    navigate_to: 'Settings',
  },
  {
    id: 13,
    name: 'Fortune Store',
    icon: require('../../assets/icon/shopping_icon.png'),
    navigate_to: 'poojaList',
  },
  {
    id: 14,
    name: 'Class History',
    icon: require('../../assets/icon/history_icon.png'),
    navigate_to: 'classHistory',
  },
  // {
  //   id: 15,
  //   name: 'Delete Account',
  //   icon: require('../../assets/icon/deleteaccount_icon.png'),
  //   navigate_to: 'classHistory',
  // },
  // {
  //   id: 16,
  //   name: 'Logout',
  //   icon: require('../../assets/icon/logout_icon.png'),
  //   navigate_to: 'classHistory',
  // },
];

const Home = ({navigation, providerData, dashboard, dispatch}) => {
  const progressValue = useSharedValue(0)
  const [callStatus, setCallStatus] = useState(false);
  const [chatStatus, setChatStatus] = useState(false );
  const [isRefereshing, setIsRefereshing] = useState(false);
  const [date, setDate] = useState(null);
  const [dateVisible, setDateVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [txt, setText] = useState();
  const [state, setState] = useState({
    isLoading: false,
    moa: true,
    nextOnlineChatDate: null,
    nextOnlineChatTime: null,
    nextOnlineCallDate: null,
    nextOnlineCallTime: null,
    callTrendingStatus: false,
    chatTrendingStatus: false,
    trainingVedioData: null,
    bannerData: null,
    rating: 3,
    comments: '',
  });

  useEffect(() => {
    get_dashboard();
    get_training_vedios();
    get_banner_data();
  }, []);

  useEffect(() => {
    if (date) {
      change_next_login();
    }
  }, [dateVisible]);

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
          if (value == null || value == '1') {
            go_provider_chat_pickup(message);
          }
        });
      }
    });
    return () => {
      unsubscribe;
    };
  }, []);

  const get_banner_data = async () => {
    try {
      updateState({isLoading: true});

      const response = await ApiRequests.getRequest({
        url: api_url + footer_slider_astrologer,
      });

      if (response?.status) {
        updateState({bannerData: response.data});
      }

      updateState({isLoading: false});
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const get_training_vedios = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + traning_reel_astro_id,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData?.id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          if (res.data?.data.length != 0) {
            updateState({trainingVedioData: res.data.data});
          }
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const go_provider_chat_pickup = async message => {
    await AsyncStorage.setItem('request', '1').then(res => {
      navigation.replace('acceptChat', {message: message});
    });
  };

  const update_moa_status = async status => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + moa_update,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData?.id,
        status: status ? '0' : '1',
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          get_dashboard();
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };
  const get_dashboard = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: providerData.id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        let astroData = res.data.data2;
        dispatch(ProviderActions.setDashboard(res.data));
        dispatch(ProviderActions.setProviderData(astroData));
        setCallStatus(
          astroData.current_status_call != 'Busy' &&
            astroData.current_status_call != 'Offline' &&
            astroData.current_status_call.length != 0,
        );
        console.log("astroData.current_status",astroData.current_status)
        setChatStatus(
          astroData.current_status != 'Busy' &&
            astroData.current_status != 'Offline' &&
            astroData.current_status.length != 0,
        );
        updateState({
          moa: astroData?.moa == '1',
          callTrendingStatus: astroData?.call_trending == '1',
          chatTrendingStatus: astroData?.chat_trending == '1',
        });
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const on_referesh = useCallback(async () => {
    setIsRefereshing(true);
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: providerData.id,
      },
    })
      .then(res => {
        setIsRefereshing(false);
        console.log(res.data.data2?.interaction_count);
        let astroData = res.data.data2;
        dispatch(ProviderActions.setDashboard(res.data));
        dispatch(ProviderActions.setProviderData(astroData));
        setCallStatus(
          astroData.current_status_call != 'Busy' &&
            astroData.current_status_call != 'Offline' &&
            astroData.current_status_call.length != 0,
        );
        setChatStatus(
          astroData.current_status != 'Busy' &&
            astroData.current_status != 'Offline' &&
            astroData.current_status.length != 0,
        );
        updateState({
          moa: astroData?.moa == '1',
          callTrendingStatus: astroData?.call_trending == '1',
          chatTrendingStatus: astroData?.chat_trending == '1',
        });
      })
      .catch(err => {
        setIsRefereshing(false);
        console.log(err);
      });
  });

  const change_call_status = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + change_status_call,
      data: {
        id: providerData.id,
        is_online: callStatus ? 0 : 1,
        // wait_time_call: new Date().toString(),
      },
    })
      .then(res => {
        updateState({isLoading: false});
        setCallModalVisible(false);
        get_dashboard();
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const change_chat_status = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + change_status,
      data: {
        id: providerData.id,
        is_online: chatStatus ? 0 : 1,
        wait_time: new Date().toString(),
      },
    })
      .then(res => {
        updateState({isLoading: false});
        setChatModalVisible(false);
        get_dashboard();
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const change_next_login = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + next_log_status,
      data: {
        id: providerData.id,
        next_login: moment(date).format('yyyy-MM-dd HH:mm:ss'),
      },
    })
      .then(res => {
        updateState({isLoading: false});
        setDate(null);
        get_dashboard();
        if (res.data.status == 1) {
          showToastWithGravityAndOffset(res.data.message);
          // success_toast(res.data.message);
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const get_boost_amount_data = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + get_boost_amount,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          if (
            parseFloat(dashboard?.data?.Walletbalance) >=
            parseFloat(res.data.amount)
          ) {
            boost_astrologer_profile(res.data.amount);
          } else {
            // warnign_toast('You don\'t have enough balance for boost...')
            showToastWithGravityAndOffset(
              "You don't have enough balance for boost...",
            );
          }
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const boost_astrologer_profile = async amount => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + boost_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: props.providerData.id,
        amount: amount,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        showToastWithGravityAndOffset('Your profile boosted.');
        // success_toast('Your profile boosted.')
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const go_live_now = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + go_live_astro,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData?.id,
        status: 'live',
        event_id: '0',
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status == '200') {
          navigation.navigate('goLive', {
            userID: providerData?.id,
            userName: providerData?.owner_name,
            liveID: res.data.data.live_id,
          });
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const next_login = async (dateTime, type) => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + next_log_status,
      data: {
        id: providerData?.id,
        next_login: dateTime,
        type: type,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        get_dashboard();
        showToastWithGravityAndOffset('Next login status changed!');
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const update_trending_status = async (type, status) => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + trending_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData?.id,
        type: type,
        status: status,
      },
    })
      .then(res => {
        console.log(res.data);
        updateState({isLoading: false});
        get_dashboard();
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const submit_rating = async () => {
    try {
      updateState({isLoading: true});

      const response = await ApiRequests.postRequest({
        url: api_url + feedback_astro_application,
        data: {
          astro_id: providerData?.id,
          rating: rating,
          comment: comments,
        },
      });

      if (response?.success) {
        showToastWithGravityAndOffset('Feedback submited...');
      }

      updateState({isLoading: false});
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    isLoading,
    moa,
    nextOnlineCallDate,
    nextOnlineCallTime,
    nextOnlineChatDate,
    nextOnlineChatTime,
    callTrendingStatus,
    chatTrendingStatus,
    trainingVedioData,
    bannerData,
    rating,
    comments,
  } = state;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isRefereshing} onRefresh={on_referesh} />
        }
        scrollEnabled={true}
        ListHeaderComponent={
          <>
            {AstriInfo()}
            {GoForPolicies()}
            {performance()}
            {Offer()}
            {bannerData && homeBannerInfo()}
            {chatCallStatusInfo()}
            {trandinfOnOf()}
            {goLiveNowInfo()}
            {trainingVedioData && trainingReelsInfo()}
            {scheduleCourse()}
            {fortuneStoreInfo()}
            {tabsInfo()}
            {/* {noticeBoard()} */}
            {/* {reportIssue()} */}
            {sendView()}
          </>
        }
      />
    </GestureHandlerRootView>
  );

  function scheduleCourse() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>navigation.navigate('courseList')}
        style={{
          borderRadius: Sizes.fixPadding,
          width: '90%',
          marginVertical: Sizes.fixPadding * 1.5,
          overflow: 'hidden',
          backgroundColor: 'red',
          height: 70,
          alignSelf: 'center',
        }}>
        <ImageBackground
          source={require('../../assets/images/homedownbanner.png')}
          resizeMode="cover"
          style={{height: '100%', width: '100%', justifyContent: 'center'}}>
        
        </ImageBackground>
      </TouchableOpacity>
      // </View>
    );
  }

  function fortuneStoreInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>navigation.navigate('poojaList')}
        style={{
          borderRadius: Sizes.fixPadding,
          width: '90%',
          marginBottom: Sizes.fixPadding * 1.5,
          overflow: 'hidden',
          height: SCREEN_WIDTH*0.159,
          alignSelf: 'center',
          elevation: 5,
          backgroundColor: Colors.white
        }}>
        <Image
          source={require('../../assets/images/fortune_store.png')}
          resizeMode="contain"
          style={{height: '100%', width: '100%', justifyContent: 'center'}}/>
      </TouchableOpacity>
    );
  }

  function sendView() {
    return (
      <View
        style={{
          paddingTop: Sizes.fixPadding * 2.8,
          paddingHorizontal: Sizes.fixPadding * 2,
          backgroundColor: Colors.white,
        }}>
        <View
          style={{
            backgroundColor: Colors.gray4,
            borderRadius: 45,
            elevation: 8,
            shadowColor: Colors.blackLight,
            justifyContent: 'center',
            alignItems: 'center',
            padding: Sizes.fixPadding * 2.0,
            left: 20,
            width: '90%',
          }}>
          <Text
            style={{
              ...Fonts.black16RobotoMedium,
              fontWeight: '400',
              marginBottom: '3%',
              fontSize: 17,
            }}>
            Feedback
          </Text>
          <View style={{marginBottom: '5%'}}>
            <Stars
              disabled={false}
              default={rating}
              count={5}
              half={true}
              starSize={200}
              update={val => updateState({rating: val})}
              fullStar={
                <MaterialIcons
                  size={30}
                  name={'star-rate'}
                  style={[styles.myStarStyle]}
                  color={Colors.rating_clr}
                />
              }
              emptyStar={
                <MaterialIcons
                  size={30}
                  name={'star-rate'}
                  color={Colors.gray3}
                  style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                />
              }
              halfStar={
                <Icon
                  size={30}
                  name={'star-half'}
                  // style={[styles.myStarStyle]}
                  color={Colors.rating_clr}
                />
              }
            />
          </View>
          <Text
            style={{
              ...Fonts.gray12RobotoMedium,
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: '10%',
              fontSize: 13,
            }}>
            Please share your honest feedback to help us improve
          </Text>
        </View>

        <View >
          <TextInput
            placeholder="Type here..."
            placeholderTextColor={Colors.gray3}
            multiline
            onChangeText={text => updateState({comments: text})}
            style={styles.txtInput}
            >
            {comments}
          </TextInput>
        </View>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{
            borderRadius: 1000,
            height: 60,
            width: 60,
            top: -60,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity activeOpacity={0.8} onPress={submit_rating}>
            <Image
              source={require('../../assets/images/send.png')}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  function reportIssue() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.3,
          paddingHorizontal: Sizes.fixPadding * 3.7,
          backgroundColor: Colors.white,
          padding: Sizes.fixPadding,
          borderBottomWidth: 0.9,
          borderColor: Colors.gray_back,
          // marginBottom: Sizes.fixPadding,
        }}>
        <View
          style={{
            backgroundColor: Colors.whiteDark,
            borderRadius: Sizes.fixPadding,
            padding: Sizes.fixPadding * 1.1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'flex-start',
            elevation: 8,
            shadowColor: Colors.black,
            paddingHorizontal: Sizes.fixPadding * 1.5,
          }}>
          <FontAwesome5
            name="headset"
            color={Colors.Dark_grayish_red}
            size={30}
          />
          <Text style={{...Fonts.black20RobotoMedium}}>
            Report an issue here
          </Text>
        </View>
      </View>
    );
  }

  function noticeBoard() {
    return (
      <View
        style={{
          flex: 0,
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          paddingVertical: 15,
          paddingHorizontal: 25,
          borderColor: Colors.gray_back,
        }}>
        <View
          style={{
            backgroundColor: Colors.dullWhite,
            elevation: 8,
            borderRadius: 10,
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: Sizes.fixPadding * 1.5,
            }}>
            <Text
              style={{
                ...Fonts.black16RobotoMedium,
                fontWeight: '400',
                fontSize: 17,
              }}>
              Notice Board!
            </Text>
            <Text
              style={{
                ...Fonts.gray12RobotoMedium,
                color: Colors.primaryLight,
                fontSize: 13,
              }}>
              View History
            </Text>
          </View>
          <View
            style={{
              borderWidth: 0.9,
              borderColor: Colors.gray_back,
              borderRadius: 20,
              backgroundColor: Colors.white,
              padding: 10,
            }}>
            <Text
              style={{
                ...Fonts.gray11RobotoRegular,
                fontSize: 13,
                fontWeight: '400',
                padding: 5,
              }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Consectetur adipiscing elit. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Lorem ipsum dolor sit amet,
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function trandinfOnOf() {
    const treding_chat_status_change = () => {
      if (chatTrendingStatus) {
        update_trending_status('1', '0');
      } else {
        update_trending_status('1', '1');
      }
    };

    const trending_call_status_change = () => {
      if (callTrendingStatus) {
        update_trending_status('0', '0');
      } else {
        update_trending_status('0', '1');
      }
    };
    return (
      <View
        style={{
          borderBottomWidth: 0.9,
          borderColor: Colors.grayLight,
          marginBottom: 7,
          backgroundColor: Colors.bordercolor,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginBottom: Sizes.fixPadding,
          }}>
          Trending
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: Sizes.fixPadding * 1.5,
            backgroundColor: Colors.white,
            elevation: 5,
            shadowColor: Colors.gray,
            marginHorizontal: Sizes.fixPadding * 2.0,
            borderRadius: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <Ionicons name="call" size={24} color={Colors.primaryLight} />
            <Text
              style={{
                ...Fonts.primaryDark16RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              On Call
            </Text>
          </View>

          <View
          // style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}
          >
            <Switch
              value={callTrendingStatus}
              renderActiveText={false}
              renderInActiveText={false}
              circleBorderWidth={4}
              circleSize={20}
              onValueChange={() => trending_call_status_change()}
              circleBorderActiveColor={Colors.primaryLight}
              backgroundActive={Colors.primaryLight}
              backgroundInactive={Colors.gray}
              circleBorderInactiveColor={Colors.grayLight}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: Sizes.fixPadding * 1.5,
            backgroundColor: Colors.white,
            elevation: 5,
            shadowColor: Colors.blackLight,
            marginHorizontal: Sizes.fixPadding * 2.0,
            borderRadius: Sizes.fixPadding,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={Colors.primaryLight}
            />
            <Text
              style={{
                ...Fonts.primaryDark16RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              On Chat
            </Text>
          </View>

          <View
          // style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}
          >
            <Switch
              value={chatTrendingStatus}
              renderActiveText={false}
              renderInActiveText={false}
              circleBorderWidth={4}
              circleSize={20}
              onValueChange={() => treding_chat_status_change()}
              circleBorderActiveColor={Colors.primaryLight}
              backgroundActive={Colors.primaryLight}
              backgroundInactive={Colors.gray}
              circleBorderInactiveColor={Colors.grayLight}
            />
          </View>
        </View>
      </View>
    );
  }

  function tabsInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate(item.navigate_to)}
          style={{
            width: SCREEN_WIDTH * 0.28,
            height: SCREEN_WIDTH * 0.22,
            backgroundColor: Colors.primaryLight,
            marginBottom: Sizes.fixPadding,
            marginRight: SCREEN_WIDTH * 0.04,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: Sizes.fixPadding * 2,
            elevation: 8,
          }}>
          <Image
            source={item.icon}
            style={{
              width: SCREEN_WIDTH * 0.08,
              height: SCREEN_WIDTH * 0.08,
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              marginTop: Sizes.fixPadding * 0.5,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          backgroundColor: Colors.primaryDark,
          paddingVertical: SCREEN_WIDTH * 0.04,
          paddingLeft: SCREEN_WIDTH * 0.04,
        }}>
        <FlatList
          data={tabsData}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={item => item.id}
          columnWrapperStyle={{justifyContent: 'center'}}
        />
      </View>
    );
  }

  function trainingReelsInfo() {
    const on_navigate = item => {
      const arr = trainingVedioData.filter(e => e.id != item.id);
      const new_arr = [item, ...arr];
      navigation.navigate('reels', {data: new_arr});
    };

    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => on_navigate(item)}
          style={{
            width: SCREEN_WIDTH * 0.4,
            height: SCREEN_WIDTH * 0.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginRight: Sizes.fixPadding * 1.5,
            borderWidth: 4,
            borderColor: Colors.primaryLight,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'red',
          }}>
          <Image
            source={{uri: provider_img_url + item.image}}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          paddingVertical: Sizes.fixPadding * 1.5,
          marginTop: Sizes.fixPadding,
          borderColor: Colors.grayLight,
        }}>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.black16RobotoRegular}}>Training Reels</Text>
          <TouchableOpacity>
            <Text style={{...Fonts.primaryLight14RobotoRegular}}></Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={trainingVedioData}
          horizontal
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingLeft: Sizes.fixPadding * 1.5}}
        />
      </View>
    );
  }

  function chatCallStatusInfo() {
    const showChatDate = () => {
      DateTimePickerAndroid.open({
        value:
          nextOnlineChatDate == null
            ? new Date()
            : new Date(nextOnlineChatDate),
        onChange: (event, date) => {
          if (event.type == 'set') {
            // updateState({nextOnlineChatDate: date});
            showChatTime(date);
          }
        },
        minimumDate: new Date(),
        mode: 'date',
        display: 'calendar',
      });
    };

    const showChatTime = date => {
      DateTimePickerAndroid.open({
        value:
          nextOnlineChatTime == null
            ? new Date()
            : new Date(nextOnlineChatTime),
        onChange: (event, time) => {
          if (event.type == 'set') {
            var date1 = new Date(date);
            var time2 = new Date(time);
            var mergedDateTime = new Date(
              date1.getFullYear(),
              date1.getMonth(),
              date1.getDate(),
              time2.getUTCHours(),
              time2.getUTCMinutes(),
              time2.getUTCSeconds(),
            );
            next_login(mergedDateTime, 'chat');
          }
        },
        mode: 'time',
        display: 'clock',
      });
    };

    const showCallDate = () => {
      DateTimePickerAndroid.open({
        value:
          nextOnlineCallDate == null
            ? new Date()
            : new Date(nextOnlineCallDate),
        onChange: (event, date) => {
          if (event.type == 'set') {
            showCallTime(date);
          }
        },
        minimumDate: new Date(),
        mode: 'date',
        display: 'calendar',
      });
    };

    const showCallTime = date => {
      DateTimePickerAndroid.open({
        value:
          nextOnlineCallTime == null
            ? new Date()
            : new Date(nextOnlineCallTime),
        onChange: (event, time) => {
          if (event.type == 'set') {
            var date1 = new Date(date);
            var time2 = new Date(time);
            var mergedDateTime = new Date(
              date1.getFullYear(),
              date1.getMonth(),
              date1.getDate(),
              time2.getUTCHours(),
              time2.getUTCMinutes(),
              time2.getUTCSeconds(),
            );
            next_login(mergedDateTime, 'call');
          }
        },
        mode: 'time',
        display: 'clock',
      });
    };
    
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginBottom: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.grayLight,
          borderRadius: Sizes.fixPadding,
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: Sizes.fixPadding,
            borderBottomWidth: 1,
            borderBottomColor: Colors.blackLight + '50',
          }}>
          <View style={{flex: 0.3}}>
            <Text style={{...Fonts.primaryLight14RobotoMedium}}>Type</Text>
          </View>
          <View
            style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{...Fonts.primaryLight14RobotoMedium}}>Status</Text>
          </View>
          <View style={{flex: 0.5, alignItems: 'flex-end'}}>
            <Text style={{...Fonts.primaryLight14RobotoMedium}}>
              Next Online Time
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: Sizes.fixPadding * 0.5,
            paddingHorizontal: Sizes.fixPadding,
            borderBottomWidth: 1,
            borderBottomColor: Colors.blackLight + '50',
          }}>
          <View style={{flex: 0.3}}>
            <Text
              style={{...Fonts.black12RobotoRegular, color: Colors.blackLight}}>
              CHAT
            </Text>
            <Text
              style={{...Fonts.gray11RobotoRegular, color: Colors.blackLight}}>
              India:
            </Text>
          </View>
          <View
            style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
            <Switch
              value={chatStatus}
              renderActiveText={false}
              renderInActiveText={false}
              circleBorderWidth={4}
              circleSize={20}
              onValueChange={change_chat_status}
              circleBorderActiveColor={Colors.primaryLight}
              backgroundActive={Colors.primaryLight}
              backgroundInactive={Colors.white}
              circleBorderInactiveColor={Colors.grayLight}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => showChatDate()}
            style={{flex: 0.5, alignItems: 'flex-end'}}>
            <Text
              style={{...Fonts.black12RobotoRegular, color: Colors.blackLight}}>
              {dashboard?.data?.chat_login}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: Sizes.fixPadding * 0.5,
            paddingHorizontal: Sizes.fixPadding,
          }}>
          <View style={{flex: 0.3}}>
            <Text
              style={{...Fonts.black12RobotoRegular, color: Colors.blackLight}}>
              CALL
            </Text>
            <Text
              style={{...Fonts.gray11RobotoRegular, color: Colors.blackLight}}>
              India
            </Text>
          </View>
          <View
            style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
            <Switch
              value={callStatus}
              renderActiveText={false}
              renderInActiveText={false}
              circleBorderWidth={4}
              circleSize={20}
              onValueChange={change_call_status}
              circleBorderActiveColor={Colors.primaryLight}
              backgroundActive={Colors.primaryLight}
              backgroundInactive={Colors.white}
              circleBorderInactiveColor={Colors.grayLight}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => showCallDate()}
            style={{flex: 0.5, alignItems: 'flex-end'}}>
            <Text
              style={{...Fonts.black12RobotoRegular, color: Colors.blackLight}}>
              {dashboard?.data?.call_login}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function homeBannerInfo() {
    const baseOptions = {
      vertical: false,
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH*0.4,
    };

    const renderItem = ({index}) => {
      return (
        <View
          key={index}
          style={{
            width: SCREEN_WIDTH * 0.95,
            height: 140,
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding ,
            padding: Sizes.fixPadding * 0.5,
          }}>
          <Image
            source={{uri: img_url + bannerData[index].image}}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
              marginHorizontal: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding * 2,
            }}
          />
        </View>
      );
    };

    return (
      <SafeAreaView style={{flex: 1, height: 158}}>
        <Carousel
          {...baseOptions}
          loop
          testID={'homeBanner'}
          style={{
            width: '100%',
            marginTop: Sizes.fixPadding * 0.5,
            paddingHorizontal: Sizes.fixPadding,
          }}
          autoPlay={true}
          autoPlayInterval={4000}
          onProgressChange={(_, absoluteProgress) =>
            (progressValue.value = absoluteProgress)
          }
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 0,
          }}
          data={bannerData}
          pagingEnabled={true}
          onSnapToItem={index => {
            // updateState({selectedBanner: bannerData[index]})
          }}
          renderItem={renderItem}
        />
      </SafeAreaView>
    );
  }

  function goLiveNowInfo() {
    return (
      <TouchableOpacity
        onPress={go_live_now}
        style={{
          backgroundColor: Colors.white,
          marginHorizontal: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
        }}>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            Colors.primaryLight,
            Colors.primaryDark,
          ]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          locations={[0, 0.7, 1]}
          style={[
            styles.row,
            {
              paddingHorizontal: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding - 3,
            },
          ]}>
          <Image
            source={require('../../assets/images/live_icon.png')}
            style={{width: 50, height: 50}}
          />
          <Text
            style={{
              ...Fonts.primaryDark18RobotoMedium,
              marginLeft: Sizes.fixPadding,
            }}>
            Go Live Now!!
          </Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <AntDesign name="right" color={Colors.white} size={24} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function AstriInfo() {
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={{flexDirection: 'row', backgroundColor: Colors}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('profile')}
            style={{
              width: width * 0.3,
              justifyContent: 'center',
              borderBottomRadius: 0.6,
              alignItems: 'flex-end',
              borderRadius: 100,
              elevation: 10,

              shadowColor: Colors.blackLight,
              height: height * 0.08,
              backgroundColor: Colors.white,
              left: -40,
              bottom: 0,
              alignSelf: 'center',
            }}>
            {providerData?.img_url ? (
              <Image
                source={{uri: img_url_2 + providerData?.img_url}}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  marginEnd: width * 0.07,
                }}
              />
            ) : (
              <Image
                source={require('../../assets/images/person.png')}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  marginEnd: width * 0.07,
                }}
              />
            )}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: width * 0.8,
              backgroundColor: Colors.white,
              left: -40,
              padding: 15,
              height: height * 0.08,
              marginLeft: 10,
            }}>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  ...Fonts.grayA14RobotoMedium,
                }}>
                {providerData?.owner_name}
              </Text>
              <Text style={{...Fonts.grayA14RobotoMedium}}>
                ID- {providerData?.unique_id}
              </Text>
            </View>
            {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Divider
                orientation="vertical"
                style={{marginHorizontal: Sizes.fixPadding}}
                width={1}
                color={Colors.grayLight}
              /> 
              <Image
                source={require('../../assets/icon/search.png')}
                style={{alignSelf: 'center'}}
              />
            </View> */}
          </View>
        </View>
      </View>
    );
  }

  function GoForPolicies() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('privacy')}
        style={{
          padding: 18,
          // height: '15%',
          borderBottomWidth: 0.8,
          borderColor: Colors.blackLight + '60',
          // borderEndColor: Colors.gray,
        }}>
        <View
          style={{
            backgroundColor: Colors.primaryDark,
            height: height * 0.1,
            borderRadius: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: width * 0.9,
              alignContent: 'center',
              padding: 15,
            }}>
            <View style={{justifyContent: 'center'}}>
              <Image
                source={require('../../assets/icon/danger.png')}
                resizeMode="contain"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 25,
                  alignSelf: 'center',
                }}
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  color: Colors.white,
                  fontSize: 16,
                }}>
                Important Policies
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  color: Colors.white,
                  fontSize: 16,
                }}>
                (Please Read all the Policies )
              </Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Image source={require('../../assets/icon/BottomArrow.png')} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function Offer() {
    return (
      <View style={{padding: 10}}>
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 16,
            color: Colors.black,
          }}>
          Marketing offers
        </Text>

        <View
          style={{
            padding: 15,
            backgroundColor: '#FEFDFF',
            borderRadius: 20,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Medium',
              fontSize: 14,
              color: Colors.primaryLight,
            }}>
            M0@0-Free Users
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: width * 0.7}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 12,
                  color: Colors.grayA,
                }}>
                User gets first session free.Asrtrologer is Also not paid
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 12,
                  color: Colors.grayA,
                }}>
                Indian user with high spending capacity spends 5x more than
                other indian users.
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 12,
                  color: Colors.grayA,
                }}>
                Astrologers get opportunity to serve them better & convert to
                paid
              </Text>
            </View>
            <View>
              <Switch
                value={moa}
                disabled={parseInt(providerData?.interaction_count) != 3}
                onValueChange={() => update_moa_status(moa)}
                renderActiveText={false}
                renderInActiveText={false}
                circleBorderWidth={4}
                circleSize={20}
                circleBorderActiveColor={Colors.primaryLight}
                backgroundActive={Colors.primaryLight}
                backgroundInactive={Colors.white}
                circleBorderInactiveColor={Colors.grayLight}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  function performance() {
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
          width: '100%',
          height: 130,
          paddingHorizontal: Sizes.fixPadding,
        }}>
        <View style={{borderRadius: Sizes.fixPadding, overflow: 'hidden'}}>
          <ImageBackground
            source={require('../../assets/images/performance.png')}
            style={{
              height: '100%',
              width: '100%',
            }}
            resizeMode="cover">
            <LinearGradient
              colors={['rgba(255,255,255,0)', Colors.primaryDark]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              locations={[0.8, 1]}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'flex-end',
                padding: Sizes.fixPadding,
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('performance')}>
                <AntDesign name="right" size={26} color={Colors.white} />
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 1.5,
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
          height: '5.5%',
          width: '100%',
        }}>
        {/* <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => navigation.openDrawer()}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Image
            source={require('../../assets/icon/bar_icon.png')}
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity> */}
        {/* <Divider
          orientation="vertical"
          width={1}
          color={Colors.gray + '30'}
          style={{marginHorizontal: Sizes.fixPadding}}
        /> */}
        <Image
          source={require('../../assets/images/logo2.png')}
          style={{width: 25, height: 25, borderRadius : 100}}
        />
        <Text
          style={{
            ...Fonts.primaryLight18RighteousRegular,
            marginLeft: Sizes.fixPadding,
          }}>
          FortuneTalk
        </Text>
        {/* <View style={{flex: 1, alignItems: 'flex-end'}}>
          <TouchableOpacity
            style={{
              paddingVertical: Sizes.fixPadding * 0.5,
              marginLeft: Sizes.fixPadding,
            }}>
            <Image
              source={require('../../assets/icon/translate.png')}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  myStarStyle: {
    color: Colors.rating_clr,
    // backgroundColor: 'transparent',
    // textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: Colors.gray3,
  },
  txtInput: {
    padding: 10,
    backgroundColor: Colors.white,
    top: -30,
    borderRadius: 20,
    borderColor: Colors.black,
    elevation: 10,
    shadowColor: Colors.black,
    height: 160,
    ...Fonts.black14RobotoRegular,
    textAlignVertical: 'top'
  },
});
