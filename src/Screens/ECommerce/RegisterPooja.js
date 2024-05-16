import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import MyHeader from '../../component/MyHeader';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import {SCREEN_WIDTH} from '../../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {Input} from '@rneui/themed';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import axios from 'axios';
import {api_url, schedule_a_pooja} from '../../config/Constants';
import {connect} from 'react-redux';
import moment from 'moment';
import Loader from '../../component/Loader';

const RegisterPooja = ({navigation, route, providerData}) => {
  const [state, setState] = useState({
    imageData: null,
    date: null,
    time: null,
    price: '',
    isLoading: false,
  });

  const validation = () => {
    if (date == null) {
      showToastWithGravityAndOffset('Please select a date.');
      return false;
    } else if (time == null) {
      showToastWithGravityAndOffset('Please select a time.');
      return false;
    } else if (price.length == 0) {
      showToastWithGravityAndOffset('Please enter your price.');
      return false;
    } else {
      return true;
    }
  };

  const update_pooja_details = async () => {
    if (validation()) {
      updateState({isLoading: true});
      await axios({
        method: 'post',
        url: api_url + schedule_a_pooja,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          date: date,
          time: time,
          astro_id: providerData?.id,
          pooja_id: route?.params?.pooja_id,
          price: price,
        },
      })
        .then(res => {
          updateState({isLoading: false});
          if (res.data.status) {
            showToastWithGravityAndOffset('Pooja scheduled');
            navigation.replace('sceduledList');
          }
        })
        .catch(err => {
          updateState({isLoading: false});
          console.log(err);
        });
    }
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
      selectionLimit: 10,
    }; // Add any camera options you need

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image library');
      } else if (response.errorCode) {
        console.log(response.errorCode, response.errorMessage, 'asdfghjk');
      } else {
        updateState({imageData: response.assets});
      }
    });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {imageData, date, time, price, isLoading} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {header()}
              {dateTimeInfo()}
              {priceInfo()}
              {/* {imageUploadInfo()} */}
            </>
          }
        />
      </View>
      {continueButtonInfo()}
    </View>
  );

  function continueButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={update_pooja_details}
        style={{
          marginHorizontal: Sizes.fixPadding * 3,
          marginVertical: Sizes.fixPadding,
          borderRadius: 1000,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
            Submit
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function priceInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginTop: Sizes.fixPadding * 2},
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>Price of Pooja</Text>
          <Input
            placeholder="0"
            placeholderTextColor={Colors.gray}
            keyboardType="number-pad"
            onChangeText={text => updateState({price: text})}
            rightIcon={<Text style={{...Fonts.gray16RobotoMedium}}>/-</Text>}
            inputStyle={{...Fonts.gray14RobotoMedium, textAlign: 'right'}}
            containerStyle={{margin: 0, height: 45}}
            inputContainerStyle={styles.input}
            leftIcon={
              <View style={styles.row}>
                <Text style={{...Fonts.gray18RobotoRegular}}>₹</Text>
                <View
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: Colors.gray,
                    marginHorizontal: Sizes.fixPadding * 2,
                  }}
                />
              </View>
            }
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.dataTimeContainer,
              {width: '60%', justifyContent: 'flex-start'},
            ]}>
            <Text style={{...Fonts.gray18RobotoRegular}}>₹</Text>
            <View
              style={{
                width: 1,
                height: 20,
                backgroundColor: Colors.gray,
                marginHorizontal: Sizes.fixPadding * 2,
              }}
            />
            <Text style={{...Fonts.gray16RobotoMedium}}>21199/-</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function dateTimeInfo() {
    const open_date_picker = () => {
      DateTimePickerAndroid.open({
        value: date == null ? new Date() : date,
        onChange: (event, date) => {
          if (event.type == 'set') {
            updateState({date: date});
          }
        },
        minimumDate: new Date(),
        mode: 'date',
        display: 'calendar',
      });
    };

    const open_time_picker = () => {
      DateTimePickerAndroid.open({
        value: time == null ? new Date() : time,
        onChange: (event, time) => {
          if (event.type == 'set') {
            updateState({time: time});
          }
        },
        mode: 'time',
        display: 'clock',
      });
    };

    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <Text style={{...Fonts.black16RobotoRegular}}>
          Schedule a Date and time
        </Text>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginTop: Sizes.fixPadding * 2},
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => open_date_picker()}
            style={styles.dataTimeContainer}>
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {date == null ? 'Date' : moment(date).format('Do MMM YYYY')}
            </Text>
            <Ionicons name="chevron-down" color={Colors.gray} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => open_time_picker()}
            style={styles.dataTimeContainer}>
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {time == null ? 'Time' : moment(time).format('hh:mm A')}
            </Text>
            <Ionicons name="chevron-down" color={Colors.gray} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function header() {
    return <MyHeader navigation={navigation} title={'Schedule a Pooja'} />;
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(RegisterPooja);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataTimeContainer: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizes.fixPadding,
    backgroundColor: Colors.gray4,
    borderRadius: Sizes.fixPadding,
    elevation: 5,
    shadowColor: Colors.blackLight,
  },
  input: {
    borderBottomWidth: 0,
    backgroundColor: 'red',
    height: '100%',
    width: '60%',
    backgroundColor: Colors.gray4,
    borderRadius: Sizes.fixPadding,
    elevation: 5,
    shadowColor: Colors.blackLight,
    paddingHorizontal: Sizes.fixPadding,
  },
});
