import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import {useState, useEffect} from 'react';
import MyStatusBar from '../component/MyStatusBar';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyHeader from '../component/MyHeader';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {BlurView} from '@react-native-community/blur';
import {connect} from 'react-redux';
import {
  api_url,
  create_live_astrologer,
  go_live_astro,
  go_live_astro_event,
  live_astro_id_list,
} from '../config/Constants';
import axios from 'axios';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import Loader from '../component/Loader';
const {width, height} = Dimensions.get('screen');

const LiveEvent = ({navigation, providerData}) => {
  const [state, setState] = useState({
    isLoading: false,
    eventName: '',
    startTime: null,
    startDate: null,
    modalVisible: false,
    eventsData: null,
  });

  useEffect(() => {
    get_created_events();
  }, []);

  const go_live_now = async event_id => {
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
        event_id: event_id,
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

  const get_created_events = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + live_astro_id_list,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData?.id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status == '200') {
          updateState({eventsData: res.data.data});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const validataion = () => {
    if (eventName.length == 0) {
      showToastWithGravityAndOffset('Please enter event name.');
      return false;
    } else if (startTime == null) {
      showToastWithGravityAndOffset('Please select start time.');
      return false;
    } else if (startDate == null) {
      showToastWithGravityAndOffset('Please select start date');
      return false;
    } else {
      return true;
    }
  };

  const create_live_events = async () => {
    if (validataion()) {
      updateState({isLoading: true});
      await axios({
        method: 'post',
        url: api_url + go_live_astro_event,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          astro_id: providerData?.id,
          start_time: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
          start_date: startDate,
          event_name: eventName,
          status: 'pending',
        },
      })
        .then(res => {
          updateState({isLoading: false, modalVisible: false});
          showToastWithGravityAndOffset('Created Successfully.');
          get_created_events();
        })
        .catch(err => {
          console.log(err);
          updateState({isLoading: false});
        });
    }
  };

  const updateState = data => {
    setState(prevData => {
      const newData = {...prevData, ...data};
      return newData;
    });
  };

  const {isLoading, eventName, startDate, startTime, modalVisible, eventsData} =
    state;

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title={'Live Event'} navigation={navigation} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: height * 0.06,
          borderBottomWidth: 1,
          borderColor: Colors.gray3,
        }}>
        <Text style={{...Fonts.gray16RobotoMedium}}>History</Text>
      </View>
      <FlatList ListHeaderComponent={<>{eventsData && liveListInfo()}</>} />
      {BottonButton()}
      {modalInfo()}
    </View>
  );

  function modalInfo() {
    const open_date_picker = () => {
      DateTimePickerAndroid.open({
        value: startDate == null ? new Date() : startDate,
        onChange: (event, date) => {
          if (event.type == 'set') {
            updateState({startDate: date});
          }
        },
        minimumDate: new Date(),
        mode: 'date',
        display: 'calendar',
      });
    };

    const open_time_picker = () => {
      DateTimePickerAndroid.open({
        value: startTime == null ? new Date() : new Date(startTime),
        onChange: (event, time) => {
          if (event.type == 'set') {
            updateState({startTime: time});
          }
        },
        mode: 'time',
        display: 'clock',
        is24Hour: false,
      });
    };
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={modalVisible}
        style={{borderRadius: 30}}
        onRequestClose={() => {
          updateState({modalVisible: false});
        }}>
        <BlurView
          style={styles.blurContainer}
          blurType="light" // Adjust the blur intensity (light, dark, extra-light, extra-dark)
          blurAmount={1}
          // Adjust the blur amount (integer)
        >
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => updateState({modalVisible: false})}
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: Colors.black + '50',
            }}>
            <View style={styles.centeredView}>
              <View
                style={{
                  height: height,
                  borderBottomWidth: 1,
                  borderColor: Colors.gray_light,
                  flex: 0.1,
                  padding: 10,
                  width: '100%',
                  position: 'absolute',
                  alignItems: 'flex-start',
                  top: 0,
                  alignSelf: 'center',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...Fonts.gray16RobotoMedium,
                    color: Colors.primaryDark,
                  }}>
                  Schedule Event
                </Text>
              </View>
              <View style={{flex: 0.7, width: '100%'}}>
                <Text
                  style={{
                    ...Fonts.black16RobotoMedium,
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                  Event Name*
                </Text>
                <TextInput
                  placeholder="Enter here..."
                  placeholderTextColor={Colors.gray3}
                  onChangeText={text => updateState({eventName: text})}
                  style={styles.txtInput}></TextInput>
                <View
                  style={{
                    elevation: 8,
                    shadowColor: Colors.black,
                    marginVertical: Sizes.fixPadding * 3.0,
                    height: 55,
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      ...Fonts.black16RobotoMedium,
                      fontSize: 14,
                      padding: 3,
                    }}>
                    Start Time *
                  </Text>
                  <TouchableOpacity
                    onPress={() => open_time_picker()}
                    style={styles.inputContainer}>
                    <Text
                      style={{
                        flex: 0,
                        marginLeft: 5,
                        color: Colors.gray3,
                        fontWeight: 'normal',
                      }}>
                      {startTime == null
                        ? 'Select Time'
                        : moment(startTime).format('hh:mm A')}
                    </Text>
                    <AntDesign
                      name="down"
                      color={Colors.gray3}
                      size={25}
                      style={{alignSelf: 'flex-end', bottom: 2}}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    elevation: 15,
                    shadowColor: Colors.black,
                    marginVertical: Sizes.fixPadding - 5,
                    height: 55,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      ...Fonts.black16RobotoMedium,
                      fontSize: 14,
                      padding: 3,
                    }}>
                    Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => open_date_picker()}
                    style={styles.inputContainer}>
                    <Text
                      style={{
                        flex: 0,
                        marginLeft: 5,
                        color: Colors.gray3,
                        fontWeight: 'normal',
                      }}>
                      {startDate == null
                        ? 'Select Date'
                        : moment(startDate).format('Do MMM YYYY')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <LinearGradient
                  colors={[Colors.primaryLight, Colors.primaryDark]}
                  style={[
                    styles.touchablity,
                    {
                      width: '90%',
                      justifyContent: 'flex-end',
                      alignSelf: 'flex-end',
                      bottom: -60,
                    },
                  ]}>
                  <TouchableOpacity onPress={create_live_events}>
                    <Text
                      style={{
                        ...Fonts.white16RobotoMedium,
                        textAlign: 'center',
                      }}>
                      Schedule Event
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </TouchableOpacity>
        </BlurView>
      </Modal>
    );
  }

  function BottonButton() {
    return (
      <View
        style={{
          flex: 0,
          borderTopWidth: 1,
          borderColor: Colors.gray_light,
          justifyContent: 'center',
          marginBottom: height * 0.04,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={styles.touchablity}>
            <TouchableOpacity onPress={() => updateState({modalVisible: true})}>
              <Text style={{...Fonts.white16RobotBold, textAlign: 'center'}}>
                Schedule Event
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={styles.touchablity}>
            <TouchableOpacity onPress={() => go_live_now('0')}>
              <Text style={{...Fonts.white16RobotBold, textAlign: 'center'}}>
                Go Live Now
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  }

  function liveListInfo() {
    const renderItem = ({item, index}) => {
      // console.log(item?.start_time);
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={item.status == 'exit'}
          onPress={() => go_live_now(item.id)}
          style={{paddingHorizontal: 15, flex: 1, paddingVertical: 10}}>
          <View
            style={{
              backgroundColor: Colors.primaryLight,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text style={{...Fonts.while24RighteousRegular, fontWeight: '800'}}>
              {item.event_name}
            </Text>
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                color: Colors.white,
                marginVertical: 7,
              }}>
              {moment(item.start_time).format('hh:mm A')}
            </Text>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingTop: 5,
              }}>
              <Text
                style={{...Fonts.white14RobotoMedium, color: Colors.date_clr}}>
                On {moment(item.start_date).format('DD MMM YYYY')}
              </Text>
              <Text style={{...Fonts.white14RobotoMedium, color: '#FFEC9A'}}>
                Status: {item.status == 'exit' ? 'FINISHED' : 'PENDING'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <FlatList data={eventsData.reverse()} renderItem={renderItem} />
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(LiveEvent);

const styles = StyleSheet.create({
  touchablity: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 40,
    padding: 10,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    width: '40%',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding,
    marginTop: Sizes.fixPadding * 2.6,
  },
  centeredView: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    padding: 25,
    backgroundColor: Colors.dullWhite,
    alignItems: 'flex-start',
    marginHorizontal: Sizes.fixPadding,
    width: '80%',
    borderRadius: 30,
  },
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.black,
    padding: 10,
    marginBottom: 20,
    zIndex: -1,
    width: width * 0.4,
    backgroundColor: Colors.white,
    elevation: 15,
    shadowColor: Colors.black,
    justifyContent: 'space-between',
    padding: 5,
    width: '100%',
    height: 50,
  },
  txtInput: {
    padding: 10,
    backgroundColor: Colors.white,
    marginTop: 10,
    borderRadius: 5,
    borderColor: Colors.black,
    elevation: 15,
    shadowColor: Colors.black,
  },
  blurContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
