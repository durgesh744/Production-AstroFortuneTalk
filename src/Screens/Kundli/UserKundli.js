import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {SvgCssUri} from 'react-native-svg';
import {SCREEN_WIDTH} from '../../config/Screen';
import RenderHtml from 'react-native-render-html';
import MyStatusBar from '../../component/MyStatusBar';
import ShowSvg from '../../component/ShowSvg';

const categoryData = [
  {id: 1, title: 'Details'},
  {id: 2, title: 'Lagna'},
  {id: 3, title: 'Dosha'},
  {id: 4, title: 'Panchang'},
  {id: 5, title: 'Prediction'},
];

const todayData = [
  {id: 1, title: 'Choghadiya'},
  {id: 2, title: 'Subh Hora'},
  {id: 3, title: 'Nakshatra'},
];

const UserKundli = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState(1);
  const {panchangData, chartData, kundliDoshaData, basicData} = route.params;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-Content'}
      />
      {header()}
      <ImageBackground
        source={require('../../assets/images/ChatBackground.png')}
        style={{flex: 1}}>
        {categoryInfo()}
        <FlatList
          ListHeaderComponent={
            <>
              {selectedItem == 1
                ? kundliDetailesInfo()
                : selectedItem == 2
                ? chartData && lagnaInfo()
                : selectedItem == 3
                ? doshaInfo()
                : selectedItem == 4
                ? panchangData && panchangInfo()
                : predictionInfo()}
            </>
          }
        />
      </ImageBackground>
    </View>
  );
  function predictionInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 1.5}}>
        <View style={{marginBottom: Sizes.fixPadding * 1.5}}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Personal Life
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            Your personal communications will have an emotional depth and will
            be fruitful. You shall be very popular in social circles. You may
            make plans of investing in a new home, property or a vehicle. You
            will discuss your future plans with loved ones.
          </Text>
        </View>
        <View style={{marginBottom: Sizes.fixPadding * 1.5}}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Luck
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            You shall experience happiness and excitement all around. You will
            move ahead with renewed vigor and confidence and achieve even the
            seemingly impossible tasks.
          </Text>
        </View>
        <View style={{marginBottom: Sizes.fixPadding * 1.5}}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Health
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            Travel will help you in overcoming your boredom for a short period.
            You'll remain enthusiastic during traveling.
          </Text>
        </View>
        <View style={{marginBottom: Sizes.fixPadding * 1.5}}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Profession
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            A opportunity opens up to offer you better prospects in your career.
            Family and friends shall help you financially to set up your won
            venture. Businessmen
          </Text>
        </View>
      </View>
    ); 
  }

  function hinduCalenderInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding,
        }}>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Shaka Samvat</Text>
          <Text style={styles.panchangSubText}>1945</Text>
        </View>
        <View style={[styles.panchangItems, {borderBottomWidth: 0}]}>
          <Text style={styles.panchangMainText}>Shaka Samvat</Text>
          <Text style={styles.panchangSubText}>1945</Text>
        </View>
      </View>
    );
  }

  function hinduCalenderTitleInfo() {
    return (
      <View
        style={[
          {
            margin: Sizes.fixPadding * 1.5,
            borderWidth: 2,
            justifyContent: 'center',
            paddingVertical: Sizes.fixPadding * 0.8,
            borderRadius: 1000,
            borderColor: Colors.gray,
          },
        ]}>
        <Text
          style={{
            ...Fonts.gray18RobotoMedium,
            marginLeft: Sizes.fixPadding * 2,
          }}>
          Hindu Month & Year
        </Text>
      </View>
    );
  }

  function panchangDetailes() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding,
        }}>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Tithi</Text>
          <Text style={styles.panchangSubText}>{panchangData?.tithi}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Nakshatra</Text>
          <Text style={styles.panchangSubText}>{panchangData?.nakshatra}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Karan</Text>
          <Text style={styles.panchangSubText}>{panchangData?.karan}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Paksha</Text>
          <Text style={styles.panchangSubText}>{panchangData?.tithi}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Yog</Text>
          <Text style={styles.panchangSubText}>{panchangData?.yog}</Text>
        </View>
        <View style={[styles.panchangItems, {borderBottomWidth: 0}]}>
          <Text style={styles.panchangMainText}>Day</Text>
          <Text style={styles.panchangSubText}>{panchangData?.day}</Text>
        </View>
      </View>
    );
  }

  function sunriseMoonRiseInfo() {
    return (
      <View
        style={[
          styles.row,
          {margin: Sizes.fixPadding * 1.5, justifyContent: 'space-between'},
        ]}>
        <View
          style={[
            styles.row,
            {
              width: '48%',
              borderWidth: 2,
              justifyContent: 'center',
              paddingVertical: Sizes.fixPadding * 0.8,
              borderRadius: 1000,
              borderColor: Colors.gray,
            },
          ]}>
          <Image
            source={require('../../assets/icon/sunrise.png')}
            style={{width: 25, height: 25}}
          />
          <Text
            style={{
              ...Fonts.gray12RobotoRegular,
              marginLeft: Sizes.fixPadding,
            }}>
            {`${moment(panchangData?.vedic_sunrise, 'hh:mm:ss').format(
              'hh:mm A',
            )}-${moment(panchangData?.vedic_sunset, 'hh:mm:ss').format(
              'hh:mm A',
            )}`}
          </Text>
        </View>
        <View
          style={[
            styles.row,
            {
              width: '48%',
              borderWidth: 2,
              justifyContent: 'center',
              paddingVertical: Sizes.fixPadding * 0.8,
              borderRadius: 1000,
              borderColor: Colors.gray,
            },
          ]}>
          <Image
            source={require('../../assets/icon/moon.png')}
            style={{width: 25, height: 25}}
          />
          <Text
            style={{
              ...Fonts.gray12RobotoRegular,
              marginLeft: Sizes.fixPadding,
            }}>
            05:52 AM-06:54 PM
          </Text>
        </View>
      </View>
    );
  }

  function todayLocationInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <TouchableOpacity
            style={[
              styles.row,
              {
                borderWidth: 2,
                padding: Sizes.fixPadding,
                borderRadius: 1000,
                borderColor: Colors.gray,
                paddingVertical: Sizes.fixPadding * 0.8,
              },
            ]}>
            <Image
              source={require('../../assets/icon/magic-book.png')}
              style={{width: 25, height: 25}}
            />
            <Text
              style={{
                ...Fonts.gray16RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              Today's Panchang
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.row,
              {
                borderWidth: 2,
                padding: Sizes.fixPadding,
                borderRadius: 1000,
                borderColor: Colors.gray,
                paddingVertical: Sizes.fixPadding * 0.8,
              },
            ]}>
            <Image
              source={require('../../assets/icon/pin.png')}
              style={{width: 25, height: 25}}
            />
            <Text
              style={{
                ...Fonts.gray16RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function todaysInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity>
          <LinearGradient
            colors={[Colors.whiteDark, Colors.grayLight]}
            style={{
              width: SCREEN_WIDTH * 0.3,
              marginRight: Sizes.fixPadding * 2,
              paddingVertical: Sizes.fixPadding * 0.8,
              borderRadius: 1000,
            }}>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                color: Colors.blackLight,
                textAlign: 'center',
              }}>
              {item.title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.gray16RobotoMedium,
            color: Colors.blackLight,
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          Today's
        </Text>
        <FlatList
          data={todayData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          contentContainerStyle={{paddingLeft: Sizes.fixPadding * 1.5}}
        />
      </View>
    );
  }

  function panchangInfo() {
    return (
      <View>
        {todaysInfo()}
        {todayLocationInfo()}
        {sunriseMoonRiseInfo()}
        {panchangDetailes()}
        {hinduCalenderTitleInfo()}
        {hinduCalenderInfo()}
      </View>
    );
  }

  function doshaInfo() {
    return (
      <View>
        <Image
          source={require('../../assets/images/kundli_dosha.png')}
          style={{
            width: SCREEN_WIDTH * 0.55,
            height: SCREEN_WIDTH * 0.55,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Manglik Dosha
          </Text>
          <RenderHtml
            contentWidth={SCREEN_WIDTH}
            source={{
              html: `<p>${kundliDoshaData?.manglik?.manglik_report}</p>`,
            }}
            enableExperimentalMarginCollapsing={true}
            baseStyle={{
              color: Colors.blackLight,
              textAlign: 'justify',
              fontSize: '14px',
              lineHeight: 22,
            }}
          />
        </View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            KalSarpa Dosha
          </Text>
          <RenderHtml
            contentWidth={SCREEN_WIDTH}
            source={{html: kundliDoshaData?.kalsarpa_details?.report?.report}}
            enableExperimentalMarginCollapsing={true}
            baseStyle={{
              color: Colors.blackLight,
              textAlign: 'justify',
              fontSize: '14px',
              lineHeight: 22,
            }}
          />
        </View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            SadheSati Dosha
          </Text>
          <RenderHtml
            contentWidth={SCREEN_WIDTH}
            source={{html: kundliDoshaData?.kalsarpa_details?.report?.report}}
            enableExperimentalMarginCollapsing={true}
            baseStyle={{
              color: Colors.blackLight,
              textAlign: 'justify',
              fontSize: '14px',
              lineHeight: 22,
            }}
          />
        </View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Pitri Dosha
          </Text>
          <RenderHtml
            contentWidth={SCREEN_WIDTH}
            source={{html: kundliDoshaData?.pitra_dosha_report?.conclusion}}
            enableExperimentalMarginCollapsing={true}
            baseStyle={{
              color: Colors.blackLight,
              textAlign: 'justify',
              fontSize: '14px',
              lineHeight: 22,
            }}
          />
        </View>
      </View>
    );
  }

  function lagnaInfo() {
    return (
      <View>
        <ShowSvg data={chartData} />
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit
            amet, consectetur adipiscing elit consectetur adipiscing elitipsum
            dolor sit ametLorem ipsum dolor sit amet, Lorem ipsum dolor sit
            amet, consectetur adipiscing elitconsectetur adipiscing elit
          </Text>
        </View>
      </View>
    );
  }

  function kundliDetailesInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          backgroundColor: '#EDD8FE',
          borderRadius: Sizes.fixPadding,
        }}>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Birth Date</Text>
          <Text style={styles.panchangSubText}>
            {moment(basicData?.astroDetails?.date_of_birth).format(
              'DD-MM-YYYY',
            )}
          </Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Birth Time</Text>
          <Text style={styles.panchangSubText}>
            {moment(basicData?.astroDetails?.time_of_birth, 'hh:mm:ss').format(
              'hh:mm A',
            )}
          </Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Birth Place</Text>
          <Text style={styles.panchangSubText}>
            {basicData?.astroDetails?.current_address}
          </Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Gan</Text>
          <Text style={styles.panchangSubText}>{basicData?.details?.Gan}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Sign Lord</Text>
          <Text style={styles.panchangSubText}>
            {basicData?.details?.SignLord}
          </Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Sign</Text>
          <Text style={styles.panchangSubText}>{basicData?.details?.sign}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Gemini</Text>
          <Text style={styles.panchangSubText}>
            {basicData?.details?.NaksahtraLord}
          </Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Nakshatra Lord</Text>
          <Text style={styles.panchangSubText}>
            {basicData?.details?.NaksahtraLord}
          </Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Nakshatra</Text>
          <Text style={styles.panchangSubText}>
            {basicData?.details?.Naksahtra}
          </Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Shoodra</Text>
          <Text style={styles.panchangSubText}>{basicData?.details?.Gan}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Nadi</Text>
          <Text style={styles.panchangSubText}>{basicData?.details?.Nadi}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Charan</Text>
          <Text style={styles.panchangSubText}>
            {basicData?.details?.Charan}
          </Text>
        </View>
        <View style={[styles.panchangItems, {borderBottomWidth: 0}]}>
          <Text style={styles.panchangMainText}>Tatva</Text>
          <Text style={styles.panchangSubText}>{basicData?.details?.Gan}</Text>
        </View>
      </View>
    );
  }

  function categoryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedItem(item.id)}>
          <LinearGradient
            colors={
              selectedItem == item.id
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.grayLight, Colors.whiteDark]
            }
            style={{
              width: SCREEN_WIDTH * 0.28,
              paddingVertical: Sizes.fixPadding * 0.8,
              marginRight: Sizes.fixPadding * 2,
              borderRadius: 1000,
            }}>
            <Text
              style={
                selectedItem == item.id
                  ? {...Fonts.white14RobotoRegular, textAlign: 'center'}
                  : {...Fonts.black14RobotoRegular, textAlign: 'center'}
              }>
              {item.title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
        }}>
        <FlatList
          data={categoryData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingLeft: Sizes.fixPadding * 2}}
        />
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          ...styles.row,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{padding: Sizes.fixPadding * 1.5}}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            textAlign: 'center',
            flex: 0.9,
          }}>
          Kundli
        </Text>
      </View>
    );
  }
};

export default UserKundli;

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
  panchangItems: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 1.3,
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.primaryDark,
  },
  panchangMainText: {
    ...Fonts.gray14RobotoMedium,
    color: Colors.blackLight,
    flex: 0.5,
  },
  panchangSubText: {
    ...Fonts.gray14RobotoMedium,
    color: Colors.blackLight,
    flex: 0.5,
  },
});
