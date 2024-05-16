import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Sizes, Colors, Fonts} from '../assets/style';
import MyStatusBar from '../component/MyStatusBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const {width, height} = Dimensions.get('screen');
const OnCall = () => {
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
                }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                flex: 0.2,
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
                  ...Fonts.white16RobotoMedium,
                  fontWeight: '600',
                }}>
                On Call
              </Text>
              <Text
                style={{
                  ...Fonts.white16RobotoMedium,

                  fontWeight: '600',
                  marginVertical: Sizes.fixPadding + 7,
                }}>
                00:12
              </Text>
            </View>
            <View
              style={{
                flex: 0.2,
                padding: 25,
                justifyContent: 'center',

                top: 10,
              }}>
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 20,
                  width: width * 0.8,
                  alignSelf: 'center',
                  justifyContent: 'flex-start',
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: Colors.black,
                      fontFamily: 'Roboto-SemiBold',
                      fontWeight: '800',
                    }}>
                    Profile Details:
                  </Text>
                  <Ionicons
                    name="copy-outline"
                    size={24}
                    color={Colors.Dark_grayish_red}
                    // style={{marginHorizontal: 15}}
                  />
                </View>
                <Text
                  style={{...Fonts.black14RobotoRegular, fontWeight: '650'}}>
                  Name : Geetika
                </Text>
                <Text
                  style={{...Fonts.black14RobotoRegular, fontWeight: '650'}}>
                  Gender : Female
                </Text>
                <Text
                  style={{...Fonts.black14RobotoRegular, fontWeight: '650'}}>
                  Birth Date : 29-November-1992
                </Text>
                <Text
                  style={{...Fonts.black14RobotoRegular, fontWeight: '650'}}>
                  Birth Time : 11:35 AM{' '}
                </Text>
                <Text
                  style={{...Fonts.black14RobotoRegular, fontWeight: '650'}}>
                  Birth Place : Meerut, Uttar Pradesh, India
                </Text>
                <Text
                  style={{...Fonts.black14RobotoRegular, fontWeight: '650'}}>
                  Current Address : Mumbai, Maharashtra
                </Text>
                <Text
                  style={{...Fonts.black14RobotoRegular, fontWeight: '650'}}>
                  Occupation : Business
                </Text>
                <Text
                  style={{...Fonts.black14RobotoRegular, fontWeight: '650'}}>
                  Problem Area : Business Problem
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%', marginRight: Sizes.fixPadding}}>
                    <LinearGradient
                      colors={[Colors.primaryLight, Colors.primaryDark]}
                      style={{
                        //   flex: 1,
                        padding: Sizes.fixPadding,
                        borderRadius: 30,
                        width: '100%',

                        marginVertical: Sizes.fixPadding,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity>
                        <Text style={{...Fonts.white18RobotBold, fontSize: 16}}>
                          Suggest Remedy
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                      colors={[Colors.primaryLight, Colors.primaryDark]}
                      style={{
                        //   flex: 1,
                        padding: Sizes.fixPadding,
                        borderRadius: 30,
                        width: '100%',

                        marginVertical: Sizes.fixPadding,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity>
                        <Text style={{...Fonts.white18RobotBold, fontSize: 16}}>
                          Numerology
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                  <View style={{width: '50%'}}>
                    <LinearGradient
                      colors={[Colors.primaryLight, Colors.primaryDark]}
                      style={{
                        //   flex: 1,
                        padding: Sizes.fixPadding,
                        borderRadius: 30,
                        width: '100%',

                        marginVertical: Sizes.fixPadding,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity>
                        <Text style={{...Fonts.white18RobotBold, fontSize: 16}}>
                          Open Kundali
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                      colors={[Colors.primaryLight, Colors.primaryDark]}
                      style={{
                        //   flex: 1,
                        padding: Sizes.fixPadding,
                        borderRadius: 30,
                        width: '100%',

                        marginVertical: Sizes.fixPadding,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity>
                        <Text style={{...Fonts.white18RobotBold, fontSize: 16}}>
                          Tarot Card Deck
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',

                  //   backgroundColor: 'red',
                  justifyContent: 'space-around',
                  alignItems: 'flex-end',
                  bottom: -60,
                  //   marginTop: Sizes.fixPadding + 29,
                }}>
                <TouchableOpacity
                  style={{width: 50, height: 50, borderRadius: 100}}>
                  <Image
                    source={require('../assets/images/mic.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: 50, height: 50, borderRadius: 100}}>
                  <Image
                    source={require('../assets/images/volume.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: 50, height: 50, borderRadius: 100}}>
                  <Image
                    source={require('../assets/icon/CutCal.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

export default OnCall;
