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
const AstromallHistory = props => {
  const DATA = [
    {
      id: 1,
      Name: 'First Item',
      Status: 'COMPLETED',
      Date: '05 Aug 23 , 04:54 PM',
    },
    {
      id: 2,
      Name: 'First Item',
      Status: 'PROCESSING',
      Date: '05 Aug 23 , 04:54 PM',
    },
    {
      id: 3,
      Name: 'First Item',
      Status: 'COMPLETED',
      Date: '05 Aug 23 , 04:54 PM',
    },
  ];
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title="Astromall History" />
      <View style={{flex: 1, marginTop: Sizes.fixPadding * 1.5}}>
        <FlatList
          ListHeaderComponent={
            <>
              {chatHistoryInfo()}
              {modal()}
            </>
          }
        />
      </View>
    </View>
  );
  function modal() {
    return (
      <View style={styles.centeredView}>
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
            style={{
              flex: 0.5,
              justifyContent: 'center',
              backgroundColor: Colors.black + '50',
            }}></TouchableOpacity>
          <View style={styles.centeredunderView}>
            <Text
              style={{
                ...Fonts.gray16RobotoMedium,
                color: Colors.gray3,
                fontWeight: '600',
                lineHeight: 25,
              }}>
              User info:
            </Text>
            <Text style={styles.txt}>Name : Geetika</Text>
            <Text style={styles.txt}>Gender : Female</Text>
            <Text style={styles.txt}> Birth Date : 29-November-1992</Text>
            <Text style={styles.txt}>Birth Time : 11:35 AM </Text>
            <Text style={styles.txt}>
              Birth Place : Meerut, Uttar Pradesh, India{' '}
            </Text>
            <Text style={styles.txt}>
              Current Address : Mumbai, Maharashtra
            </Text>
            <Text style={styles.txt}>
              {' '}
              Problem Area : Business Problem Partner
            </Text>
            <Text
              style={{
                ...Fonts.gray16RobotoMedium,
                color: Colors.gray3,
                fontWeight: '600',
              }}>
              Partner info:
            </Text>
            <Text style={styles.txt}> Name : N/A </Text>
            <Text style={styles.txt}>Gender : N/A</Text>
            <Text style={styles.txt}>Birth Date : N/A</Text>
            <Text style={styles.txt}> Birth Time : N/A</Text>
            <Text style={styles.txt}>Birth Place : N/A</Text>
            <Text style={styles.txt}>Current Address : N/A</Text>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={styles.gradient}>
              <TouchableOpacity>
                <Text style={{...Fonts.white18RobotBold, fontSize: 16}}>
                  Ok
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <TouchableOpacity />
        </Modal>
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
                  fontSize: 15,
                }}>
                New(Indian)
              </Text>
              <Text
                style={{
                  fontWeight: '400',
                  ...Fonts.black16RobotoMedium,
                  fontSize: 15,
                }}>
                Order id: 123456789
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                name="copy-outline"
                size={26}
                color={Colors.Dark_grayish_red}
                style={{marginHorizontal: 15}}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  borderRadius: 30,
                  backgroundColor: Colors.gray_light,
                  paddingHorizontal: Sizes.fixPadding * 1.7,
                  paddingVertical: 3,
                }}>
                <Text style={{...Fonts.white14RobotoMedium}}>Details</Text>
              </TouchableOpacity>
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
                Name:{item.Name}
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginBottom: 5,
                  fontSize: 13,
                }}>
                Product Name:{item.Name}
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginBottom: 5,
                  fontSize: 13,
                }}>
                Product Category:{item.Name}
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginBottom: 5,
                  fontSize: 13,
                }}>
                Quantity-{item.Name}
              </Text>

              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginBottom: Sizes.fixPadding,
                  fontSize: 13,
                }}>
                {item.Date}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    ...Fonts.gray14RobotoMedium,
                  }}>
                  Status:
                </Text>
                <Text
                  style={{
                    ...Fonts.gray14RobotoMedium,
                    color:
                      item.Status == 'COMPLETED' ? Colors.red : Colors.green,
                  }}>
                  {item.Status}
                </Text>
              </View>
            </View>
            <View></View>
          </View>
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

export default AstromallHistory;

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
