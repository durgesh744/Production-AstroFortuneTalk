import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyStatusBar from '../../component/MyStatusBar';
import MyHeader from '../../component/MyHeader';
import {connect} from 'react-redux';
import {Colors, Fonts, Sizes} from '../../assets/style';
const {width, height} = Dimensions.get('screen');
import {Dropdown} from 'react-native-element-dropdown';
import {ImageBackground} from 'react-native';
import {MyMethods} from '../../methods/MyMethods';
import {Modal} from 'react-native-paper';
import axios from 'axios';
import {
  api_url,
  astro_all_wallet_history,
  astro_all_wallet_history_new,
  set_dnd,
} from '../../config/Constants';
import Loader from '../../component/Loader';
import moment from 'moment';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
const WalletHistory = ({navigation, providerData, dashboard}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [monthsData, setMonthsData] = useState(null);
  const [state, setState] = useState({
    modalVisible: false,
    isLoading: false,
    historyData: null,
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const data = MyMethods.get_calender_months();
    setMonthsData(data);
    get_wallet_history({startDate: new Date(), endDate: new Date()});
  }, []);

  const get_wallet_history = async ({startDate, endDate}) => {
    updateState({isLoading: true, modalVisible: false});
    console.log( {
      astro_id: providerData.id,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    })
    await axios({
      method: 'post',
      url: api_url + astro_all_wallet_history_new,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData.id,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      },
    })
      .then(res => {
        updateState({isLoading: false});
        updateState({historyData: res.data.data});
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  //console.log(providerData);
  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, modalVisible, historyData, startDate, endDate} = state;

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title="Wallet History" navigation={navigation} />
      <View style={{flex: 1, marginTop: Sizes.fixPadding * 1.5}}>
        <FlatList
          ListHeaderComponent={
            <>
              {monthsData && filterInfo()}
              {balnceShow()}
              {historyData && chatHistoryInfo()}
            </>
          }
        />
      </View>
      {dateSelectionInfo()}
    </View>
  );

  function dateSelectionInfo() {
    const select_start_date = () => {
      if (Platform.OS == 'android') {
        DateTimePickerAndroid.open({
          value: startDate == null ? new Date() : startDate,
          onChange: (event, date) => {
            if (event.type == 'set') {
              updateState({startDate: date});
            }
          },
          // minimumDate: endDate != null ? endDate : null,
          maximumDate: endDate != null ? endDate : new Date(),
          mode: 'date',
          display: 'calendar',
          is24Hour: true,
        });
      } else {
      }
    };

    const select_end_date = () => {
      if (Platform.OS == 'android') {
        DateTimePickerAndroid.open({
          value: endDate == null ? new Date() : endDate,
          onChange: (event, date) => {
            if (event.type == 'set') {
              updateState({endDate: date});
            }
          },
          minimumDate: startDate != null ? startDate : new Date(),
          maximumDate: new Date(),
          mode: 'date',
          display: 'calendar',
          is24Hour: true,
        });
      } else {
      }
    };

    return (
      <Modal visible={modalVisible}>
        <View
          style={{
            width: '90%',
            backgroundColor: Colors.white,
            padding: Sizes.fixPadding,
            alignSelf: 'center',
          }}>
          <Text
            style={{...Fonts.primaryLight15RobotoMedium, textAlign: 'center'}}>
            Select Dates
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: Sizes.fixPadding * 2,
            }}>
            <View style={{alignItems: 'center', width: '40%'}}>
              <Text style={{...Fonts.black14RobotoRegular}}>Start Date</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => select_start_date()}
                style={styles.buttonContainer}>
                <Text
                  style={{...Fonts.gray14RobotoRegular, textAlign: 'center'}}>
                  {startDate != null
                    ? moment(startDate).format('DD-MM-YYYY')
                    : 'Select'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', width: '40%'}}>
              <Text style={{...Fonts.black14RobotoRegular}}>End Date</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => select_end_date()}
                style={styles.buttonContainer}>
                <Text
                  style={{...Fonts.gray14RobotoRegular, textAlign: 'center'}}>
                  {endDate != null
                    ? moment(endDate).format('DD-MM-YYYY')
                    : 'Select'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              get_wallet_history({startDate: startDate, endDate: endDate})
            }
            style={{
              width: '60%',
              alignSelf: 'center',
              marginBottom: Sizes.fixPadding,
              marginTop: Sizes.fixPadding * 2,
            }}>
            <Text style={{...Fonts.black14RobotoRegular, textAlign: 'center'}}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function filterInfo() {
    return (
      <View style={styles.container}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={{...Fonts.primaryLight14RobotoMedium, textAlign: 'center'}}
          containerStyle={{
            marginTop: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
          }}
          itemContainerStyle={{borderRadius: Sizes.fixPadding, justifyContent: 'center', alignItems: 'center'}}
          iconStyle={styles.iconStyle}
          data={monthsData}
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Today' : '...'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            if (item.label == 'Custom') { 
              updateState({modalVisible: true});
            } else if (
              item.label != 'Today' &&
              item.label != 'Yesterday' &&
              item.label != 'Custom'
            ) {
              const date = new Date(item.value);
              const year = date.getUTCFullYear();
              const month = date.getUTCMonth();
              const firstdate = new Date(Date.UTC(year, month, 1));
              var  fdate = firstdate.toISOString().split('T')[0]
              const lastdate = new Date(Date.UTC(year, month + 1, 0));
              var ldate = lastdate.toISOString().split('T')[0]
              get_wallet_history({startDate: fdate, endDate: ldate});
            } else if (item.label == 'Yesterday') {
              get_wallet_history({startDate: item.value, endDate: item.value});
              // get_wallet_history({startDate: yesterday, endDate: new Date()});
            } else {
              get_wallet_history({startDate: new Date(), endDate: new Date()});
            }
          }}
        />
      </View>
    );
  }

  function balnceShow() {
    const wallet_balance = parseFloat(dashboard?.data?.Walletbalance.replace(',', ''))
    const pg_charge = wallet_balance -  (wallet_balance * 2.5 /100)
    const payable_amount = pg_charge - (pg_charge * 10 /100)
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}>
         <View style={[styles.balance, {backgroundColor: Colors.greenLight}]}>
         <Text style={[styles.viwTxt, {color: Colors.white}]}>Available Amount</Text>
          <Text style={[styles.viwTxt, {color: Colors.white}]}>
            {/* ₹ {historyData && historyData.amount_astrologer} */}
            ₹ {dashboard.data.Walletbalance}
          </Text>
        </View>
        <View style={styles.balance}>
          <Text style={styles.viwTxt}>PG Charge</Text>
          <Text style={styles.viwTxt}>
            ₹ {'2.5%'}
          </Text>
        </View>
        <View style={styles.balance}>
          <Text style={styles.viwTxt}>Sub total</Text>
          <Text style={styles.viwTxt}>
            ₹ {pg_charge.toFixed(1)}
          </Text>
        </View>
        <View style={styles.balance}>
          <Text style={styles.viwTxt}>TDS</Text>
          <Text style={styles.viwTxt}>
            ₹ {`10%`}
          </Text>
        </View>
        {/* <View style={styles.balance}>
          <Text style={styles.viwTxt}>GST</Text>
          <Text style={styles.viwTxt}>
            ₹ {historyData && historyData.gst_charge}
          </Text>
        </View> */}
        <View style={[styles.balance, {backgroundColor: Colors.primaryDark}]}>
          <Text style={[styles.viwTxt, {color: Colors.white}]}>Payable Amount</Text>
          <Text style={[styles.viwTxt, {color: Colors.white}]}>
            ₹ {payable_amount.toFixed(1)}
          </Text>
        </View>
      </View>
    );
  }

  function chatHistoryInfo() {
    const renderItem = ({item}) => (
      <View
        style={{
          marginHorizontal: 15,
          backgroundColor: Colors.white,
          marginBottom: 10,
          marginTop: 18,
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
                Order ID: {item?.order_id}
              </Text>
            </View>
            <View>
              <ImageBackground
                source={require('../../assets/images/green.png')}
                resizeMode="contain"
                style={{
                  width: width * 0.3,
                  height: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                  right: -10,
                  position: 'absolute',
                  alignSelf: 'flex-start',
                  top: -10,
                  contentContainerStyle: {
                    color: item.Name == '+' ? Colors.green : Colors.red,
                  },
                }}>
                <Text
                  style={{
                    ...Fonts.white12RobotoMedium,
                    textAlign: 'center',
                    bottom: 6,
                  }}>
                  + ₹ {item?.cramount == '0.000' ? 0.000 : item?.cramount}
                  {/* + ₹ {item?.cramount} */}
                </Text>
              </ImageBackground>
            </View>
          </View>

          <View>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                color: Colors.primaryLight,
                marginVertical: 5,
                fontSize: 16,
                textTransform: 'capitalize'
              }}>
                {item?.type_for}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                with {item?.username}({item?.customer_id})
              </Text>
              {/* <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  color: Colors.red2,
                  top: -13,
                }}>
                Refund
              </Text> */}
            </View>
            {item?.type_for != 'pooja' &&  item?.type_for != 'Remedy' &&  item?.type_for != 'gift' && item?.type_for != 'product' &&  <Text style={{...Fonts.gray14RobotoMedium,}}>
              for {parseFloat(item?.duration).toFixed(2)} minutes
            </Text>}
         
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                justifyContent: 'space-between',
              }}>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Userld: {item?.customer_id}
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  color: Colors.primaryLight,
                }}>
                {item?.transdate}
                {/* {moment(item?.transdate, 'HH:mm A').format(
                  'DD MMM YY, hh:mm A',
                )} */}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
    return (
      <View style={{}}>
        <FlatList
          data={historyData}
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

export default connect(mapStateToProps, mapDispatchToProps)(WalletHistory);

// export default WalletHistory;
const styles = StyleSheet.create({
  txt: {paddingVertical: Sizes.fixPadding - 4, paddingHorizontal: 6},
  container: {
    //backgroundColor: 'red',
    borderColor: Colors.primaryLight,
    paddingVertical: 18,
    // borderWidth: 2.5,
    borderRadius: 20,
    justifyContent: 'center',
    width: '90%',
    paddingVertical: 3,
    marginLeft: 22,
    flex: 0.4,
  },
  dropdown: {
    height: 50,
    borderColor: Colors.primaryLight,
    borderWidth: 2,
    borderRadius: Sizes.fixPadding,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'red',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.primaryLight,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.primaryLight,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  balance: {
    // borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.gray,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viwTxt: {
    ...Fonts.white8RobotBold,
    fontSize: 8,
    fontWeight: '700',
    lineHeight: 12,
  },
  buttonContainer: {
    paddingVertical: Sizes.fixPadding * 0.5,
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    marginTop: Sizes.fixPadding,
  },
  //   inputSearchStyle: {
  //     height: 40,
  //     fontSize: 16,
  //   },
});
