import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
const {width, height} = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ImageBackground} from 'react-native';
import axios from 'axios';
import {connect} from 'react-redux';
import moment from 'moment';
import MyStatusBar from '../../component/MyStatusBar';
import MyHeader from '../../component/MyHeader';
import {
  api_url,
  astro_order_history,
  chat_history_astro,
} from '../../config/Constants';
import {Sizes, Colors, Fonts} from '../../assets/style';
import Loader from '../../component/Loader';
const ChatHistory = ({providerData, navigation}) => {
  useEffect(() => {
    get_order_history();
  }, []);

  const [ChatHistoryData, setChatHistoryData] = useState(null);

  const [state, setState] = useState({
    isLoading: false,
    historyData: null,
  });

  const get_order_history = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + chat_history_astro,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData.id,
      },
    })
      .then(res => {
        console.log(res.data)
        setChatHistoryData(res.data.data.reverse());
        updateState({isLoading: false});
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, historyData} = state;

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title="Chat History" navigation={navigation} />
      <View style={{flex: 1, marginTop: Sizes.fixPadding * 1.5}}>
        <FlatList
          ListHeaderComponent={<>{ChatHistoryData && chatHistoryInfo()}</>}
        />
      </View>
    </View>
  );

  function chatHistoryInfo() {
    const renderItem = ({item}) => (
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
                  fontWeight: '400',
                  ...Fonts.black16RobotoMedium,
                }}>
                New({item?.country}){' '}
                {item?.moa == '1' && (
                  <Text style={{color: Colors.primaryLight}}>MO@0</Text>
                )}
              </Text>
              <Text
                style={{
                  fontWeight: '400',
                  ...Fonts.black16RobotoMedium,
                }}>
                Order id: {item.order_id}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                name="copy-outline"
                size={26}
                color={Colors.Dark_grayish_red}
                style={{marginHorizontal: 15}}
              />
              {/* <TouchableOpacity
                style={{
                  borderRadius: 30,
                  backgroundColor: Colors.gray_light,
                  paddingHorizontal: Sizes.fixPadding * 1.5,
                  paddingVertical: 3,
                  // bottom: 7,
                }}>
                <Text style={{...Fonts.white14RobotoMedium}}>Open Kundli</Text>
              </TouchableOpacity> */}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Name-{item.username}
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  textTransform: 'capitalize',
                }}>
                Gender-{item.gender}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Birth Date-{item.date_of_birth}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Birth Time-{item.time_of_birth}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Birth Place-{item.place_of_birth}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Current Address-{item.current_address}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Problem Area-{item.problem}
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginTop: 20,
                  color: Colors.gray3,
                }}>
                Order Time-
                {moment(item.in_time).format('DD MMM YYYY')} (
                {moment(item.in_time).format('hh:mm A')}
                {'-'}
                {moment(item.out_time).format('hh:mm A')})
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Duration-{(parseFloat(item?.duration) / 60).toFixed(2)} mins
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Rate-{item.rate}
                {'/min'}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    ...Fonts.black14InterMedium,
                  }}>
                  Status-
                </Text>
                <Text
                  style={{
                    ...Fonts.gray14RobotoMedium,
                    color: Colors.green,
                  }}>
                  {item?.deductAmt != null  ? 'Complete' : 'Ongoing'}
                </Text>
              </View>
            </View>
            <View>
              <ImageBackground
                source={require('../../assets/images/back.png')}
                resizeMode="contain"
                style={{
                  width: width * 0.3,
                  height: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                  right: -20,
                  position: 'absolute',
                  alignSelf: 'flex-start',
                  top: -15,
                }}>
                <Text
                  style={{
                    ...Fonts.white14RobotoMedium,
                    textAlign: 'center',
                    bottom: 6,
                    fontWeight: '700',
                  }}>
                  {' '}
                  Rs.{item?.deductAmt != null ? parseFloat(item?.deductAmt).toFixed(2) : '0.0'}
                </Text>
              </ImageBackground>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: height * 0.03,
              justifyContent: 'space-between',
            }}>
            <Text
              onPress={() => navigation.navigate('chatSummary', {data: item})}
              style={style.txt}>
              View Chat
            </Text>
            <Text
              onPress={() =>
                navigation.navigate('Remedy', {
                  customer_id: item?.user_id,
                  screen_type: 'not_during_chat'
                })
              }
              style={style.txt}>
              Suggest Remedy
            </Text>
            <Text style={style.txt}>Refund Amount</Text>
          </View>
        </View>
      </View>
    );

    return (
      <View style={{}}>
        <FlatList
          data={ChatHistoryData.reverse()}
          renderItem={renderItem}
          contentContainerStyle={{paddingVertical: 15}}
        />
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHistory);
const style = StyleSheet.create({
  txt: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryLight,
    textDecorationLine: 'underline',
  },
});
