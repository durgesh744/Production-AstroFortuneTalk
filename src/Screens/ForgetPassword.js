import {Image, Text, FlatList, View, Dimensions} from 'react-native';
import React from 'react';
import MyHeader from '../component/MyHeader';
import MyStatusBar from '../component/MyStatusBar';
import {Colors, Fonts, Sizes} from '../assets/style';
const {width, height} = Dimensions.get('screen');

const ForgetPassword = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title="Forget Password" navigation={navigation} />
      <View style={{flex: 1, backgroundColor: Colors.primaryDark}}>
        <FlatList ListHeaderComponent={<>{user()}</>} />
      </View>
    </View>
  );

  function user() {
    return (
      <View
        style={{
          height: height * 0.7,
          width: '100%',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../assets/images/user.png')}
          style={{
            width: 200,
            height: 200,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            fontSize: 20,
            color: Colors.white,
            marginTop:50,
          }}>
          Please contact to the admin support at
        </Text>
        <Text style={{
            ...Fonts.primaryLight15RobotoMedium,
            fontSize: 20,
            color: Colors.white,
            textAlign:'center'
          }}>contact@fortunetalk.co.in</Text>
      </View>
    );
  }
};

export default ForgetPassword;
