import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyHeader from '../../component/MyHeader';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Loader from '../../component/Loader';
import {
  api_url,
  base_url,
  category_pooja_list,
  provider_img_url,
} from '../../config/Constants';

const PoojaList = ({navigation}) => {
  const [state, setState] = useState({
    isLoading: true,
    poojaData: null,
    isSpell: false,
    spellData: null,
  });

  useEffect(() => {
    get_pooja();
  }, []);

  const get_pooja = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'get',
      url: api_url + category_pooja_list,
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          const sData = res.data.data.filter(
            item => item.category_pooja == 'spell',
          );
          const nPoojaData = res.data.data.filter(
            item => item.category_pooja != 'spell',
          );
          updateState({poojaData: nPoojaData, spellData: sData});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, poojaData, spellData, isSpell} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {categoryInfo()}
              {!isSpell
                ? poojaData && astromallInfo()
                : spellData && spellDataInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  function spellDataInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('poojaDetails', {poojaData: item})}
          activeOpacity={0.9}
          style={styles.itemContainer}>
          <View
            style={{
              width: '100%',
              height: 200,
              borderRadius: Sizes.fixPadding * 2,
              overflow: 'hidden',
              elevation: 8,
              shadowColor: Colors.blackLight,
            }}>
            <ImageBackground
              source={{uri: provider_img_url + item.image}}
              resizeMode="cover"
              style={{width: '100%', height: '100%'}}>
              <LinearGradient
                colors={[Colors.black + '00', Colors.black]}
                locations={[0.7, 1]}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'flex-end',
                  padding: Sizes.fixPadding * 1.5,
                }}>
                <Text style={{...Fonts.white16RobotoMedium}}>{item.title}</Text>
                <Text style={{...Fonts.white14RobotoRegular}}>
                  with {item.sub_title}
                </Text>
              </LinearGradient>
            </ImageBackground>
          </View>
          <ImageBackground
            source={require('../../assets/images/schedule_pooja.png')}
            style={{
              width: SCREEN_WIDTH * 0.6,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              top: -Sizes.fixPadding * 1.5,
              zIndex: -1,
            }}
            resizeMode="contain">
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                marginTop: Sizes.fixPadding,
              }}>
              Schedule a Spell
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{margin: Sizes.fixPadding * 1.5}}>
        <FlatList
          data={spellData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  function astromallInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('poojaDetails', {poojaData: item})}
          activeOpacity={0.9}
          style={styles.itemContainer}>
          <View
            style={{
              width: '100%',
              height: 200,
              borderRadius: Sizes.fixPadding * 2,
              overflow: 'hidden',
              elevation: 8,
              shadowColor: Colors.blackLight,
            }}>
            <ImageBackground
              source={{uri: provider_img_url + item.image}}
              resizeMode="cover"
              style={{width: '100%', height: '100%'}}>
              <LinearGradient
                colors={[Colors.black + '00', Colors.black]}
                locations={[0.7, 1]}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'flex-end',
                  padding: Sizes.fixPadding * 1.5,
                }}>
                <Text style={{...Fonts.white16RobotoMedium}}>{item.title}</Text>
                <Text style={{...Fonts.white14RobotoRegular}}>
                  with {item.sub_title}
                </Text>
              </LinearGradient>
            </ImageBackground>
          </View>
          <ImageBackground
            source={require('../../assets/images/schedule_pooja.png')}
            style={{
              width: SCREEN_WIDTH * 0.6,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              top: -Sizes.fixPadding * 1.5,
              zIndex: -1,
            }}
            resizeMode="contain">
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                marginTop: Sizes.fixPadding,
              }}>
              Schedule a Pooja
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{margin: Sizes.fixPadding * 1.5}}>
        <FlatList
          data={poojaData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  function categoryInfo() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: Sizes.fixPadding,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({isSpell: false})}
          style={{width: '45%'}}>
          <LinearGradient
            colors={
              !isSpell
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.gray, Colors.gray]
            }
            style={{
              width: '100%',
              borderRadius: 1000,
              paddingVertical: Sizes.fixPadding * 0.7,
            }}>
            <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
              E-Pooja
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({isSpell: true})}
          style={{width: '45%'}}>
          <LinearGradient
            colors={
              isSpell
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.gray, Colors.gray]
            }
            style={{
              width: '100%',
              borderRadius: 1000,
              paddingVertical: Sizes.fixPadding * 0.7,
            }}>
            <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
              Spell
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  function header() {
    return <MyHeader navigation={navigation} title={'Book a Pooja'} />;
  }
};

export default PoojaList;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 2,
  },
  itemImageContainer: {
    width: '100%',
    height: SCREEN_WIDTH * 0.4,
    borderRadius: Sizes.fixPadding * 2,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.blackLight,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemText: {
    ...Fonts.black16RobotoRegular,
    marginTop: Sizes.fixPadding * 0.4,
  },
});
