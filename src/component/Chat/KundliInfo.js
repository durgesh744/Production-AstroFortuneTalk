import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {SvgCssUri} from 'react-native-svg';
import {SCREEN_WIDTH} from '../../config/Screen';
import Modal from 'react-native-modal';
import RenderHtml from 'react-native-render-html';
import ShowSvg from '../ShowSvg';

const categoryData = [
  {id: 1, title: 'Details'},
  {id: 2, title: 'Lagna'},
  {id: 3, title: 'Dosha'},
  {id: 4, title: 'Panchang'},
  {id: 5, title: 'Prediction'},
];

const todayData = [
  {id: 1, title: 'Choghadiya'},
  {id: 2, title: 'Subh Hora'},
  {id: 3, title: 'Nakshatra'},
];

const KundliInfo = ({
  kundliModalVisible,
  panchangData,
  chartData,
  kundliDoshaData,
  updateState,
  basicData,
}) => {
  const [selectedItem, setSelectedItem] = useState(1);
  return (
    <Modal
      isVisible={kundliModalVisible}
      onBackButtonPress={() => updateState({kundliModalVisible: false})}
      style={{margin: 0, padding: 0}}>

    </Modal>
  );


};

export default KundliInfo;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  panchangItems: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 1.3,
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.primaryDark,
  },
  panchangMainText: {
    ...Fonts.gray14RobotoMedium,
    color: Colors.blackLight,
    flex: 0.5,
  },
  panchangSubText: {
    ...Fonts.gray14RobotoMedium,
    color: Colors.blackLight,
    flex: 0.5,
  },
});
