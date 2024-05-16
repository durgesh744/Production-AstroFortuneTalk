import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {SCREEN_WIDTH} from '../../config/Screen';
import {Colors, Sizes, Fonts} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../MyStatusBar';

const numerology_data = [
  {
    id: 1,
    title: 'Favourite Day',
    icon: require('../../assets/images/numerology/numo_calendar.png'),
    data: 'Sunday, Monday',
  },
  {
    id: 2,
    title: 'Favourite Colour',
    icon: require('../../assets/images/numerology/numo_color.png'),
    data: 'Yellow',
  },
  {
    id: 3,
    title: 'Gemstone',
    icon: require('../../assets/images/numerology/numo_gemstone.png'),
    data: 'Jupitor',
  },
  {
    id: 4,
    title: 'Favourite Metal',
    icon: require('../../assets/images/numerology/numo_nuts.png'),
    data: 'Gold',
  },
  {
    id: 5,
    title: 'Friendly Number',
    icon: require('../../assets/images/numerology/numo_users.png'),
    data: '7, 5, 6, 9',
  },
  {
    id: 6,
    title: 'Ruling Planet',
    icon: require('../../assets/images/numerology/numo_saturn.png'),
    data: 'Jupiter',
  },
  {
    id: 7,
    title: 'Evil Number',
    icon: require('../../assets/images/numerology/numo_eye.png'),
    data: 'Sunday, Monday',
  },
  {
    id: 8,
    title: 'Favourite God',
    icon: require('../../assets/images/numerology/numo_pray.png'),
    data: 'Surya Bhagwan',
  },
  {
    id: 9,
    title: 'Mantra',
    icon: require('../../assets/images/numerology/numo_indian.png'),
    data: 'Mantra',
  },
];

const NumerologyInfo = ({
  numerologyModalVisible,
  numerologyData,
  updateState,
}) => {
  const [data] = useState(numerology_data);
  return (
    <Modal
      isVisible={numerologyModalVisible}
      onBackButtonPress={() => updateState({numerologyModalVisible: false})}
      style={{padding: 0, margin: 0}}>
      <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
        <MyStatusBar
          backgroundColor={Colors.primaryLight}
          barStyle={'light-content'}
        />
        {header()}
        <View style={{flex: 1}}>
          <FlatList
            ListHeaderComponent={
              <>
                {numbersInfo()}
                {dividerInfo()}
                {numerologyInfo()}
              </>
            }
          />
        </View>
      </View>
    </Modal>
  );

  function numerologyInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={item.icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>{item.data}</Text>
          </View>
        </View>
      );
    };
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2}}>
        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={data[0].icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{data[0].title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>{numerologyData?.fav_day}</Text>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={data[1].icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{data[1].title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>{numerologyData?.fav_color}</Text>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={data[2].icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{data[2].title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>{numerologyData?.fav_stone}</Text>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={data[3].icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{data[3].title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>{numerologyData?.fav_metal}</Text>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={data[4].icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{data[4].title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>{numerologyData?.friendly_num}</Text>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={data[5].icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{data[5].title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>
              {numerologyData?.radical_ruler}
            </Text>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={data[6].icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{data[6].title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>{numerologyData?.evil_num}</Text>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={data[7].icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{data[7].title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>{numerologyData?.fav_god}</Text>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemFirstContainer}>
            <Image source={data[8].icon} style={styles.itemIcon} />
            <Text style={styles.itemText}>{data[8].title}</Text>
          </View>
          <View style={styles.itemSecondContainer}>
            <Text style={styles.itemChild}>{numerologyData?.fav_mantra}</Text>
          </View>
        </View>

        {/* <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        /> */}
      </View>
    );
  }

  function dividerInfo() {
    return (
      <Image
        source={require('../../assets/images/numerology/numo_shap.png')}
        style={{width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.2}}
        resizeMode="contain"
      />
    );
  }

  function numbersInfo() {
    return (
      <View style={styles.numberContainer}>
        <View style={styles.numberItemContainer}>
          <Text style={styles.numberText}>
            {numerologyData?.radical_number}
          </Text>
          <View style={styles.numberSecondTextContainer}>
            <Text style={styles.numberSecondText}>Radical Number</Text>
          </View>
        </View>
        <View style={styles.numberItemContainer}>
          <Text style={styles.numberText}>
            {numerologyData?.destiny_number}
          </Text>
          <View style={styles.numberSecondTextContainer}>
            <Text style={styles.numberSecondText}>Destiny Number</Text>
          </View>
        </View>
        <View style={styles.numberItemContainer}>
          <Text style={styles.numberText}>{numerologyData?.name_number}</Text>
          <View style={styles.numberSecondTextContainer}>
            <Text style={styles.numberSecondText}>Name Number</Text>
          </View>
        </View>
      </View>
    );
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
          onPress={() => updateState({numerologyModalVisible: false})}
          style={{padding: Sizes.fixPadding * 1.5}}>
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
          Numerology
        </Text>
      </View>
    );
  }
};

export default NumerologyInfo;

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
  numberContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Sizes.fixPadding * 2,
    marginTop: Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding,
  },
  numberItemContainer: {
    width: '30%',
    height: SCREEN_WIDTH * 0.28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryDark,
    borderRadius: Sizes.fixPadding * 1.5,
    backgroundColor: Colors.whiteDark,
  },
  numberText: {
    ...Fonts.primaryDark18RobotoMedium,
    fontSize: Sizes.fixPadding * 5,
    top: -Sizes.fixPadding,
  },
  numberSecondTextContainer: {
    width: '100%',
    position: 'absolute',
    bottom: -1,
    backgroundColor: Colors.primaryLight,
    borderRadius: Sizes.fixPadding * 1.5,
    paddingVertical: Sizes.fixPadding * 0.4,
    elevation: 10,
  },
  numberSecondText: {
    ...Fonts.white12RobotoRegular,
    textAlign: 'center',
  },
  itemContainer: {
    flex: 0,
    flexDirection: 'row',
    marginBottom: Sizes.fixPadding * 2,
    alignItems: 'center',
  },
  itemFirstContainer: {
    width: SCREEN_WIDTH * 0.28,
    height: SCREEN_WIDTH * 0.22,
    borderWidth: 2,
    borderRadius: Sizes.fixPadding * 1.5,
    borderColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    elevation: 6,
  },
  itemIcon: {
    width: '45%',
    height: '45%',
    resizeMode: 'contain',
  },
  itemText: {
    ...Fonts.primaryDark11InterMedium,
    textAlign: 'center',
    marginTop: Sizes.fixPadding,
  },
  itemSecondContainer: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderTopRightRadius: 1000,
    borderBottomRightRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    height: SCREEN_WIDTH * 0.14,
  },
  itemChild: {
    ...Fonts.white14RobotoMedium,
  },
});
