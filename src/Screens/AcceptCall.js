import {View, Text, ImageBackground, Dimensions, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Sizes, Colors, Fonts} from '../assets/style';
import MyStatusBar from '../component/MyStatusBar';
// import callImg from '../assets/svg/callImg';

const {width, height} = Dimensions.get('screen');
const AcceptCall = () => {
  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{
          //   flex: 1,

          borderRadius: Sizes.fixPadding,
        }}>
        <ImageBackground
          source={require('../assets/images/ChatBackground.png')}
          resizeMode="cover"
          style={{height: height}}>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 0.3,

                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Image
                source={require('../assets/images/usrImg.png')}
                style={{
                  width: 180,
                  height: 180,
                  //   alignSelf: 'flex-end',
                }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                flex: 0.3,
                alignItems: 'center',
                marginHorizontal: Sizes.fixPadding,
              }}>
              <Text
                style={{
                  ...Fonts.white18RobotBold,
                  fontSize: 24,
                  fontWeight: '600',
                  marginVertical: Sizes.fixPadding,
                }}>
                Suman
              </Text>
              <Text
                style={{
                  ...Fonts.white18RobotMedium,

                  marginVertical: Sizes.fixPadding * 2.0,
                }}>
                Please accept call request
              </Text>
              <Image
                source={require('../assets/images/user.png')}
                style={{
                  width: height * 0.1,
                  height: height * 0.1,
                  // position: 'absolute',
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  ...Fonts.white18RobotMedium,
                  fontSize: 22,
                  fontWeight: '600',
                }}>
                FortuneTalk
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <View
                style={{
                  width: 62,
                  height: 62,
                  backgroundColor: Colors.white,
                  borderRadius: 100,
                  elevation: 18,
                  shadowColor: Colors.black,
                }}>
                <Image
                  source={require('../assets/icon/CutCal.png')}
                  resizeMode="cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    //   alignSelf: 'flex-end',
                  }}
                />
              </View>
              <View
                style={{
                  width: 70,
                  height: 70,
                  //   backgroundColor: Colors.white,
                  borderRadius: 100,
                  elevation: 18,
                  shadowColor: Colors.black,
                }}>
                <Image
                  source={require('../assets/icon/Recivecal.png')}
                  resizeMode="cover"
                  style={{
                    width: 80,
                    height: 80,

                    //   alignSelf: 'flex-end',
                  }}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

export default AcceptCall;
