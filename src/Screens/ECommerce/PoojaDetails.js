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
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSharedValue} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import {provider_img_url} from '../../config/Constants';

const PoojaDetails = ({navigation, route}) => {
  const progressValue = useSharedValue(0);
  const [state, setState] = useState({
    paginationIndex: 0,
    poojaData: route?.params?.poojaData,
  });
  useEffect(() => {}, [paginationIndex]);

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {paginationIndex, poojaData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {header()}
              {bannerInfo()}
              {renderPagination()}
              {categoryInfo()}
              {poojaNameInfo()}
              {aboutPoojaInfo()}
            </>
          }
        />
      </View>
      {continueButtonInfo()}
    </View>
  );

  function continueButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('registerPooja', {pooja_id: poojaData?.id})
        }
        style={{
          marginHorizontal: Sizes.fixPadding * 3,
          marginVertical: Sizes.fixPadding,
          borderRadius: 1000,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.white18RobotMedium, textAlign: 'center'}}>
            Schedule a Pooja
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function aboutPoojaInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding * 2,
        }}>
        <Text style={{...Fonts.gray16RobotoMedium, color: Colors.blackLight}}>
          About the Pooja
        </Text>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.8,
          }}>
          {poojaData?.description}
        </Text>
      </View>
    );
  }

  function poojaNameInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding * 0.5,
        }}>
        <Text style={{...Fonts.primaryDark18RobotoMedium}}>
          {poojaData?.title}
        </Text>
      </View>
    );
  }

  function categoryInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding,
        }}>
        <Text
          style={{...Fonts.gray14RobotoRegular, textTransform: 'capitalize'}}>
          Category - {poojaData?.category_pooja}
        </Text>
      </View>
    );
  }

  function renderPagination() {
    return (
      <View style={styles.paginationContainer}>
        {poojaData?.collection.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  paginationIndex === index
                    ? Colors.blackLight
                    : Colors.grayDark + '70',
              },
            ]}
          />
        ))}
      </View>
    );
  }

  function bannerInfo() {
    const baseOptions = {
      vertical: false,
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.7,
    };

    const renderItem = ({index}) => {
      return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.7,
            height: SCREEN_WIDTH * 0.7,
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding * 2,
            alignSelf: 'center',
          }}>
          <Image
            source={{uri: provider_img_url + poojaData?.collection[index]}}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      );
    };

    return (
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <Carousel
          {...baseOptions}
          loop
          testID={'xxx'}
          style={{
            width: '100%',
            borderBottomColor: Colors.grayLight,
            paddingHorizontal: Sizes.fixPadding,
            marginTop: Sizes.fixPadding * 2,
          }}
          autoPlay={true}
          autoPlayInterval={4000}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress;
          }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 90,
          }}
          data={poojaData?.collection}
          pagingEnabled={true}
          onSnapToItem={index => {
            updateState({paginationIndex: index});
          }}
          renderItem={renderItem}
        />
      </SafeAreaView>
    );
  }

  function header() {
    return <MyHeader navigation={navigation} title={'Schedule a Pooja'} />;
  }
};

export default PoojaDetails;

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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizes.fixPadding,
  },
  paginationDot: {
    width: 12,
    height: 2,
    borderRadius: 5,
    margin: 5,
  },
});
