import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity, 
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyStatusBar from '../../component/MyStatusBar';
import {Sizes, Colors, Fonts} from '../../assets/style';
const {width, height} = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import MyHeader from '../../component/MyHeader';
import Loader from '../../component/Loader';
import {
  api_url,
  call_history_astro,
  customer_kundli_chart,
  kundli_basic_details,
  kundli_dosha,
  kundli_get_panchang,
  kundli_numerology_detailes,
} from '../../config/Constants';
import database from '@react-native-firebase/database';

const CallHistory = ({navigation, providerData}) => {
  const [CallHistoryData, setCallHistoryData] = useState(null);
  const [state, setState] = useState({
    isLoading: false,
    activeCallData: null,
    isActiveCall: false,
  });

  useEffect(() => {
    check_is_active_call();
    get_order_history();
    return () => {
      database().ref(`CurrentCallRequest/${providerData?.id}`).off();
    };
  }, []);

  const check_is_active_call = () => {
    database()
      .ref(`CurrentCallRequest/${providerData?.id}`)
      .on('value', snapshot => {
        if (snapshot.val()?.status == 'active') {
          updateState({isActiveCall: true, activeCallData: snapshot.val()});
        } else {
          updateState({isActiveCall: false, activeCallData: null});
        }
      });
  };

  const get_order_history = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + call_history_astro,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData.id,
      },
    })
      .then(res => {
        setCallHistoryData(res.data.data);
        updateState({isLoading: false});
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const get_kundli_details = async user_id => {
    try {
      updateState({isLoading: true});
      const basic_details = await axios({
        method: 'post',
        url: api_url + kundli_basic_details,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: user_id,
        },
      });

      const kundli_dosha_data = await axios({
        method: 'post',
        url: api_url + kundli_dosha,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: user_id,
        },
      });

      const kundli_panchang = await axios({
        method: 'post',
        url: api_url + kundli_get_panchang,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: user_id, //kundliData?.kundali_id,
        },
      });

      const kundli_chart = await axios({
        method: 'post',
        url: api_url + customer_kundli_chart,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: user_id, //kundliData?.kundali_id,
          chartid: 'D1',
        },
      });

      navigation.navigate('userKundli', {
        basicKundliData: basic_details.data,
        kundliDoshaData: kundli_dosha_data.data,
        panchangData: kundli_panchang.data,
        chartData: kundli_chart.data?.svg_code,
      });
      updateState({isLoading: false});
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const get_numerology_details = async user_id => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + kundli_numerology_detailes,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: user_id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          navigation.navigate('numerology', {
            numerologyData: res.data.getNumeroTable,
          });
        }
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

  const {isLoading, isActiveCall, activeCallData} = state;

  return (
    <View style={{flex: 1}}>
      <Loader visible={isLoading} />
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title="Call History" navigation={navigation} />
      <View style={{flex: 1, marginTop: Sizes.fixPadding * 1.5}}>
        <FlatList
          ListHeaderComponent={
            <>
              {isActiveCall && ongoingCallInfo()}
              {chatHistoryInfo()}
            </>
          }
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
                New ({item?.country}) {item?.moa == '1' && <Text style={{color: Colors.primaryLight}}>MO@0</Text>}
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
                Name-{item?.username}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
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
                {moment(item.created_datetime).format('DD MMM YYYY, hh:mm A')}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Duration - {item.duration}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Rate - {item.rate}
                {'/min'}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    ...Fonts.black14InterMedium,
                  }}>
                  Status -
                </Text>
                <Text
                  style={{
                    ...Fonts.gray14RobotoMedium,
                    color: Colors.green,
                  }}>
                  {' '}
                  Completed
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
                  Rs.{parseFloat(item.deductAmt).toFixed(2)}
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
              onPress={() =>
                navigation.navigate('Remedy', {
                  customer_id: item?.user_id,
                  screen_type: 'not_during_chat'
                })
              }
              style={{...Fonts.primaryLight14RobotoMedium, textDecorationLine: 'underline'}}>
              Suggest Remedy
            </Text>
            <Text style={{...Fonts.primaryLight14RobotoMedium, textDecorationLine: 'underline'}}>Refund Amount</Text>
          </View>
        </View>
      </View>
    );
    return (
      <View style={{}}>
        <FlatList
          data={CallHistoryData}
          renderItem={renderItem}
          contentContainerStyle={{paddingVertical: 15}}
        />
      </View>
    );
  }

  function ongoingCallInfo() {
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
                India
              </Text>
              <Text
                style={{
                  fontWeight: '400',
                  ...Fonts.black16RobotoMedium,
                }}>
                Order id: {activeCallData?.order_id}
              </Text>
            </View>
            <Ionicons
              name="copy-outline"
              size={26}
              color={Colors.Dark_grayish_red}
              style={{marginHorizontal: 15}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: Sizes.fixPadding,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => get_kundli_details(activeCallData?.customer_id)}
              style={styles.buttonContainer}>
              <Text style={{...Fonts.black12RobotoRegular}}>Open Kundli</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                get_numerology_details(activeCallData?.customer_id)
              }
              style={styles.buttonContainer}>
              <Text style={{...Fonts.black12RobotoRegular}}>Numerology</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CallTarot')}
              style={styles.buttonContainer}>
              <Text style={{...Fonts.black12RobotoRegular}}>Tarot</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Name - {activeCallData?.customer_name}
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  textTransform: 'capitalize',
                }}>
                Gender - {activeCallData?.gender}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Birth Date -{' '}
                {moment(activeCallData?.birth_date).format('DD-MM-YYYY')}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Birth Time - {activeCallData?.birth_time}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Birth Place - {activeCallData?.birth_place}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Current Address - {activeCallData?.current_address}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Problem Area - {activeCallData?.problem_area}
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginTop: 20,
                  color: Colors.gray3,
                }}>
                Order Time -{' '}
                {moment(activeCallData?.order_time).format(
                  'DD MMM YYYY, hh:mm A',
                )}
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Max Duration -{' '}
                {(parseFloat(activeCallData?.total_duration) / 60).toFixed(2)}{' '}
                mins
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Rate-2 min
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
                  Ongoing
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: height * 0.03,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...Fonts.primaryLight14RobotoMedium,
                textDecorationLine: 'underline',
              }}>
              Suggest Remedy
            </Text>
          </View>
        </View>
      </View>
    );
  }
};
const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(CallHistory);

const styles = StyleSheet.create({
  buttonContainer: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray4,
    paddingVertical: Sizes.fixPadding * 0.5,
    borderRadius: 1000,
    elevation: 5,
    shadowColor: Colors.blackLight + '30',
  },
});
