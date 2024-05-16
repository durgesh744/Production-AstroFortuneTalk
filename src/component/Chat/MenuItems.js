import {
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import {Colors, Sizes} from '../../assets/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {MyMethods} from '../../methods/MyMethods';
import {connect} from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database'

const MenuItems = ({
  providerData,
  dispatch,
  watingModalVisible,
  chatRequestData,
}) => {

  const navigation = useNavigation()
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        openCamera();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err, 'requestCameraPermission');
    }
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
    }; // Add any camera options you need
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image library');
      } else if (response.errorCode) {
        console.log(response.errorCode, response.errorMessage, 'asdfghjk');
      } else {
        const sendMessage = {
          _id: MyMethods.generateUniqueId(),
          text: '',
          user: {
            _id: `astro$${providerData?.id}`,
            name: providerData?.owner_name,
            // avatar: base_url + userData?.image,
          },
          image: response.assets[0].uri,
          type: 'image',
          // Mark the message as sent, using one tick
          sent: false,
          // Mark the message as received, using two tick
          received: false,
          // Mark the message as pending with a clock loader
          pending: true,
          senderId: `astro$${providerData?.id}`,
          receiverId: `customer$${chatRequestData?.user_id}`,
        };

        const data = [
          {
            name: 'image_file',
            filename: `${response.assets[0].fileName}`,
            type: 'jpg/png',
            data: RNFetchBlob.wrap(response.assets[0].uri),
          },
        ];

        dispatch(ChatActions.addMessage(sendMessage))
        dispatch(ChatActions.sendImage({imageUri: response.assets[0].uri, fileName: response.assets[0].uri,  message: sendMessage}));
      }
    });
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
    }; // Add any camera options you need
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled the camera');
      } else if (response.errorCode) {
        console.log('Error code:', response.errorCode);
        console.log('Error message:', response.errorMessage);
      } else {
        const sendMessage = {
          _id: MyMethods.generateUniqueId(),
          text: '',
          user: {
            _id: `astro$${providerData?.id}`,
            name: providerData?.owner_name,
            // avatar: base_url + userData?.image,
          },
          image: response.assets[0].uri,
          type: 'image',
          // Mark the message as sent, using one tick
          sent: false,
          // Mark the message as received, using two tick
          received: false,
          // Mark the message as pending with a clock loader
          pending: true,
          senderId: `astro$${providerData?.id}`,
          receiverId: `customer$${chatRequestData?.user_id}`,
        };

        const data = [
          {
            name: 'image_file',
            filename: `astrologer.jpg`,
            type: 'jpg/png',
            data: RNFetchBlob.wrap(response.assets[0].uri),
          },
        ];

        dispatch(ChatActions.addMessage(sendMessage))
        dispatch(ChatActions.sendImage({imageUri: response.assets[0].uri, fileName: response.assets[0].uri,  message: sendMessage}));
      }
    });
  };

  const open_kundli = async()=>{
    try{
      const kundli_id = (await database().ref(`CustomerCurrentRequest/${chatRequestData?.user_id}/kundli_id`).once('value')).val()
      navigation.navigate('kundliInfo', {kundli_id, user_id: chatRequestData?.user_id })
    }catch(e){
      console.log(e)
    }
  }

  return (
    <View
      style={{
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Sizes.fixPadding,
        backgroundColor: '#F5F5F5',
      }}>
      <TouchableOpacity onPress={() => requestCameraPermission()}>
        <FontAwesome5 name="camera" color={Colors.grayDark} size={22} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => openImageLibrary()}
        style={{height: 24, width: 24}}>
        <Image
          source={require('../../assets/images/Gallery.png')}
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => open_kundli()}
        style={{height: 24, width: 24}}>
        <Image
          source={require('../../assets/icon/kundli_icon.png')}
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{height: 24, width: 24}}
        onPress={() =>
          navigation.navigate('Remedy', {
            customer_id: chatRequestData?.user_id,
          })
        }>
        <Image
          source={require('../../assets/images/phytotherapy.png')}
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('numerology')}
        style={{height: 24, width: 24}}>
        <Image
          source={require('../../assets/images/numerology.png')}
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => dispatch(ChatActions.setTaroatModalVisible(true))}
        style={{height: 24, width: 24}}>
        <Image
          source={require('../../assets/images/tarot-card.png')}
          style={{
            width: '100%', 
            height: '100%',
            // tintColor: taroatModalVisible ? Colors.primaryDark : null,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => dispatch(ChatActions.setCustomerModalVisible(true))}
        style={{height: 24, width: 24}}>
        <Image
          source={require('../../assets/images/usericon.png')}
          style={{
            width: '100%',
            height: '100%',
            // tintColor: customerModalVisible ? Colors.primaryDark : null,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => dispatch(ChatActions.setWaitingModalVisible(true))}
        style={{height: 24, width: 24}}>
        <Image
          source={require('../../assets/images/restore.png')}
          style={{
            width: '100%',
            height: '100%',
            tintColor: watingModalVisible ? Colors.primaryDark : null, 
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} style={{height: 24, width: 24}}>
        <Image
          source={require('../../assets/images/language.png')}
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  watingModalVisible: state.chat.watingModalVisible,
  chatRequestData: state.chat.chatRequestData,
});
 
const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(MenuItems);

