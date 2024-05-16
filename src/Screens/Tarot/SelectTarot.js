import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import {BottomSheet, Divider} from '@rneui/themed';

const tarotCard = [
  {
    id: 1,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/1.png'),
  },
  {
    id: 2,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/2.png'),
  },
  {
    id: 3,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/3.png'),
  },
  {
    id: 4,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/4.png'),
  },
  {
    id: 5,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/5.png'),
  },
  {
    id: 6,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/6.png'),
  },
  {
    id: 7,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/7.png'),
  },
  {
    id: 8,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/8.png'),
  },
  {
    id: 9,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/9.png'),
  },
  {
    id: 10,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/10.png'),
  },
  {
    id: 11,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/11.png'),
  },
  {
    id: 12,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/12.png'),
  },
  {
    id: 13,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/13.png'),
  },
  {
    id: 14,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/14.png'),
  },
  {
    id: 15,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/15.png'),
  },
  {
    id: 16,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/16.png'),
  },
  {
    id: 17,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/17.png'),
  },
  {
    id: 18,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/18.png'),
  },
  {
    id: 19,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/19.png'),
  },
  {
    id: 20,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/20.png'),
  },
  {
    id: 21,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/21.png'),
  },
  {
    id: 22,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/22.png'),
  },
  {
    id: 23,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/23.png'),
  },
  {
    id: 24,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/24.png'),
  },
  {
    id: 25,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/25.png'),
  },
  {
    id: 26,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/26.png'),
  },
  {
    id: 27,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/27.png'),
  },
  {
    id: 28,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/28.png'),
  },
  {
    id: 29,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/29.png'),
  },
  {
    id: 30,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/30.png'),
  },
  {
    id: 31,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/31.png'),
  },
  {
    id: 32,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/32.png'),
  },
  {
    id: 33,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/33.png'),
  },
  {
    id: 34,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/34.png'),
  },
  {
    id: 35,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/35.png'),
  },
  {
    id: 36,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/36.png'),
  },
  {
    id: 37,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/37.png'),
  },
  {
    id: 38,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/38.png'),
  },
  {
    id: 39,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/39.png'),
  },
  {
    id: 40,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/40.png'),
  },
  {
    id: 41,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/41.png'),
  },
  {
    id: 42,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/42.png'),
  },
  {
    id: 43,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/43.png'),
  },
  {
    id: 44,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/44.png'),
  },
  {
    id: 45,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/45.png'),
  },
  {
    id: 46,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/46.png'),
  },
  {
    id: 47,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/47.png'),
  },
  {
    id: 48,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/48.png'),
  },
  {
    id: 49,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/49.png'),
  },
  {
    id: 50,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/50.png'),
  },
  {
    id: 51,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/51.png'),
  },
  {
    id: 52,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/52.png'),
  },
  {
    id: 53,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/53.png'),
  },
  {
    id: 54,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/54.png'),
  },
  {
    id: 55,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/55.png'),
  },
  {
    id: 56,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/56.png'),
  },
  {
    id: 57,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/57.png'),
  },
  {
    id: 58,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/58.png'),
  },
  {
    id: 59,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/59.png'),
  },
  {
    id: 60,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/60.png'),
  },
  {
    id: 61,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/61.png'),
  },
  {
    id: 62,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/62.png'),
  },
  {
    id: 63,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/63.png'),
  },
  {
    id: 64,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/64.png'),
  },
  {
    id: 65,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/65.png'),
  },
  {
    id: 66,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/66.png'),
  },
  {
    id: 67,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/67.png'),
  },
  {
    id: 68,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/68.png'),
  },
  {
    id: 69,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/69.png'),
  },
  {
    id: 70,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/70.png'),
  },
  {
    id: 71,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/71.png'),
  },
  {
    id: 72,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/72.png'),
  },
  {
    id: 73,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/73.png'),
  },
  {
    id: 74,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/74.png'),
  },
  {
    id: 75,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/75.png'),
  },
  {
    id: 76,
    image: require('../../assets/images/tarot/tarot_d.png'),
    value: require('../../assets/images/tarot/76.png'),
  },
  {
    id: 77,
    image: require('../../assets/images/tarot/tarot_e.png'),
    value: require('../../assets/images/tarot/77.png'),
  },
  {
    id: 78,
    image: require('../../assets/images/tarot/tarot_f.png'),
    value: require('../../assets/images/tarot/78.png'),
  },
  {
    id: 79,
    image: require('../../assets/images/tarot/tarot_a.png'),
    value: require('../../assets/images/tarot/2.png'),
  },
  {
    id: 80,
    image: require('../../assets/images/tarot/tarot_b.png'),
    value: require('../../assets/images/tarot/3.png'),
  },
  {
    id: 81,
    image: require('../../assets/images/tarot/tarot_c.png'),
    value: require('../../assets/images/tarot/4.png'),
  },
];

const SelectTarot = ({navigation, route}) => {
  const [state, setState] = useState({
    count: route?.params?.type,
    tarotData: tarotCard,
    selectedItem: [],
    bottomSheetVisible: false,
  });

  useEffect(() => {
    suffle_card();
  }, []);

  const suffle_card = () => {
    let array = tarotData;
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));

      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
    updateState({tarotData: array});
  };

  const select_card = item => {
    if (selectedItem.length == count) {
      if (selectedItem.filter(i => i.id == item.id).length == 0) {
        const newData = selectedItem;
        newData[count - 1] = item;
        updateState({selectedItem: newData});
      } else {
        const newData = selectedItem.filter(i => i.id != item.id);
        updateState({selectedItem: newData});
      }
    } else {
      if (selectedItem.filter(i => i.id == item.id).length == 0) {
        const newData = [...selectedItem, item];
        updateState({selectedItem: newData});
      } else {
        const newData = selectedItem.filter(i => i.id != item.id);
        updateState({selectedItem: newData});
      }
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {count, tarotData, selectedItem, bottomSheetVisible} = state;
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      {header()}
      <View style={{flex: 1}}>
        <FlatList ListHeaderComponent={<>{tarotCardInfo()}</>} />
      </View>
      {bottomSheetInfo()}
      {suffleViewInfo()}
    </View>
  );

  function bottomSheetInfo() {
    return (
      <BottomSheet
        isVisible={bottomSheetVisible}
        onBackdropPress={() => updateState({bottomSheetVisible: false})}
        backdropStyle={{backgroundColor: Colors.black + '60'}}>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => updateState({bottomSheetVisible: false})}
            style={{
              width: 35,
              height: 35,
              borderRadius: 100,
              ...styles.center,
              alignSelf: 'center',
              backgroundColor: Colors.black + '90',
              marginBottom: Sizes.fixPadding,
            }}>
            <AntDesign name="close" color={Colors.gray} size={26} />
          </TouchableOpacity>
          <View
            style={{
              padding: Sizes.fixPadding * 2,
              backgroundColor: Colors.grayLight,
              borderTopRightRadius: Sizes.fixPadding * 2,
              borderTopLeftRadius: Sizes.fixPadding * 2,
            }}>
            <View style={[styles.row, {justifyContent: 'space-evenly'}]}>
              {selectedItem.map((item, index) => (
                <View
                  style={{
                    width: SCREEN_WIDTH * 0.28,
                  }}>
                  <Text
                    style={{
                      ...Fonts.black16RobotoMedium,
                      marginBottom: Sizes.fixPadding,
                      textAlign: 'center',
                    }}>
                    The Fool
                  </Text>
                  <View
                    style={{
                      backgroundColor: Colors.white,
                      padding: Sizes.fixPadding,
                    }}>
                    <Image
                      source={item.value}
                      style={{
                        width: '100%',
                        height: SCREEN_WIDTH * 0.5,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
            <Divider
              orientation="horizontal"
              width={2}
              style={{marginVertical: Sizes.fixPadding * 2}}
            />
            <View style={[styles.row, {justifyContent: 'space-around'}]}>
              <TouchableOpacity
                activeOpacity={0.8}
                // onPress={() => suffle_card()}
                style={{
                  width: '40%',
                  paddingVertical: Sizes.fixPadding,
                  backgroundColor: Colors.primaryLight,
                  borderRadius: 1000,
                }}>
                <Text
                  style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
                  Send
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={selectedItem.length != count}
                onPress={() => navigation.goBack()}
                style={{
                  width: '40%',
                  paddingVertical: Sizes.fixPadding,
                  borderWidth: 1.5,
                  borderColor: Colors.primaryDark,
                  borderRadius: 1000,
                }}>
                <Text
                  style={{
                    ...Fonts.primaryDark16RobotoMedium,
                    textAlign: 'center',
                  }}>
                  Back to Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>
    );
  }

  function suffleViewInfo() {
    return (
      <View
        style={[
          styles.row,
          {justifyContent: 'space-around', margin: Sizes.fixPadding * 2},
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => suffle_card()}
          disabled={selectedItem.length != 0}
          style={{
            width: '40%',
            paddingVertical: Sizes.fixPadding,
            backgroundColor:
              selectedItem.length != 0 ? Colors.gray : Colors.primaryDark,
            borderRadius: 1000,
          }}>
          <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
            Shuffle Cards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={selectedItem.length != count}
          onPress={() => updateState({bottomSheetVisible: true})}
          style={{
            width: '40%',
            paddingVertical: Sizes.fixPadding,
            backgroundColor:
              selectedItem.length != count ? Colors.gray : Colors.primaryDark,
            borderRadius: 1000,
          }}>
          <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
            View Card
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function tarotCardInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.08,
            height: SCREEN_HEIGHT * 0.07,
            marginBottom: Sizes.fixPadding,
          }}>
          {index > 80 ? (
            index < 88 &&
            index > 82 && (
              <TouchableOpacity
                onPress={() => select_card(item)}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: Sizes.fixPadding * 0.5,
                  overflow: 'hidden',
                }}>
                {selectedItem.filter(i => i.id == item.id).length != 0 ? (
                  <View
                    style={[
                      styles.center,
                      {
                        backgroundColor: Colors.primaryLight,
                        width: '100%',
                        height: '100%',
                      },
                    ]}>
                    <Text style={{...Fonts.black14RobotoRegular}}>
                      {selectedItem.findIndex(i => i.id == item.id) + 1}
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={item.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </TouchableOpacity>
            )
          ) : index > 71 ? (
            index < 80 &&
            index > 72 && (
              <TouchableOpacity
                onPress={() => select_card(item)}
                style={{
                  width: SCREEN_WIDTH * 0.08,
                  height: SCREEN_HEIGHT * 0.07,
                  marginBottom: Sizes.fixPadding,
                  borderRadius: Sizes.fixPadding * 0.5,
                  overflow: 'hidden',
                }}>
                {selectedItem.filter(i => i.id == item.id).length != 0 ? (
                  <View
                    style={[
                      styles.center,
                      {
                        backgroundColor: Colors.primaryLight,
                        width: '100%',
                        height: '100%',
                      },
                    ]}>
                    <Text style={{...Fonts.black14RobotoRegular}}>
                      {selectedItem.findIndex(i => i.id == item.id) + 1}
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={item.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity
              onPress={() => select_card(item)}
              style={{
                width: SCREEN_WIDTH * 0.08,
                height: SCREEN_HEIGHT * 0.07,
                marginBottom: Sizes.fixPadding,
                borderRadius: Sizes.fixPadding * 0.5,
                overflow: 'hidden',
              }}>
              {selectedItem.filter(i => i.id == item.id).length != 0 ? (
                <View
                  style={[
                    styles.center,
                    {
                      backgroundColor: Colors.primaryLight,
                      width: '100%',
                      height: '100%',
                    },
                  ]}>
                  <Text style={{...Fonts.black14RobotoRegular}}>
                    {selectedItem.findIndex(i => i.id == item.id) + 1}
                  </Text>
                </View>
              ) : (
                <Image
                  source={item.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      );
    };
    return (
      <View style={{margin: Sizes.fixPadding}}>
        <FlatList
          data={tarotData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={9}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
        />
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
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', padding: Sizes.fixPadding * 1.5}}>
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
          Select One Tarot Card
        </Text>
      </View>
    );
  }
};

export default SelectTarot;

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
});
