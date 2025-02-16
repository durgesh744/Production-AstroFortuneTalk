import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Sizes, Fonts} from '../assets/style';
import {SCREEN_WIDTH} from '../config/Screen';
const MyHeader = ({navigation, title}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign
          name="leftcircleo"
          color={Colors.primaryDark}
          size={24}
          style={{alignSelf: 'center'}}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={{...Fonts.primaryDark16RobotoMedium, textAlign: 'center'}}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default MyHeader;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  textContainer: {
    width: SCREEN_WIDTH,
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    padding: Sizes.fixPadding,
    zIndex: -1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
