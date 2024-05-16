import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../component/MyStatusBar';
import MyHeader from '../component/MyHeader';
import {Colors, Fonts, Sizes} from '../assets/style';
const {width, height} = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {api_url, call_waiting_user_list} from '../config/Constants';
import {connect} from 'react-redux';
import Loader from '../component/Loader';
import database from '@react-native-firebase/database';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ChatActions from '../redux/actions/ChatActions';

const WaitList = ({navigation, providerData, dispatch}) => {
  const [state, setState] = useState({
    waitListData: null,
    isLoading: false,
    isRefreshing: false,
    isActiveChat: false,
    chatData: null,
  });

  useEffect(() => {
    database()
      .ref(`CurrentRequest/${providerData?.id}`)
      .on('value', snapshot => {
        if (snapshot.val()?.status == 'AceeptedbyUser') {
          updateState({isActiveChat: true});
        } else {
          updateState({isActiveChat: false});
        }
      });
  }, []);

  const get_chat_data = async () => {
    const data = await AsyncStorage.getItem('chatData');
    const parsedData = JSON.parse(data);
    dispatch(ChatActions.setChatRequestData(parsedData))
    navigation.navigate('ChatScreen', {
      customerData: parsedData, 
    });
  };

  useEffect(() => {
    getWaitListData();
  }, []);

  const getWaitListData = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + call_waiting_user_list,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData?.id,
      },
    })
      .then(res => {
        updateState({isLoading: false, waitListData: res.data.data});
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const getDateOrTime = timestamp => {
    const date1 = new Date(new Date().getTime() / 1000);
    const date2 = new Date(timestamp / 1000); // Current timestamp in seconds
    const timeDifference = Math.abs(date1 - date2);

    const hours = Math.floor(timeDifference / 3600);
    const minutes = Math.floor((timeDifference % 3600) / 60);

    if (hours >= 1) {
      return `${hours} Hr, ${minutes} Mins`;
    } else {
      return `${minutes} Mins`;
    }
  };

  const on_refresh = async () => {
    updateState({isRefreshing: true});
    await axios({
      method: 'post',
      url: api_url + call_waiting_user_list,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData?.id,
      },
    })
      .then(res => {
        console.log(res.data);
        updateState({isRefreshing: false, waitListData: res.data.data});
      })
      .catch(err => {
        updateState({isRefreshing: false});
        console.log(err);
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {waitListData, isLoading, isRefreshing, isActiveChat, chatData} = state;

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title="Waitlist" navigation={navigation} />
      <View style={{flex: 1, marginTop: Sizes.fixPadding * 1.5}}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={on_refresh} />
          }
          ListHeaderComponent={
            <>
              {isActiveChat && activeChatInfo()}
              {waitListData && chatHistoryInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  function chatHistoryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            marginHorizontal: 15,
            backgroundColor: Colors.white,
            marginBottom: 10,
          }}>
          <View
            style={{
              borderRadius: 20,
              flex: 0,
              backgroundColor: Colors.dullWhite,
              borderRadius: 10,
              padding: 15,
              elevation: 5,
              shadowColor: Colors.blackLight,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingRight: 15,
                width: width * 0.9,
              }}>
              <View>
                <Text
                  style={{
                    fontWeight: '600',
                    ...Fonts.black16RobotoMedium,
                    fontSize: 15,
                  }}>
                  New(Indian)
                </Text>
                <Text
                  style={{
                    fontWeight: '600',
                    ...Fonts.black16RobotoMedium,
                    fontSize: 15,
                    color:
                      item.Type == 'CALL' ? Colors.green : Colors.primaryDark,
                  }}>
                  India
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    ...Fonts.white14RobotoMedium,
                    color: Colors.bright_red,
                    right: 6,
                    fontWeight: '600',
                  }}>
                  Duration: {getDateOrTime(new Date(item.time_start).getTime())}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={{
                    ...Fonts.gray14RobotoMedium,
                    marginBottom: 5,
                    fontSize: 13,
                  }}>
                  {item?.username} (Id: 2198852)
                </Text>
                <Text
                  style={{
                    ...Fonts.gray14RobotoMedium,
                    marginBottom: 5,
                    fontSize: 13,
                  }}>
                  {moment(item?.time_start).format('DD MMM YY hh:mm A')}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      ...Fonts.gray14RobotoMedium,
                      marginBottom: 5,
                      fontSize: 13,
                    }}>
                    Type -{' '}
                  </Text>
                  <Text
                    style={{
                      ...Fonts.gray14RobotoMedium,
                      marginBottom: 5,
                      fontSize: 13,
                      color: item.type == 1 ? Colors.green : Colors.primaryDark,
                    }}>
                    {item.type == '1' ? 'Call' : 'Chat'}
                  </Text>
                </View>

                <Text
                  style={{
                    ...Fonts.gray14RobotoMedium,
                    marginBottom: Sizes.fixPadding,
                    fontSize: 13,
                  }}>
                  Token No - {index + 1}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      ...Fonts.gray14RobotoMedium,
                      color: Colors.bright_red,
                      fontWeight: '600',
                    }}>
                    Status:
                  </Text>
                  <Text
                    style={{
                      ...Fonts.gray14RobotoMedium,
                      fontWeight: '600',
                      color: Colors.bright_red,
                    }}>
                    {item.status == '1' || item.status == null
                      ? 'WAITING'
                      : 'PASUED'}
                  </Text>
                </View>
              </View>
              <View></View>
            </View>
          </View>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={{
              right: 8,
              // width: '40%',
              position: 'absolute',
              bottom: 10,
              borderRadius: 30,
              paddingVertical: 10,
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 10,
            }}>
            <TouchableOpacity>
              <Text
                style={{
                  ...Fonts.white14RobotoMedium,
                  fontSize: 15,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  // bottom: 6,
                }}>
                Start Offline Session
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      );
    };
    return (
      <View style={{}}>
        <FlatList
          data={waitListData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingVertical: 15}}
        />
      </View>
    );
  }

  function activeChatInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={get_chat_data}
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          paddingVertical: Sizes.fixPadding,
          backgroundColor: Colors.primaryLight,
          borderRadius: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
          You have an active Chat
        </Text>
      </TouchableOpacity>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(WaitList);
