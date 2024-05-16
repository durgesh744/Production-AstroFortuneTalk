import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors, Fonts, Sizes } from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import { SCREEN_WIDTH } from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../component/Loader';
import {
  api_url,
  api2_get_birth_details,
  api2_get_astro_detail,
} from '../../config/Constants';
import axios from 'axios';

const detailInfo = [
  {
    id: 1,
    title: 'Birth Details',
  },
  {
    id: 2,
    title: 'Astro Details',
  },
];

const BirthDetails = ({ Cname, id, place, }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [birthData, setBirthData] = useState(null);
  const [astroDetail, setAstroDetail] = useState(null);
  const [placeOfBirth, setPlaceOfBirth] = useState(null);
  const [state, setState] = useState({
    selectedItem: 1,
  });

  const updateState = data => {
    setState(prevState => {
      const newData = { ...prevState, ...data };
      return newData;
    });
  };

  useEffect(() => {
    get_birthDetail();
    get_astroDetail();
  }, []);

  const get_birthDetail = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_birth_details,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: id,
      },
    })
      .then(res => {
        setBirthData(res.data.birth_details);
        setPlaceOfBirth(res.data?.place)
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const get_astroDetail = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_astro_detail,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: id,
      },
    })
      .then(res => {
        setAstroDetail(res.data.astro_details);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };
  const { selectedItem } = state;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {categoryInfo()}
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <>{selectedItem == 1 ? birthDetails() : astroDetails()}</>
          }
        />
      </View>
    </View>
  );

  function astroDetails() {
    return (
      astroDetail && (
        <View style={{ marginVertical: Sizes.fixPadding * 1.5 }}>
          <View
            style={{
              backgroundColor: Colors.whiteDark,
              width: SCREEN_WIDTH * 0.9,
              justifyContent: 'space-between',
              marginHorizontal: Sizes.fixPadding * 2,
              borderRadius: Sizes.fixPadding,
            }}>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Ascendent</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.ascendant}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Ascendent Lord</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.ascendant_lord}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between', 
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Varna</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Varna}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Vashya</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Vashya}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Yoni</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Yoni}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Gan</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Gan}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Nadi</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Nadi}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Sign Lord</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.SignLord}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Sign</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.sign}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Nakshatra</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Naksahtra}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Nakshatra Lord</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.NaksahtraLord}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Charan</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Charan}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Yog</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Yog}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Karan</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Karan}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Tithi</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.Tithi}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Yunja</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.yunja}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Tattv</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.tatva}</Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Name Alphabet</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.name_alphabet}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>Paya</Text>
              <Text style={{ ...Fonts.gray14RobotoMedium }}>{astroDetail.paya}</Text>
            </View>
          </View>
        </View>
      )
    );
  }

  function birthDetails() {
    return (
      birthData && (
        <View style={{ marginVertical: Sizes.fixPadding * 1.5 }}>
          <Text
            style={{
              ...Fonts.black16RobotoMedium,
              textAlign: 'center',
              marginBottom: 10,
            }}>
            Name-{birthData?.name}
          </Text>
          <View
            style={{
              backgroundColor: Colors.whiteDark,
              width: SCREEN_WIDTH * 0.9,
              justifyContent: 'space-between',
              marginHorizontal: Sizes.fixPadding * 1.5,
              borderRadius: Sizes.fixPadding,
            }}>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '60%' }}>
                Birth Date
              </Text>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '40%' }}>
                {birthData.day}-{birthData.month}-{birthData.year}
              </Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '60%' }}>
                Birth Time
              </Text>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '40%' }}>
                {birthData.hour}-{birthData.minute}
              </Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '60%' }}>
                Birth Place
              </Text>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '40%' }}>
                {placeOfBirth}
              </Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '60%' }}>
                Latitude
              </Text>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '40%' }}>
                {birthData.latitude}
              </Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '60%' }}>
                Longitude
              </Text>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '40%' }}>
                {birthData.longitude}
              </Text>
            </View>
            <View
              style={{
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '60%' }}>
                Timezone
              </Text>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '40%' }}>
                {birthData.timezone}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '60%' }}>
                Ayanamsha Degree
              </Text>
              <Text style={{ ...Fonts.gray14RobotoMedium, width: '40%' }}>
                {birthData && birthData?.ayanamsha?.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>
      )
    );
  }

  function categoryInfo() {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({ selectedItem: item.id })}>
          <LinearGradient
            colors={
              selectedItem == item.id
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.grayLight, Colors.whiteDark]
            }
            style={{
              width: SCREEN_WIDTH * 0.45,
              paddingVertical: Sizes.fixPadding * 0.8,
              marginRight: Sizes.fixPadding * 2,
              borderRadius: 1000,
            }}>
            <Text
              style={
                selectedItem == item.id
                  ? { ...Fonts.white14RobotoRegular, textAlign: 'center' }
                  : { ...Fonts.black14RobotoRegular, textAlign: 'center' }
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
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <FlatList
          data={detailInfo}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2 }}
        />
      </View>
    );
  }
};

export default BirthDetails;
