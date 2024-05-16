import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    Modal,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import {Colors, Fonts, Sizes} from '../../assets/style';
  import MyStatusBar from '../../component/MyStatusBar';
  import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
  import {BottomSheet, Divider} from '@rneui/themed';
  import {tarotCard} from '../../config/TarotCards';
  import {MyMethods} from '../../methods/MyMethods';
  import {GiftedChat} from 'react-native-gifted-chat';
  import {connect} from 'react-redux';
  import * as ChatActions from '../../redux/actions/ChatActions';

const SelectTaroat = ({navigation, providerData, dispatch, route }) => {
  // console.log(taroatCount)
  const taroatCount = route?.params?.count
  const [tarotState, setTarotState] = useState({
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
    updateTarotState({tarotData: array});
  };

  const select_card = item => {
    if (selectedItem.length == taroatCount) {
      if (selectedItem.filter(i => i.id == item.id).length == 0) {
        const newData = selectedItem;
        newData[taroatCount - 1] = item;
        updateTarotState({selectedItem: newData});
      } else {
        const newData = selectedItem.filter(i => i.id != item.id);
        updateTarotState({selectedItem: newData});
      }
    } else {
      if (selectedItem.filter(i => i.id == item.id).length == 0) {
        const newData = [...selectedItem, item];
        updateTarotState({selectedItem: newData});
      } else {
        const newData = selectedItem.filter(i => i.id != item.id);
        updateTarotState({selectedItem: newData});
      }
    }
  };

  const on_send = () => {
    const sendMessage = {
      _id: MyMethods.generateUniqueId(),
      text: '',
      user: {
        _id: `astro${providerData?.id}`,
        name: providerData?.owner_name,
        // avatar: base_url + userData?.image,
      },
      tarot: JSON.stringify(selectedItem),
      type: 'tarot',
      // Mark the message as sent, using one tick
      sent: false,
      // Mark the message as received, using two tick
      received: false,
      // Mark the message as pending with a clock loader
      pending: true,
      senderId: `astro${providerData?.id}`,
      receiverId: 'customer',
    };
    dispatch(ChatActions.addMessage(sendMessage))
    dispatch(ChatActions.sendMessages(sendMessage))
    updateTarotState({selectedItem: []});
    navigation.goBack()
    // dispatch(ChatActions.setTaroatSelectionModalVisible(false));
    // dispatch(ChatActions.setTaroatModalVisible(false));
    // updateState({
    //   tarotSelectionModalVisible: false,
    //   taroatModalVisible: false,
    // });
  };

  const updateTarotState = data => {
    setTarotState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const on_close = () => {
    updateTarotState({selectedItem: []});
    navigation.goBack()
    // dispatch(ChatActions.setTaroatSelectionModalVisible(false));
    // dispatch(ChatActions.setTaroatModalVisible(false));
    // updateState({
    //   tarotSelectionModalVisible: false,
    //   taroatModalVisible: false,
    // });
  }; 
  const {tarotData, selectedItem, bottomSheetVisible} = tarotState;
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
        onBackdropPress={() => updateTarotState({bottomSheetVisible: false})}
        backdropStyle={{backgroundColor: Colors.black + '60'}}>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => updateTarotState({bottomSheetVisible: false})}
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
                    {item.name}
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
                onPress={() => on_send()}
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
                disabled={selectedItem.length != taroatCount}
                onPress={() => {
                  updateTarotState({selectedItem: []});
                  navigation.goBack()
                }}
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
          disabled={selectedItem.length != taroatCount}
          onPress={() => updateTarotState({bottomSheetVisible: true})}
          style={{
            width: '40%',
            paddingVertical: Sizes.fixPadding,
            backgroundColor:
              selectedItem.length != taroatCount
                ? Colors.gray
                : Colors.primaryDark,
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
          {index != 54 &&
            index != 62 &&
            index != 63 &&
            index != 71 &&
            index != 72 &&
            index != 73 &&
            index != 79 &&
            index != 80 &&
            index != 81 &&
            index != 82 &&
            index != 88 &&
            index != 89 && (
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
          onPress={() => {
            on_close();
          }}
          hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
          // style={{position: 'absolute', padding: Sizes.fixPadding * 1.5}}
        >
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
          {`Select ${
            taroatCount == 1 ? 'One' : taroatCount == 2 ? 'Two' : 'Three'
          } Tarot Card`}
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  tarotType: state.chat.tarotType,
  taroatCount: state.chat.taroatCount,
  providerData: state.provider.providerData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(SelectTaroat);

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
