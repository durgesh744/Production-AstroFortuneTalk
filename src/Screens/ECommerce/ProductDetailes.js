import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCREEN_WIDTH} from '../../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import LinearGradient from 'react-native-linear-gradient';
import {base_url} from '../../config/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyStatusBar from '../../component/MyStatusBar';
import MyHeader from '../../component/MyHeader';
import database from '@react-native-firebase/database';
import {connect} from 'react-redux';
import {MyMethods} from '../../methods/MyMethods';

const astrologerData = [
  {
    id: 1,
    name: 'Soniya Ji',
    image: require('../../assets/images/users/user1.jpg'),
  },
  {
    id: 2,
    name: 'Guru Ji',
    image: require('../../assets/images/users/user2.jpg'),
  },
  {
    id: 3,
    name: 'Revati Ji',
    image: require('../../assets/images/users/user3.jpg'),
  },
  {
    id: 4,
    name: 'Guru Ji',
    image: require('../../assets/images/users/user4.jpg'),
  },
];

const ProductDetailes = ({
  navigation,
  route,
  astroFirebaseID,
  customerFirebaseID,
  providerData,
}) => {
  const [state, setState] = useState({
    productData: route?.params?.productData,
    isLoading: false,
  });

  const sugges_product = () => {
    if (typeof route?.params?.screen_type == 'undefined') {
      const sendMessage = {
        _id: MyMethods.generateUniqueId(),
        text: `Paid Remedy Suggested by ${providerData?.owner_name}`,
        user: {
          _id: astroFirebaseID,
          name: providerData?.owner_name,
          // avatar: base_url + userData?.image,
        },
        remedy: {
          data: productData,
          type: 'product',
          category_id: route?.params?.category_id,
          title: route?.params?.title,
        },
        type: 'product',
        // Mark the message as sent, using one tick
        sent: true,
        // Mark the message as received, using two tick
        received: false,
        // Mark the message as pending with a clock loader
        pending: false,
        senderId: astroFirebaseID,
        receiverId: customerFirebaseID,
      };

      addMessage(sendMessage);

      database()
        .ref(`CustomerCurrentRequest/${route?.params?.customer_id}`)
        .update({
          astromall: {
            data: productData,
            type: 'product',
            category_id: route?.params?.category_id,
            title: route?.params?.title,
          },
        });
    }
    navigation.pop(5);
  };

  const addMessage = message => {
    try {
      const chat_id = customerFirebaseID + '+' + astroFirebaseID;
      const node = database().ref(`/AstroId/${providerData?.id}`).push();
      const key = node.key;
      database()
        .ref(`/Messages/${chat_id}/${key}`)
        .set({
          ...message,
          createdAt: new Date().getTime(),
          addedAt: database.ServerValue.TIMESTAMP,
        });
    } catch (e) {
      console.log(e);
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {productData, isLoading} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {bannerInfo()}
              {productInfo()}
              {benefitsInfo()}
              {reviewInfo()}
              {bookNowButtonInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function bookNowButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => sugges_product()}
        style={{
          marginHorizontal: Sizes.fixPadding * 4,
          marginVertical: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding * 1.5,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
            Suggest Now
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function reviewInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: '100%',
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            borderColor: Colors.primaryLight,
            elevation: 5,
            marginBottom: Sizes.fixPadding * 1.5,
            shadowColor: Colors.blackLight,
            backgroundColor: Colors.white,
            padding: Sizes.fixPadding * 0.8,
          }}>
          <View style={{...styles.row}}>
            <Image
              source={item.image}
              style={{
                width: 25,
                height: 25,
                borderRadius: 100,
              }}
            />
            <Text
              style={{
                ...Fonts.gray11RobotoRegular,
                marginLeft: Sizes.fixPadding * 0.5,
              }}>
              {item.name}
            </Text>
            <View style={{marginLeft: Sizes.fixPadding * 1.5}}>
              <Stars
                default={4}
                count={5}
                half={true}
                starSize={9}
                fullStar={
                  <Ionicons
                    name={'star'}
                    size={9}
                    color={Colors.primaryLight}
                  />
                }
                emptyStar={
                  <Ionicons
                    name={'star-outline'}
                    size={9}
                    color={Colors.primaryLight}
                  />
                }
                // halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]} />}
              />
            </View>
          </View>
          <Text numberOfLines={5} style={{...Fonts.gray11RobotoRegular}}>
            "I love how the app encourages reflection. It's not often that I can
            say an app makes me feel better and more regulated afterward."
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 1.5,
          marginHorizontal: Sizes.fixPadding * 2,
        }}>
        <Text
          style={{
            ...Fonts.black18RobotoRegular,
            marginBottom: Sizes.fixPadding,
          }}>
          Customer Reviews
        </Text>
        <FlatList
          data={astrologerData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  function benefitsInfo() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 2,
          paddingVertical: Sizes.fixPadding * 1.5,
          borderBottomColor: Colors.grayLight,
          borderBottomWidth: 1,
        }}>
        <Text style={{...Fonts.black16RobotoRegular}}>Description</Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            fontSize: 13,
            marginLeft: Sizes.fixPadding,
          }}>
          {productData?.description}
        </Text>
      </View>
    );
  }

  function productInfo() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 2,
          paddingBottom: Sizes.fixPadding * 1.5,
          borderBottomColor: Colors.grayLight,
          borderBottomWidth: 1,
        }}>
        <Text style={{...Fonts.primaryLight18RobotoMedium}}>
          {route?.params?.title}
        </Text>
        {/* <Text style={{...Fonts.gray14RobotoMedium, fontSize: 13}}>
          {productData?.description}
        </Text> */}
        <Text style={{...Fonts.black16RobotoMedium}}>
          ₹ {productData?.price}{' '}
          {/* <Text
            style={{
              ...Fonts.gray16RobotoMedium,
              textDecorationLine: 'line-through',
            }}>
            {' '}
            7500{' '}
          </Text>{' '}
          <Text style={{...Fonts.white14RobotoMedium, color: Colors.red}}>
            20% Off
          </Text> */}
        </Text>
      </View>
    );
  }

  function bannerInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
          overflow: 'hidden',
        }}>
        <Image
          source={{uri: base_url + 'admin/' + productData?.image}}
          style={{
            width: '100%',
            height: SCREEN_WIDTH * 0.6,
            resizeMode: 'cover',
          }}
        />
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Product Details'} navigation={navigation} />;
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
  astroFirebaseID: state.chat.astroFirebaseID,
  customerFirebaseID: state.chat.customerFirebaseID,
});

export default connect(mapStateToProps, null)(ProductDetailes);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: Colors.gray,
    bottom: -Sizes.fixPadding * 0.7,
  },
});
