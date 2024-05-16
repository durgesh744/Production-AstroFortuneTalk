import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyHeader from '../../component/MyHeader';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {api_url, pooja_booking_customer_detail} from '../../config/Constants';
import Loader from '../../component/Loader';
import moment from 'moment';

const BookingDetailes = ({navigation, route}) => {
  const [state, setState] = useState({
    isLoading: false,
    bookingData: null,
    poojaData: route?.params?.poojaData,
  });

  useEffect(() => {
    get_booking_data();
  }, []);

  const get_booking_data = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + pooja_booking_customer_detail,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        pooja_id: poojaData?.pooja_id,
      },
    })
      .then(res => {
        console.log(res.data);
        updateState({isLoading: false});
        if (res.data.status) {
          updateState({bookingData: res.data.data[0]});
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
  const {isLoading, bookingData, poojaData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {topMessageInfo()}
              {poojaInfo()}
              {bookingData && profileDetailsInfo()}
              {bookingData && paidAmountInfo()}
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
        onPress={() =>
          navigation.navigate('uploadEcommerce', {poojaData: poojaData})
        }
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
            Upload a Attachment
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function paidAmountInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding * 1.5,
        }}>
        <Text style={{...Fonts.black18RobotoMedium, color: Colors.blackLight}}>
          Paid Amount
        </Text>
        <Text style={{...Fonts.black18RobotoMedium, color: Colors.blackLight}}>
          ₹ {poojaData?.price}/-
        </Text>
      </View>
    );
  }

  function profileDetailsInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <Text style={{...Fonts.primaryLight14RobotoRegular}}>
          Profile Details:
        </Text>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Name</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>{bookingData?.username}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Gender</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>
            {bookingData?.gender == '1'
              ? 'Male'
              : bookingData?.gender == '2'
              ? 'Female'
              : bookingData?.gender}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Birth Date</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>
            {moment(bookingData?.date_of_birth).format('DD-MMMM-YYYY')}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Birth Time</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>
            {moment(bookingData?.time_of_birth, 'hh:mm').format('hh:mm A')}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Birth Place</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>{bookingData?.current_address}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Current Address</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>{bookingData?.current_address}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Occupation</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>{bookingData?.occupation}</Text>
        </View>
      </View>
    );
  }

  function poojaInfo() {
    return (
      <View
        style={{
          paddingBottom: Sizes.fixPadding * 2,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View
          style={{
            backgroundColor: Colors.gray4,
            marginHorizontal: Sizes.fixPadding * 2,
            borderRadius: Sizes.fixPadding * 1.4,
            padding: Sizes.fixPadding * 1.5,
            elevation: 5,
            shadowColor: Colors.blackLight,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...Fonts.primaryDark18RobotoMedium,
              marginBottom: Sizes.fixPadding * 0.5,
            }}>
            {poojaData?.title}
          </Text>
          <Text
            style={{
              ...Fonts.gray14RobotoMedium,
              color: Colors.blackLight,
              marginBottom: Sizes.fixPadding * 0.3,
            }}>
            {moment(poojaData?.date).format('Do MMMM YYYY')}
          </Text>
          <Text
            style={{
              ...Fonts.gray14RobotoMedium,
              color: Colors.blackLight,
              marginBottom: Sizes.fixPadding * 0.3,
            }}>
            at {moment(poojaData?.time).format('hh:mm A')}
          </Text>
        </View>
      </View>
    );
  }

  function topMessageInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <Text
          style={{
            ...Fonts.black18RobotoMedium,
            color: '#5DC709',
            textAlign: 'center',
          }}>
          You’ve been Booked for Pooja !!
        </Text>
      </View>
    );
  }

  function header() {
    return <MyHeader navigation={navigation} title={'Booking'} />;
  }
};

export default BookingDetailes;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  child: {
    flex: 0.4,
    ...Fonts.black14RobotoRegular,
    fontSize: 13,
  },
  colon: {...Fonts.black16RobotoMedium},
  childValue: {
    flex: 0.6,
    ...Fonts.black14RobotoRegular,
    marginLeft: Sizes.fixPadding,
    fontSize: 13,
  },
});
