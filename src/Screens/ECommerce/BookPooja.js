import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Input} from '@rneui/themed';
import axios from 'axios';
import {
  api_url,
  base_url,
  category_pooja_list,
  provider_img_url,
} from '../../config/Constants';
import MyStatusBar from '../../component/MyStatusBar';
import Loader from '../../component/Loader';
import {Colors, Sizes, Fonts} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import MyHeader from '../../component/MyHeader';

const BookPooja = ({navigation, route}) => {
  const [state, setState] = useState({
    categoryData: route.params?.categoryData,
    screeType: route.params?.categoryData?.name.toLowerCase(),
    poojaData: null,
    isLoading: false,
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
          if (route.params?.categoryData?.name.toLowerCase() == 'spell') {
            const data = res.data.data.filter(
              item => item.category_pooja == 'spell',
            );
            updateState({poojaData: data});
          } else {
            const data = res.data.data.filter(
              item => item.category_pooja != 'spell',
            );
            updateState({poojaData: data});
          }
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const search_product = search => {};

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {categoryData, screeType, poojaData, isLoading} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {searchInfo()}
              {bannerInfo()}
              {poojaData && bookAPoojaInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function bookAPoojaInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('poojaAstrologer', {
              pooja_id: item.id,
              ...route.params,
            })
          }
          style={{
            height: SCREEN_WIDTH * 0.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          <ImageBackground
            source={{uri: provider_img_url + item.image}}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover">
            <LinearGradient
              colors={[Colors.black + '00', Colors.black]}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'flex-end',
                padding: Sizes.fixPadding,
              }}
              locations={[0.7, 1]}>
              <Text style={{...Fonts.white18RobotMedium}}>{item?.title}</Text>
              <Text style={{...Fonts.white14RobotoMedium}}>
                {item.sub_title}
              </Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{marginHorizontal: Sizes.fixPadding}}>
        <FlatList
          data={poojaData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  function bannerInfo() {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          marginBottom: Sizes.fixPadding,
          borderColor: Colors.grayLight,
          borderTopWidth: 1,
          paddingTop: Sizes.fixPadding,
        }}>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginBottom: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 2,
            overflow: 'hidden',
          }}>
          <Image
            source={{uri: base_url + 'admin/' + categoryData?.banner}}
            style={{width: '100%', height: 110, resizeMode: 'cover'}}
          />
        </View>
      </View>
    );
  }

  function searchInfo() {
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Colors.gray + '30',
          ...styles.row,
        }}>
        <Input
          placeholder={`Search for ${categoryData?.name}`}
          placeholderTextColor={Colors.gray}
          inputStyle={{...Fonts.black14InterMedium}}
          containerStyle={{
            height: 36,
            flex: 1,
            flexGrow: 1.3,
          }}
          inputContainerStyle={{
            borderBottomWidth: 0,
            margin: 0,
            padding: 0,
            paddingVertical: 0,
            paddingTop: 0,
            backgroundColor: Colors.grayLight + '90',
            borderRadius: 1000,
            paddingHorizontal: Sizes.fixPadding,
            height: 36,
          }}
          rightIcon={
            <Image
              source={require('../../assets/icon/search.png')}
              style={{width: 20, height: 20}}
            />
          }
        />
        {/* <TouchableOpacity style={{flex: 0.2, marginLeft: Sizes.fixPadding}}>
          <Image
            source={require('../assets/images/icons/filter.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity> */}
      </View>
    );
  }

  function header() {
    return <MyHeader title={screeType} navigation={navigation} />;
  }
};

export default BookPooja;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
