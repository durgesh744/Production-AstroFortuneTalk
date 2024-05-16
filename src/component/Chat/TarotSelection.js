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

const TarotSelection = ({
  tarotSelectionModalVisible,
  updateState,
  taroatCount,
  add_message,
  addMessage,
  astroFirebaseID,
  customerFirebaseID,
  providerData,
  setChatData,
  dispatch,
}) => {
  console.log(tarotSelectionModalVisible)
  const [tarotState, setTarotState] = useState({
    tarotData: tarotCard,
    selectedItem: [],
    bottomSheetVisible: false,
  });

  useEffect(() => {
    suffle_card();
  }, []);

  useEffect(() => {}, [tarotSelectionModalVisible]);

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
        _id: astroFirebaseID,
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
      senderId: astroFirebaseID,
      receiverId: customerFirebaseID,
    };

    setChatData(previousMessages =>
      GiftedChat.append(previousMessages, sendMessage),
    );
    addMessage(sendMessage);
    console.log('hii');
    updateTarotState({selectedItem: []});
    dispatch(ChatActions.setTaroatSelectionModalVisible(false));
    dispatch(ChatActions.setTaroatModalVisible(false));
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
    dispatch(ChatActions.setTaroatSelectionModalVisible(false));
    dispatch(ChatActions.setTaroatModalVisible(false));
    // updateState({
    //   tarotSelectionModalVisible: false,
    //   taroatModalVisible: false,
    // });
  };

  const {tarotData, selectedItem, bottomSheetVisible} = tarotState;
  return (
    <Modal
      visible={tarotSelectionModalVisible}
      animationType="slide"
      onRequestClose={() => {
        on_close();
      }}>

    </Modal>
  );


};

const mapStateToProps = state => ({
  tarotType: state.chat.tarotType,
  taroatCount: state.chat.taroatCount,
  tarotSelectionModalVisible: state.chat.tarotSelectionModalVisible,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(TarotSelection);

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
