import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextBase } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes } from '../../../src/assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../component/MyStatusBar';
import Loader from '../../component/Loader';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_WIDTH } from '../../config/Screen';
import BirthDetails from './BirthDetails';
import HoroscopeChart from './HoroscopeChart';
import PlanetaryDetails from './PlanetaryDetails';
import Favourable from './Favourable';
import KPChart from './KPChart';
import KundliDosh from './KundliDosh';
import VimshottariDasha from './VimshottariDasha';
import KundliRemedies from './KundliRemedies';

const cate = [
  {
    id: 1,
    name: 'Birth Details',
  },
  {
    id: 2,
    name: 'Horoscope Chart',
  },
  {
    id: 3,
    name: 'Planetary Details',
  },
  {
    id: 4,
    name: 'Favorable for You',
  },
  {
    id: 5,
    name: 'KP',
  },
  {
    id: 6,
    name: 'Kundli Dosh',
  },
  {
    id: 7,
    name: 'Vimshottari Dasha',
  }, {
    id: 8,
    name: 'Remedies',
  }
] 

const KundliCategory = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(1)
  const kundli_id = route?.params?.kundli_id
  const user_id = route?.params?.user_id

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <MyStatusBar 
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <>
              {categoryInfo()}
              {selectedItem == 1 && <BirthDetails user_id={user_id} id={kundli_id}  />}
              {selectedItem == 2 && <HoroscopeChart id={kundli_id} />}
              {selectedItem == 3 && <PlanetaryDetails id={kundli_id} />}
              {selectedItem == 4 && <Favourable id={kundli_id} />}
              {selectedItem == 5 && <KPChart id={kundli_id} />}
              {selectedItem == 6 && <KundliDosh id={kundli_id} />}
              {selectedItem == 7 && <VimshottariDasha id={kundli_id} />}
              {selectedItem == 8 && <KundliRemedies id={kundli_id} />}
            </>
          }
        />
      </View>
    </View>
  )

  function categoryInfo() {
    const on_press = id => {
      setSelectedItem(id)
    };

    const renderItem = ({ item, index }) => {
      return (
        <View key={index} style={{ flexDirection: 'row', marginBottom: Sizes.fixPadding, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => on_press(item.id)} style={{ alignItems: 'center', justifyContent: 'center' }}>

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
                    ? { ...Fonts.white14RobotoRegular, textAlign: 'center' }
                    : { ...Fonts.black14RobotoRegular, textAlign: 'center' }
                }>
                {item.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={{ marginVertical: Sizes.fixPadding * 1.5, paddingVertical: Sizes.fixPadding }}>
        <FlatList
          data={cate}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          key={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )
  }

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: 'absolute', zIndex: 99, padding: Sizes.fixPadding * 1.5 }}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            textAlign: 'center',
            flex: 1,
          }}>
          Kundli
        </Text>
      </View>
    );
  }
}

export default KundliCategory

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

