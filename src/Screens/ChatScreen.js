import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
} from 'react-native';
import React, {useEffect, useMemo, useState, useRef, useCallback} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import MyStatusBar from '../component/MyStatusBar';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {
  api_url,
  remedy_list,
} from '../config/Constants';
import TarotModal from '../component/Chat/TarotModal';
import CustomerModal from '../component/Chat/CustomerModal';
import Time from '../component/Chat/Time'; 
import Loader from '../component/Loader';
import HistoryModal from '../component/Chat/HistoryModal';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../config/Screen';
import {ApiRequests} from '../config/requests';
import * as ChatActions from '../redux/actions/ChatActions';
import ExitAlert from '../component/Chat/ExitAlert';
import CustomGiftedChat from '../component/Chat/CustomGiftedChat';
import MenuItems from '../component/Chat/MenuItems';

const ChatScreen = ({navigation, dispatch, chatRequestData, isChatStart}) => {
  const [userData] = useState(chatRequestData);
  const [state, setState] = useState({
    userDetailes: null,
    customerModalVisible: false,
    isLoading: false,
    voiceUploading: false,
    imageUploading: false,
    startTime: '',
    inVoiceId: null,
    fileType: null,
    image: null,
    pdf: null,
    voice: null,
  });

  useEffect(() => {
    dispatch(ChatActions.getChatData({dispatch}));
  }, [isChatStart]); 

  useFocusEffect(
    React.useCallback(() => {
      dispatch(ChatActions.getChatData({dispatch}));
      const onBackPress = () => {
        go_home();
        dispatch(ChatActions.onResetChat());
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        subscription.remove();
      };
    }, [navigation]),
  );

  const end_chat = async () => {
    await AsyncStorage.setItem('request', '0');
    dispatch(ChatActions.setExitVisible(true));
    // updateState({exitVisible: true});
    // Alert.alert('Alert!', 'Are you sure to end your chat?', [
    //   {
    //     text: 'No',
    //     style: 'cancel',
    //   },
    //   {
    //     text: 'Yes',
    //     style: 'destructive',
    //     onPress: () => deduct_wallet(),
    //   },
    // ]);
  };

  const get_remedy = async data => {
    try {
      let response;
      if (data?.type == 'remedy') {
        response = await ApiRequests.postRequest({
          url: api_url + remedy_list,
          data: {
            remedy_id: data?.remedy,
          },
        });
      }

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const go_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home'}],
      }),
    );
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {userDetailes, customerModalVisible, isLoading} = state;
  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />

      <Loader visible={isLoading} />
      <ImageBackground
        source={require('../assets/images/ChatBackground.png')}
        style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>
        {header()}
        <Time userData={userData} updateState={updateState} />
        <CustomGiftedChat />
        <MenuItems />
      </ImageBackground>
      <TarotModal updateState={updateState} navigation={navigation} />
      <CustomerModal
        updateState={updateState}
        customerModalVisible={customerModalVisible}
        userDetailes={userDetailes}
      />
      <HistoryModal />
      <ExitAlert />
    </View>
  );

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            go_home();
            // Alert.alert('Alert!', 'Are you sure to leave your chat?', [
            //   {
            //     text: 'No',
            //     style: 'cancel',
            //   },
            //   {
            //     text: 'Yes',
            //     style: 'destructive',
            //     onPress: () => go_home(), //deduct_wallet(),
            //   },
            // ]);
          }}
          style={{
            alignSelf: 'flex-start',
            flex: 0.1,
          }}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryDark}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.white16RobotoMedium,
            textAlign: 'center',
            color: Colors.primaryDark,
            flex: 0.6,
          }}>
          {userData?.username}
        </Text>
        <TouchableOpacity
          onPress={() => end_chat()}
          style={{
            width: '20%',
            backgroundColor: Colors.red2,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 6,
          }}>
          <Text style={{...Fonts.white12RobotoRegular}}>End Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
  requestData: state.provider.requestData,
  chatRequestData: state.chat.chatRequestData,
  isChatStart: state.chat.isChatStart,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

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
  container: {
    flex: 1,
    backgroundColor: Colors.grayLight,
    borderTopLeftRadius: Sizes.fixPadding * 4,
    elevation: 8,
  },
});
