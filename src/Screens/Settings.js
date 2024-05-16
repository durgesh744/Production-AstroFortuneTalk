import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import MyStatusBar from '../component/MyStatusBar';
import MyHeader from '../component/MyHeader';
import { Colors, Sizes, Fonts } from '../assets/style';
import { SCREEN_WIDTH } from '../config/Screen';
import { api_url, astrologer_logout } from '../config/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../component/Loader';
import { resetToScreen } from '../navigation/NavigationServices';

const tabsData = [
  {
    id: 1,
    name: 'Update Phone Number',
    icon: require('../assets/icon/phone_icon.png'),
    navigate_to: 'updateNumber',
  },
  {
    id: 3,
    name: 'Terms & Conditions',
    icon: require('../assets/icon/terms-and-conditions.png'),
    navigate_to: 'terms',
  },
  {
    id: 4,
    name: 'Price Change Request',
    icon: require('../assets/icon/price.png'),
    navigate_to: 'priceChange',
  },
  {
    id: 5,
    name: 'Bank Details',
    icon: require('../assets/icon/bank.png'),
    navigate_to: 'updateBankDetails',
  },
  {
    id: 6,
    name: 'Download Form 16A',
    icon: require('../assets/icon/download.png'),
    navigate_to: 'downloadForm16A',
  },
  {
    id: 7,
    name: 'Gallery',
    icon: require('../assets/icon/gallery.png'),
    navigate_to: 'photoGallery',
  },
  {
    id: 8,
    name: 'Refer an Astrologer',
    icon: require('../assets/icon/link.png'),
    navigate_to: 'referAnAstrologer',
  },
  {
    id: 9,
    name: 'Pooja',
    icon: require('../assets/icon/link.png'),
    navigate_to: 'poojaList',
  },
  {
    id: 10,
    name: 'Scheduled Pooja',
    icon: require('../assets/icon/link.png'),
    navigate_to: 'sceduledList',
  },
  {
    id: 11,
    name: 'Pooja History',
    icon: require('../assets/icon/link.png'),
    navigate_to: 'poojaHistory',
  },
  {
    id: 15,
    name: 'Delete Account',
    icon: require('../assets/icon/deleteaccount_icon.png'),
    navigate_to: 'classHistory',
  },
  {
    id: 16,
    name: 'Logout',
    icon: require('../assets/icon/logout_icon.png'),
    navigate_to: 'classHistory',
  },
];

const Settings = ({ navigation, providerData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const showalert = title => {
    Alert.alert(title, `Are You sure to ${title}`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => logout() },
    ]);
  };

  const logout = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + astrologer_logout,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.status) {
          cleardata();
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const cleardata = async () => {
    await AsyncStorage.clear();
    resetToScreen('login');
  };

  return (
    <View style={{ flex: 1 }}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title="Settings" navigation={navigation} />

      {/* {header()} */}
      <View style={{ flex: 1, backgroundColor: Colors.primaryDark }}>
        <FlatList ListHeaderComponent={<>{tabsInfo()}</>} />
      </View>
    </View>
  );

  function tabsInfo() {

    const handleLocation = (item) => {
      if (item?.name === 'Logout' || item?.name === 'Delete Account') {
        showalert(item.name);
      }
      else if (item?.name === 'Price Change Request') {
        Alert.alert("Comming Soon")
      }
      else {
        navigation.navigate(item?.navigate_to);
      }
    };

    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleLocation(item)}
          style={{
            width: SCREEN_WIDTH * 0.28,
            height: SCREEN_WIDTH * 0.34,
            backgroundColor: Colors.primaryLight,
            marginBottom: Sizes.fixPadding,
            marginRight: SCREEN_WIDTH * 0.04,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: Sizes.fixPadding * 2,
            elevation: 8,
            justifyContent: 'center',
          }}>
          <Image
            source={item.icon}
            style={{
              width: SCREEN_WIDTH * 0.08,
              height: SCREEN_WIDTH * 0.08,
              resizeMode: 'contain',
              marginBottom: '8%',
            }}
          />
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              marginTop: Sizes.fixPadding * 0.5,
              textAlign: 'center',
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.primaryDark,
          paddingVertical: SCREEN_WIDTH * 0.04,
          paddingLeft: SCREEN_WIDTH * 0.04,
        }}>
        <FlatList
          data={tabsData}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps)(Settings);
