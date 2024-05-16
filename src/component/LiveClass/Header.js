import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import {Colors, Sizes, Fonts} from '../../assets/style';
import {Switch} from 'react-native-switch';

const Header = ({rotateScreen, cameraBackFrontChange}) => {
  const [frontBackCamera, setFronBackCamera] = useState(false);

  const cameraHandle = () => {
    if (frontBackCamera) {
      cameraBackFrontChange(false);
      setFronBackCamera(false);
    } else {
      cameraBackFrontChange(true);
      setFronBackCamera(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => cameraHandle()}
        style={styles.rotateContainer}>
        <Image
          source={require('../../assets/icon/screen_rotate.png')}
          style={{width: '60%', height: '60%', resizeMode: 'contain'}}
        />
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{...Fonts.white14RobotoMedium, marginRight: Sizes.fixPadding}}>
          Record the Screen
        </Text>
        <Switch
          value={true}
          renderActiveText={false}
          renderInActiveText={false}
          circleBorderWidth={4}
          circleSize={20}
          circleBorderActiveColor={Colors.primaryLight}
          backgroundActive={Colors.primaryLight}
          backgroundInactive={Colors.white}
          circleBorderInactiveColor={Colors.grayLight}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    margin: Sizes.fixPadding * 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rotateContainer: {
    width: 35,
    height: 35,
    borderRadius: 1000,
    backgroundColor: Colors.blackLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
