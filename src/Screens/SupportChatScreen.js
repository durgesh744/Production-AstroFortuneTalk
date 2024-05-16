import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  ImageBackground,
  BackHandler,
} from 'react-native';
import React, {useEffect, useMemo, useState, useRef, useCallback} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../component/MyStatusBar';
import {connect} from 'react-redux';
import database from '@react-native-firebase/database';
import moment, {duration} from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import ChatDetailes from '../component/SupportChat/ChatDetailes';
import InputMesaage from '../component/SupportChat/InputMesaage';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../component/Loader';
import HistoryModal from '../component/Chat/HistoryModal';
import ImageView from '../component/ImageView';
import {actions} from '../config/data';
import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const SupportChatScreen = ({
  navigation,
  providerData,
  firebaseId,
  route,
  props,
}) => {
  console.log('firebase', firebaseId);
  const [userData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const memorizedChat = useMemo(() => chatData, [chatData]);
  let listRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [state, setState] = useState({
    userDetailes: null,
    taroatModalVisible: false,
    customerModalVisible: false,
    watingModalVisible: false,
    kundliModalVisible: false,
    basicKundliData: null,
    kundliDoshaData: null,
    panchangData: null,
    chartData: null,
    recentChatData: null,
    isLoading: false,
    tarotSelectionModalVisible: false,
    tarotType: 1,
    numerologyModalVisible: false,
    numerologyData: null,
    voiceUploading: false,
    imageUploading: false,
    imageVisible: false,
    imageViewData: null,
    startTime: '',
    inVoiceId: null,
    firebaseId: firebaseId,
  });

  useEffect(() => {
    get_firebase_id();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Confirm', 'Are you sure you want to go back?', [
          {text: "Don't leave", style: 'cancel', onPress: () => {}},
          {
            text: 'Yes, leave',
            style: 'destructive',
            onPress: () => go_home(), //deduct_wallet(),
          },
        ]);
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  const get_firebase_id = async () => {
    try {
      const data = await AsyncStorage.getItem('FirebaseId');
      console.log('ddd', data);
      updateState({firebaseId: data});
      get_chats(data);
    } catch (e) {
      console.log('ddd', e);
    }
  };

  const is_typing = focus => {
    database()
      .ref(`/UserId/${route.params.customerData.user_id}`)
      .on('value', snapshot => {
        database().ref(`/Chat/${firebaseId}/${snapshot.val()}`).update({
          typing: focus,
        });
        database().ref(`/Chat/${snapshot.val()}/${firebaseId}`).update({
          typing: focus,
        });
      });
  };

  const get_chats = firebaseId => {
    database()
      .ref(`MMy42mbMO1SF619sfSynBtY44TB2`)
      .on('value', snapshot => {
        const myDataObject = snapshot.val();

        database()
          .ref(
            `/SupportMessages/${firebaseId}/${`MMy42mbMO1SF619sfSynBtY44TB2`}`,
          )
          .on('value', value => {
            const myDataObject = value.val();

            const myDataArray = Object.keys(myDataObject)
              .sort()
              .map(key => myDataObject[key]);

            setChatData(myDataArray.reverse());
          });
      });
  };

  const get_profile_pick = useCallback((type, options) => {
    console.log('-----', type);
    if (type == 'capture') {
      ImagePicker.launchCamera(options, res => {
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          setChatData(prev => [
            {
              from: firebaseId,
              image: res.assets[0].uri,
              message: '',
              timestamp: new Date().getTime(),
              to: 'dsfnsdhfjhsdjfh',
              type: 'image',
              uploading: true,
            },
            ...prev,
          ]);
          handleImageUpload(res.assets[0].uri, res.assets[0].fileName);
        }
      });
    } else {
      console.log('ddsasds');
      ImagePicker.launchImageLibrary({...options, includeBase64: true}, res => {
        console.log('resss===', res);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          const selectedImage = res.assets[0];

          setChatData(prev => [
            {
              from: firebaseId,
              message: selectedImage.uri,
              timestamp: new Date().getTime(),
              to: 'dsfnsdhfjhsdjfh',
              type: 'image',
              uploading: true,
            },
            ...prev,
          ]);
          handleImageUpload(selectedImage.uri, selectedImage.fileName);
        }
      });
    }
  }, []);

  const uploadImageWithProgress = async (imageUri, filename, onProgress) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const ref = storage().ref().child(`images/${filename}`);

    const metadata = {
      contentType: 'image/jpeg',
    };

    const task = ref.put(blob);
    task.on('state_changed', snapshot => {
      const progress = snapshot.bytesTransferred / snapshot.totalBytes;
      onProgress(progress);
    });

    await task;
    const downloadURL = await ref.getDownloadURL();
    add_message({image: downloadURL, type: 'image', message: null});

    return downloadURL;
  };

  const handleImageUpload = async (imageUri, filename) => {
    try {
      setUploading(true);

      await uploadImageWithProgress(imageUri, filename, progress => {
        console.log('tttttssss===', imageUri, filename);
        setUploadProgress(progress);
      });

      setUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const add_message = async ({image = null, type = 'text', message = ''}) => {
    console.log(firebaseId, 'ddsfasdfasf');
    setChatData(prev => [
      ...prev,
      {
        from: firebaseId,
        message: image != null ? image : message,
        timestamp: new Date().getTime(),
        to: 'dsfnsdhfjhsdjfh',
        type: type,
      },
    ]);
    const admin = 'MMy42mbMO1SF619sfSynBtY44TB2';
    const send_msg = {
      image: image,
      message: message,
      timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
      to: admin,
      type: type,
    };
    const node = database().ref(`MMy42mbMO1SF619sfSynBtY44TB2`).push();
    const key = node.key;
    database()
      .ref(`/SupportMessages/${firebaseId}/${admin}/${key}`)
      .set({
        from: firebaseId,
        message: image != null ? image : message,
        timestamp: new Date().getTime(),
        to: admin,
        type: type,
      });
    database()
      .ref(`/SupportMessages/${admin}/${firebaseId}/${key}`)
      .set({
        from: admin,
        message: image != null ? image : message,
        timestamp: new Date().getTime(),
        to: admin,
        type: type,
      });
    database().ref(`/SupportChat/${firebaseId}/${admin}`).update(send_msg);
    database().ref(`/SupportChat/${admin}/${firebaseId}`).update(send_msg);

    console.log('ddd====', send_msg);
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

  const {
    watingModalVisible,
    recentChatData,
    isLoading,
    imageViewData,
    imageVisible,
  } = state;
  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />

      <Loader visible={isLoading} />
      {header()}
      <KeyboardAvoidingView keyboardVerticalOffset={64} style={{flex: 1}}>
        <ImageBackground
          source={require('../assets/images/ChatBackground.png')}
          style={{width: '100%', height: '100%'}}>
          <ChatDetailes
            memorizedChat={memorizedChat}
            uploadProgress={uploadProgress}
            customerData={userData}
            firebaseId={firebaseId}
            updateState={updateState}
          />
          <InputMesaage
            setUploadProgress={setUploadProgress}
            add_message={add_message}
            get_profile_pick={get_profile_pick}
            setChatData={setChatData}
            firebaseId={firebaseId}
            updateState={updateState}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
      <ImageView
        updateState={updateState}
        image={imageViewData}
        imageVisible={imageVisible}
      />

      <HistoryModal
        updateState={updateState}
        watingModalVisible={watingModalVisible}
        recentChatData={recentChatData}
      />
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
            Alert.alert('Alert!', 'Are you sure to leave your chat?', [
              {
                text: 'No',
                style: 'cancel',
              },
              {
                text: 'Yes',
                style: 'destructive',
                onPress: () => go_home(),
              },
            ]);
          }}
          style={{
            alignSelf: 'flex-start',
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
            flex: 1.5,
          }}>
          Support Chat
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  requestData: state.provider.requestData,
  firebaseId: state.provider.firebaseId,
});

export default connect(mapStateToProps, null)(SupportChatScreen);

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
  linearGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 0.8, // You can adjust the opacity as needed
  },
});
