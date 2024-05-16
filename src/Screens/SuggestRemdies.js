import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  stylesheet,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import MyStatusBar from '../component/MyStatusBar';
import MyHeader from '../component/MyHeader';
import {Colors, Fonts, Sizes} from '../assets/style';
const {width, height} = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SCREEN_WIDTH} from '../config/Screen';
const SuggestRemdies = props => {
  const DATA = [
    {
      id: 1,
      Name: 'First Item',
      Status: 'COMPLETED',
      Date: '05 Aug 23 , 04:54 PM',
      book: 'Booked',
    },
    // {
    //   id: 2,
    //   Name: 'First Item',
    //   Status: 'PROCESSING',
    //   Date: '05 Aug 23 , 04:54 PM',
    // },
  ];
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title="Suggested Remedies" />
      <View style={{flex: 1, marginTop: Sizes.fixPadding * 1.5}}>
        <FlatList ListHeaderComponent={<>{suggHistory()}</>} />
      </View>
    </View>
  );

  function suggHistory() {
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
            shadowColor: Colors.black,
          }}>
          <Text
            style={{
              fontWeight: '400',
              ...Fonts.primaryLight14RobotoMedium,
              fontSize: 15,
              color: Colors.primaryDark,
              paddingHorizontal: Sizes.fixPadding,
            }}>
            Product Name: Black Magic Removal Removal
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: SCREEN_WIDTH * 0.3,
                height: SCREEN_WIDTH * 0.3,
                marginTop: '6%',
                borderRadius: 10,
              }}>
              <Image
                source={require('../assets/images/remdyImg.png')}
                style={{width: '90%', height: '90%', borderRadius: 10}}
              />
            </View>
            <View style={{marginVertical: '6%', marginHorizontal: '1%'}}>
              <Text
                style={{
                  ...Fonts.gray16RobotoMedium,
                  color: Colors.txtClr,
                  marginVertical: '3%',
                  fontSize: 15,
                }}>
                Name: Khushaboo
              </Text>
              <Text
                style={{
                  ...Fonts.gray16RobotoMedium,
                  color: Colors.txtClr,
                  marginVertical: '3%',
                  fontSize: 15,
                }}>
                Perform by: Shweta
              </Text>
              <Text
                style={{
                  ...Fonts.gray16RobotoMedium,
                  color: Colors.gray_light,
                  marginVertical: '3%',
                  fontSize: 15,
                }}>
                04 Aug 23, 03:32 PM
              </Text>
            </View>
          </View>
          <Text
            style={{
              ...Fonts.gray14RobotoMedium,
              color: Colors.Dark_grayish_red,
              fontWeight: '600',
              fontSize: 15,
            }}>
            Type : Paid Remedy
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,

                fontSize: 15,
              }}>
              Status :
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                color: Colors.green,
                fontSize: 15,
              }}>
              {item.book}
            </Text>
          </View>
          <Text
            style={{
              ...Fonts.primaryLight15RobotoLight,
              textDecorationLine: 'underline',
              fontWeight: '800',
              fontSize: 15,
              marginTop: '6%',
            }}>
            Suggest Next Remedy
          </Text>
        </View>

        <ImageBackground
          source={require('../assets/images/back.png')}
          resizeMode="cover"
          style={{
            width: width * 0.3,
            right: -5,
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 10,
          }}>
          <Text
            style={{
              ...Fonts.white12RobotoMedium,
              textAlign: 'center',
              bottom: 6,
            }}>
            Rs.420
          </Text>
        </ImageBackground>
      </View>
    );
    return (
      <View style={{}}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingVertical: 15}}
        />
      </View>
    );
  }
};

export default SuggestRemdies;
const styles = StyleSheet.create({
  centeredView: {
    alignSelf: 'center',
    // top: 80,
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    width: '85%',
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 15,
    shadowColor: Colors.black,
  },
  centeredunderView: {
    // top: 110,
    padding: 20,
    backgroundColor: Colors.dullWhite,
    alignSelf: 'center',
    marginTop: 80,
    justifyContent: 'center',

    marginTop: 12,

    width: '85%',
    // Radius: 25,
    // alignSelf: 'center',
  },
  txt: {
    ...Fonts.gray12RobotoMedium,
    color: Colors.Dark_grayish_red,
    fontWeight: '600',
    lineHeight: 25,
  },
  gradient: {
    padding: Sizes.fixPadding,
    borderRadius: 30,
    width: '40%',
    marginVertical: Sizes.fixPadding,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
