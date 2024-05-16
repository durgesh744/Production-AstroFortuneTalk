import {View, Text, StatusBar} from 'react-native';
import React from 'react';

const MyStatusBar = ({backgroundColor, barStyle, translucent}) => {
  return (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      translucent={translucent}
    />
  );
};

export default MyStatusBar;
