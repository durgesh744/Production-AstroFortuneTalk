import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import MyStatusBar from '../component/MyStatusBar';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyHeader from '../component/MyHeader';
import LinearGradient from 'react-native-linear-gradient';

const Remedy = ({navigation, route}) => {
  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title={'Suggest Remedy'} navigation={navigation} />
      <ScrollView style={{flex: 1}}>
        <View style={{padding: 15}}>
          <Text style={{lineHeight: 40, ...Fonts.gray16RobotoMedium}}>
            You can suggest any remedy to the customer (just like a doctor!).
            The remedy could be a free mantra, suggestion etc. Or it can be a
            paid product/service like gemstone, online puja, healing etc. When
            suggesting a paid product/service, you have the option to sell the
            product or service yourself or assign it to another Astrologer, or
            you can also assign it to Fortune talk. If the customer purchases
            the suggested product or service from you, then you get 50% of the
            revenue share, and the remaining 50% goes to Fortune talk On the
            other hand, if you refer the customer to us (Astromall), in that
            case, you get 10% of the revenue share. For more information,
            contact AstroMall.
          </Text>
        </View>
      </ScrollView>
      <View style={{flex: 0, justifyContent: 'center', alignItems: 'center'}}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{
            //   flex: 1,
            padding: Sizes.fixPadding,
            borderRadius: 30,
            width: '60%',

            marginVertical: Sizes.fixPadding,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('addRemedy', route?.params)
            }>
            <Text
              style={{
                ...Fonts.white18RobotBold,
                fontSize: 20,
                fontWeight: '700',
                lineHeight: 23,
              }}>
              + Add
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default Remedy;
