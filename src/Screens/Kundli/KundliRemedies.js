import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../component/MyStatusBar';
import { SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../component/Loader';
import {
  api_url,
  api2_get_rudraksha_sugg,
  api2_get_gemstone_sugg,
  img_url_3,
  
} from '../../config/Constants';
import axios from 'axios';


const remediesInfo = [
  {
    id: 1,
    name: 'Gemstones',
  },
  {
    id: 2,
    name: 'Rudraksh',
  },
];

const KundliRemedies = ({id}) => {
  const [rudrakshaInfo, setRudrakshaInfo] = useState(null);
  const [gemstone, setGemStone] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    selectedItem: 1,
  });


  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  useEffect(() => {
    get_kundli_rudraksha();
    get_kundli_gemstone();
  }, []);


  console.log('This is kunldi remiedis',rudrakshaInfo?.img_url)
  const get_kundli_gemstone = useCallback(async () => {
    setIsLoading(true);
    await axios({
        method: 'post',
        url: api_url + api2_get_gemstone_sugg,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: {
            kundli_id: id,
        },
    })
    .then(res => {
        setGemStone(res.data?.basic_gem_suggestion);
        setIsLoading(false);
    })
    .catch(err => {
        console.log(err);
        setIsLoading(false);
    });
}, [id]);

 
  const get_kundli_rudraksha = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_rudraksha_sugg,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id:id,
      },
    })
      .then(res => {
        setRudrakshaInfo(res.data?.rudraksha_suggestion);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const {selectedItem} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {categoryInfo()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>{selectedItem == 1 ? stoneInfo() : rudraksha()}</>
          }
        />
      </View>
    </View>
  );

  function rudraksha() {
    return (
      rudrakshaInfo && (
      <View
        style={{width: SCREEN_WIDTH * 0.9, marginHorizontal: Sizes.fixPadding}}>
        <Text
          style={{
            ...Fonts.gray16RobotoMedium,
            marginVertical: Sizes.fixPadding,
          }}>
          Rudraksha Suggestion
        </Text>
        <View style={{alignItem: 'center', justifyContent: 'center'}}>
          <View
            style={{
              alignSelf: 'center',
              borderRadius: Sizes.fixPadding,
              borderWidth: 2,
              borderColor: Colors.primaryDark,
              width: SCREEN_WIDTH * 0.25,
              height: SCREEN_WIDTH * 0.25,
              padding: Sizes.fixPadding,
              backgroundColor: Colors.white,
              marginTop: Sizes.fixPadding,
              zIndex: 1,
            }}>
            <Image
              style={{width: '100%', height: '100%', resizeMode: 'cover', borderRadius:Sizes.fixPadding }}
            />
          </View>
          <View
            style={{
              backgroundColor: Colors.orange_light,
              marginVertical: Sizes.fixPadding,
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
              paddingTop: Sizes.fixPadding * 5,
              top: -50,
            }}>
            <Text
              style={{
                ...Fonts.primaryLight14RobotoMedium,
                textAlign: 'center',
              }}>
              {rudrakshaInfo.name}
            </Text>
            <Text
              style={{
                ...Fonts.gray12RobotoRegular,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              {rudrakshaInfo.detail}
            </Text>
          </View>
        </View>
      </View>
      )
    );
  }

  function stoneInfo() {
    return (
      gemstone && (
      <View
        style={{
          width: SCREEN_WIDTH * 0.9,
          marginHorizontal: Sizes.fixPadding * 1.5,
        }}>
        <Text
          style={{
            ...Fonts.gray16RobotoMedium,
            marginVertical: Sizes.fixPadding,
          }}>
          Gemstones Remedies
        </Text>
        <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: SCREEN_WIDTH * 0.25,
                height: SCREEN_WIDTH * 0.25,
                borderRadius: Sizes.fixPadding * 2,
                borderWidth: 2,
                borderColor: Colors.grayA,
                backgroundColor: Colors.white,
              }}>
              <Image
                source={{uri: img_url_3 + gemstone.LIFE.stone_image}}
                style={{width: '100%', height: '100%', resizeMode: 'cover', borderRadius:Sizes.fixPadding*2}}
              />
            </View>
            <View
              style={{
                padding: Sizes.fixPadding * 0.5,
                backgroundColor: Colors.orange_light,
                width: '80%',
                height: SCREEN_WIDTH * 0.25,
                marginLeft: -20,
                zIndex: -1,
                paddingLeft: 30,
                borderRadius: Sizes.fixPadding,
              }}>
              <Text style={{...Fonts.primaryLight14RobotoMedium}}>
                Life Stone : {gemstone.LIFE.name}
              </Text>
              <Text style={{...Fonts.black12RobotoRegular}}>
                Substitude: {gemstone.LIFE.semi_gem}
              </Text>
              <Text style={{...Fonts.gray11RobotoRegular}}>Weight: {gemstone.LIFE.weight_caret}</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '70%'}}>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Finger: {gemstone.LIFE.wear_finger}
                  </Text>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Deity: {gemstone.LIFE.gem_deity}
                  </Text>
                </View>
                <View style={{width: '70%'}}>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Metal: {gemstone.LIFE.wear_metal}
                  </Text>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Day: {gemstone.LIFE.wear_day}
                  </Text>
                </View>
              </View>
            </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: Sizes.fixPadding}}>
            <View
              style={{
                width: SCREEN_WIDTH * 0.25,
                height: SCREEN_WIDTH * 0.25,
                borderRadius: Sizes.fixPadding * 2,
                borderWidth: 2,
                borderColor: Colors.grayA,
                backgroundColor: Colors.white,
              }}>
              <Image
                source={{uri: img_url_3 + gemstone.BENEFIC.stone_image}}
                
                style={{width: '100%', height: '100%', resizeMode: 'cover', borderRadius:Sizes.fixPadding*2}}
              />
            </View>
            <View
              style={{
                padding: Sizes.fixPadding * 0.5,
                backgroundColor: Colors.orange_light,
                width: '80%',
                height: SCREEN_WIDTH * 0.25,
                marginLeft: -20,
                zIndex: -1,
                paddingLeft: 30,
                borderRadius: Sizes.fixPadding,
              }}>
              <Text style={{...Fonts.primaryLight14RobotoMedium}}>
                Life Stone : {gemstone.BENEFIC.name}
              </Text>
              <Text style={{...Fonts.black12RobotoRegular}}>
                Substitude: {gemstone.BENEFIC.semi_gem}
              </Text>
              <Text style={{...Fonts.gray11RobotoRegular}}>Weight: {gemstone.BENEFIC.weight_caret}</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '70%'}}>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Finger: {gemstone.BENEFIC.wear_finger}
                  </Text>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Deity: {gemstone.BENEFIC.gem_deity}
                  </Text>
                </View>
                <View style={{width: '70%'}}>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Metal: {gemstone.BENEFIC.wear_metal}
                  </Text>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Day: {gemstone.BENEFIC.wear_day}
                  </Text>
                </View>
              </View>
            </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: Sizes.fixPadding}}>
            <View
              style={{
                width: SCREEN_WIDTH * 0.25,
                height: SCREEN_WIDTH * 0.25,
                borderRadius: Sizes.fixPadding * 2,
                borderWidth: 2,
                borderColor: Colors.grayA,
                backgroundColor: Colors.white,
              }}>
              <Image
              source={{uri: img_url_3 + gemstone.LUCKY.stone_image}}
                style={{width: '100%', height: '100%', resizeMode: 'cover', borderRadius:Sizes.fixPadding*2}}
              />
            </View>
            <View
              style={{
                padding: Sizes.fixPadding * 0.5,
                backgroundColor: Colors.orange_light,
                width: '80%',
                height: SCREEN_WIDTH * 0.25,
                marginLeft: -20,
                zIndex: -1,
                paddingLeft: 30,
                borderRadius: Sizes.fixPadding,
              }}>
              <Text style={{...Fonts.primaryLight14RobotoMedium}}>
                Life Stone : {gemstone.LUCKY.name}
              </Text>
              <Text style={{...Fonts.black12RobotoRegular}}>
                Substitude: {gemstone.LUCKY.semi_gem}
              </Text>
              <Text style={{...Fonts.gray11RobotoRegular}}>Weight: {gemstone.LUCKY.weight_caret}</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '65%'}}>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Finger: {gemstone.LUCKY.wear_finger}
                  </Text>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Deity: {gemstone.LUCKY.gem_deity}
                  </Text>
                </View>
                <View style={{width: '70%'}}>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '50%'}}>
                    Metal: {gemstone.LUCKY.wear_metal}
                  </Text>
                  <Text style={{...Fonts.gray11RobotoRegular, width: '60%'}}>
                    Day: {gemstone.LUCKY.wear_day}
                  </Text>
                </View>
              </View>
            </View>
        </View>
      </View>
        )    
    );
  }

  function categoryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({selectedItem: item.id})}>
          <LinearGradient
            colors={
              selectedItem == item.id
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.grayLight, Colors.whiteDark]
            }
            style={{
              width: SCREEN_WIDTH * 0.4,
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
              {item.name}
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
          data={remediesInfo}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingLeft: Sizes.fixPadding * 2}}
        />
      </View>
    );
  }
};

export default KundliRemedies;
