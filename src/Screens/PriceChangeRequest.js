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
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../config/Screen';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
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
import Entypo from 'react-native-vector-icons/Entypo';
import {Dropdown} from 'react-native-element-dropdown';
const {width, height} = Dimensions.get('screen');

const PriceChangeRequest = ({navigation, providerData}) => {
  const [state, setState] = useState({
    isLoading: false,
    eventName: '',
    startTime: null,
    startDate: null,
    modalVisible: false,
    eventsData: null,
    visible: false,
    selecteData : null,
    dataFocus : false,
  });

  const DataType = [
    {lable: '1', value : 'Call'},
    {lable: '2', value : 'Chat'}
  ];
  const {dataFocus, selecteData} = state;
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

  const updateState = data => {
    setState(prevData => {
      const newData = {...prevData, ...data};
      return newData;
    });
  };

  const {isLoading, eventName, startDate, startTime, visible, eventsData} =
    state;

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title={'Price Change Request'} navigation={navigation} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: height * 0.01,
          borderBottomWidth: 1,
          borderColor: Colors.gray3,
        }}></View>
      <FlatList ListHeaderComponent={<>{eventsData && liveListInfo()}</>} />
      {Customer()}
      {BottonButton()}
    </View>
  );

  function Customer() {
    const renderItem = (item, selected) => {
      return (
        <View
          style={{
            padding: Sizes.fixPadding,
            borderBottomWidth: item._index + 1 != 1 ? 1 : 0,
            borderColor: Colors.gray,
            backgroundColor: Colors.white,
          }}>
          <Text
            style={
              selected
                ? {...Fonts.primaryLight15RobotoLight, textAlign: 'center'}
                : {...Fonts.gray14RobotoRegular, textAlign: 'center'}
            }>
            {item.label}
          </Text>
        </View>
      );
    };
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
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.custom}>Customer Price</Text>
          <View
            style={{
              width: SCREEN_WIDTH * 0.15,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <View stye={{flex: 0.25}}>
              <View>
                <Text>Select Type</Text>
              </View>
              <Dropdown
                style={[styles.dropdown, {flex: 0.6}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                containerStyle={styles.dropdownContainer}
                iconStyle={styles.iconStyle}
                data={DataType}
                maxHeight={300}
                dropdownPosition="top"
                labelField="label"
                valueField="value"
                 placeholder={!dataFocus ? 'Options' : '...'}
                 value={selecteData}
                 onFocus={() => updateState({dataFocus: true})}
                 onBlur={() => updateState({dataFocus: false})}
                onChange={item => {
                  updateState({
                    selecteData: item.value,
                    dataFocus: false,
                  });
                }}
                renderItem={renderItem}
              />
            </View>
          </View>
          <TextInput style={styles.txtInput} />
        </View>
      </View>
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
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={styles.touchablity}>
            <TouchableOpacity>
              <Text style={{...Fonts.white16RobotBold, textAlign: 'center'}}>
                +Request for new Price
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  }

  function liveListInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{paddingHorizontal: 15, flex: 1, paddingVertical: 10}}>
          <View
            style={{
              backgroundColor: Colors.primaryLight,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text style={{...Fonts.while24RighteousRegular, fontWeight: '800'}}>
              Text
            </Text>
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                color: Colors.white,
                marginVertical: 7,
              }}>
              Text
            </Text>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingTop: 5,
              }}>
              <Text
                style={{...Fonts.white14RobotoMedium, color: Colors.date_clr}}>
                Text
              </Text>
              <Text style={{...Fonts.white14RobotoMedium, color: '#FFEC9A'}}>
                Text
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

export default connect(mapStateToProps, null)(PriceChangeRequest);

const styles = StyleSheet.create({
  touchablity: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 40,
    padding: 10,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    width: '80%',
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
    bottom: -10,
    marginRight: 10,
  },
  blurContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  custom: {
    color: Colors.primaryDark,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    bottom: -15,
  },
  dropdown: {
    flex: 0.45,
    height: 12,
    borderColor: Colors.gray,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    juistyContent: 'center',
    alingItems: 'center',
  },
  placeholderStyle: {
    ...Fonts.gray14RobotoRegular,
  },
  selectedTextStyle: {
    ...Fonts.gray14RobotoRegular,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
});
