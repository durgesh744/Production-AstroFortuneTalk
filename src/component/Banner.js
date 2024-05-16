import {View, Text, Image} from 'react-native';
import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {SCREEN_WIDTH} from '../config/Screen';
import {Colors, Sizes} from '../assets/style';
import {img_url, provider_img_url} from '../config/Constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const Banner = ({data}) => {
  const baseOptions = {
    vertical: false,
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.4,
  };

  const renderItem = ({index}) => {
    return (
      <View
        style={{
          width: SCREEN_WIDTH * 0.9,
          height: SCREEN_WIDTH * 0.35,
          backgroundColor: Colors.whiteColor,
          borderRadius: Sizes.fixPadding,
          alignSelf: 'center',
          overflow: 'hidden',
        }}>
        <Image
          source={{uri: img_url + data[index]?.image}}
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
    <Carousel
      {...baseOptions}
      // loop
      testID={'xxx'}
      style={{
        width: '100%',
      }}
      // autoPlay={true}
      // autoPlayInterval={4000}
      // onProgressChange={(_, absoluteProgress) => {
      //   progressValue.value = absoluteProgress;
      // }}
      data={[...data, ...data]}
      pagingEnabled={true}
      onSnapToItem={index => {
        //   updateState({paginationIndex: index});
      }}
      snapEnabled={true}
      renderItem={renderItem}
      
    />
  );
};

export default Banner;
