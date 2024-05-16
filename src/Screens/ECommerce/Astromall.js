import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyHeader from '../../component/MyHeader';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import {SCREEN_WIDTH} from '../../config/Screen';
import axios from 'axios';
import {api_url, base_url, get_mall_cat} from '../../config/Constants';
import Loader from '../../component/Loader';
import LinearGradient from 'react-native-linear-gradient';

const Astromall = ({navigation, route}) => {
  const [state, setState] = useState({
    categoryData: null,
    isLoading: false,
    selectedItem: null,
  });

  useEffect(() => {
    get_category();
  }, []);

  const get_category = async () => {
    updateState({isLoading: false});
    axios({
      method: 'get',
      url: api_url + get_mall_cat,
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          updateState({categoryData: res.data.data});
        }
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newState = {...prevState, ...data};
      return newState;
    });
  };

  const {categoryData, isLoading, selectedItem} = state;

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
          ListHeaderComponent={<>{categoryData && astromallInfo()}</>}
        />
      </View>
    </View>
  );

  function astromallInfo() {
    const navigate_to = (type, item) => {
      switch (type) {
        case 'book a pooja': {
          navigation.navigate('bookPooja', {
            categoryData: item,
            type: 'book_a_pooja',
            ...route?.params,
          });
          break;
        }
        case 'spell': {
          navigation.navigate('bookPooja', {
            categoryData: item,
            type: 'spell',
            ...route?.params
          });
          break;
        }
        default: {
          navigation.navigate('products', {
            categoryData: item,
            type: 'products',
            ...route?.params
          });
        }
      }
    };

    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigate_to(item?.name.toLowerCase(), item)}
          style={{
            width: SCREEN_WIDTH * 0.42,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
            padding: Sizes.fixPadding * 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: Sizes.fixPadding,
            backgroundColor: Colors.grayLight,
          }}>
          <View
            style={{
              width: '80%',
              height: SCREEN_WIDTH * 0.35,
              borderRadius: Sizes.fixPadding,
              overflow: 'hidden',
            }}>
            <Image
              source={{uri: base_url + 'admin/' + item.image}}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>

          <Text style={[{...Fonts.black14InterMedium}, {textAlign: 'center'}]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View>
        <FlatList
          data={categoryData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{}}
          columnWrapperStyle={{
            justifyContent: 'space-evenly',
            paddingVertical: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function header() {
    return <MyHeader navigation={navigation} title={'Astromall'} />;
  }
};

export default Astromall;

const styles = StyleSheet.create({
  itemContainer: {
    width: SCREEN_WIDTH * 0.43,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 2,
  },
  itemImageContainer: {
    width: SCREEN_WIDTH * 0.35,
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
