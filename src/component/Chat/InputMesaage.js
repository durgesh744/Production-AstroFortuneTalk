import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Divider, Input} from '@rneui/themed';
import {Colors, Fonts, Sizes} from '../../assets/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SCREEN_WIDTH} from '../../config/Screen';
import storage from '@react-native-firebase/storage';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import {check, RESULTS, request, PERMISSIONS} from 'react-native-permissions';
import axios from 'axios';
import {api_url, upload_voice_image_pdf} from '../../config/Constants';
import RNFetchBlob from 'rn-fetch-blob';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {MyMethods} from '../../methods/MyMethods';
import {connect} from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions';
import { TextInput } from 'react-native';
import MenuItems from './MenuItems';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.1);

const InputMesaage = ({
  voiceUploading = false,
  // onSend,
  customOnPress,
  sendButtonProps,
  sendProps, 
  providerData,
  dispatch,
  chatRequestData,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordeTime, setRecordTime] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    return () => {
      audioRecorderPlayer.removeRecordBackListener(); 
    };
  }, []);

  const reuestPermissionForRecord = async () => {
    const status = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (status === RESULTS.GRANTED) {
      startRecording();
    } else {
      const result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      if (result === RESULTS.GRANTED) {
        startRecording();
      } else {
      }
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const path = Platform.select({
        ios: undefined,
        android: undefined,
      });
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
        OutputFormatAndroid: OutputFormatAndroidType.DEFAULT,
      };
      const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
      audioRecorderPlayer.addRecordBackListener(e => {
        setRecordTime(
          audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)),
        );
      });
    } catch (e) {
      setIsRecording(false);
      console.log(e);
    }
  };

  const onStopRecording = async () => {
    try {
      if (!isRecording) return;
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime(null);
      if (recordeTime <= 1 || recordeTime == null) {
        return;
      }
      const sendMessage = {
        _id: MyMethods.generateUniqueId(),
        text: '',
        user: {
          _id: `astro${providerData?.id}`,
          name: providerData?.owner_name,
          // avatar: base_url + userData?.image,
        },
        voice: result,
        type: 'voice',
        // Mark the message as sent, using one tick
        sent: false,
        // Mark the message as received, using two tick
        received: false,
        // Mark the message as pending with a clock loader
        pending: true,
        senderId: `astro${providerData?.id}`,
        receiverId: `customer${chatRequestData?.user_id}`,
      };

      const data = [
        {
          name: 'voice_file',
          filename: `astrologer.mp3`,
          type: 'audio/mp3',
          data: RNFetchBlob.wrap(result),
        },
      ];

      dispatch(ChatActions.addMessage(sendMessage))
      dispatch(ChatActions.sendVoiceMessage({data, message: sendMessage}));
      // uploadVoiceWithProgress(result, Math.random(0, 100000).toString());
    } catch (e) {
      console.log(e);
      setIsRecording(false);
    }
  };

  const onSend = async text => {
    setMessage('');
    let sendMessage = {
      _id: MyMethods.generateUniqueId(),
      text: text,
      user: {
        _id: `astro${providerData?.id}`,
        name: providerData?.owner_name,
        // avatar: base_url + userData?.image,
      },
      senderId: `astro${providerData?.id}`,
      receiverId: `customer${chatRequestData?.user_id}`,
      sent: false,
      received: false,
      delivered: false,
    };
    console.log(sendMessage)
    dispatch(ChatActions.addMessage(sendMessage))
    dispatch(ChatActions.sendMessages(sendMessage));
    setMessage('');
  };

  return (
    <InputToolbar
    placeHolder={'Enter message...'}
    // renderAccessory={()=><TextInput placeholder='sfsfs' />}
    renderComposer={() => (
      <TextInput
        value={message}
        placeholder="Enter message..."
        placeholderTextColor={Colors.gray}
        multiline
        style={{flex: 1, ...Fonts.black14RobotoRegular,paddingVertical: 10}}
        onChangeText={setMessage}
      />
    )}
    renderActions={() => (
      <View style={[styles.row]}>
      <TouchableOpacity
        disabled={voiceUploading}
        onLongPress={reuestPermissionForRecord}
        onPressOut={onStopRecording}
        style={{transform: [{rotate: '0deg'}]}}>
        <Ionicons name="mic-sharp" color={Colors.blackLight} size={28} />
      </TouchableOpacity>
      <Divider
        orientation="vertical"
        color={Colors.gray}
        style={{
          height: '100%',
          marginHorizontal: Sizes.fixPadding * 0.5,
        }}
      />
      {isRecording && (
        <View
          style={{
            width: SCREEN_WIDTH * 0.4,
            position: 'absolute',
            height: '100%',
            left: Sizes.fixPadding * 4,
            zIndex: 99,
          }}>
          <Text style={{...Fonts.black16RobotoRegular}}>{recordeTime}</Text>
        </View>
      )}
    </View>
    )}
    renderSend={() => (
      <Send
      containerStyle={{justifyContent: 'center'}}
      {...sendProps}
      sendButtonProps={{
        ...sendButtonProps,
        onPress: () => onSend(message),
      }}
      onSend={() => console.log('sdfsfsfsg')}
      disabled={message.length == 0 || message.trim() === ''}
      // onPress={onSend}
    >
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 2,
          paddingVertical: Sizes.fixPadding * 0.7,
          borderRadius: 1000,
          backgroundColor: Colors.primaryLight,
        }}>
        <Text style={{...Fonts.white14RobotoMedium}}>Send</Text>
      </View>
    </Send>
    )}
    primaryStyle={{alignItems: 'flex-end',    backgroundColor: Colors.white,}}
  />
    // <Input
    //   value={message}
    //   placeholder={isRecording ? '' : 'Enter message...'}
    //   placeholderTextColor={Colors.gray}
    //   inputStyle={{
    //     ...Fonts.black14InterMedium,
    //     paddingVertical: Sizes.fixPadding,
    //   }}
    //   onChangeText={setMessage}
    //   inputContainerStyle={{borderBottomWidth: 0, height: 45, zIndex: -1}}
    //   containerStyle={{
    //     backgroundColor: Colors.white,
    //     marginTop: Sizes.fixPadding,
    //     height: 45,
    //     // paddingBottom: Sizes.fixPadding,
    //     bottom: 10,
    //   }}
    //   leftIcon={
    //     <View style={[styles.row]}>
    //       <TouchableOpacity
    //         disabled={voiceUploading}
    //         onLongPress={reuestPermissionForRecord}
    //         onPressOut={onStopRecording}
    //         style={{transform: [{rotate: '0deg'}]}}>
    //         <Ionicons name="mic-sharp" color={Colors.blackLight} size={28} />
    //       </TouchableOpacity>
    //       <Divider
    //         orientation="vertical"
    //         color={Colors.gray}
    //         style={{
    //           height: '100%',
    //           marginHorizontal: Sizes.fixPadding * 0.5,
    //         }}
    //       />
    //       {isRecording && (
    //         <View
    //           style={{
    //             width: SCREEN_WIDTH * 0.4,
    //             position: 'absolute',
    //             height: '100%',
    //             left: Sizes.fixPadding * 4,
    //             zIndex: 99,
    //           }}>
    //           <Text style={{...Fonts.black16RobotoRegular}}>{recordeTime}</Text>
    //         </View>
    //       )}
    //     </View>
    //   }
    //   rightIcon={
    //     <Send
    //       containerStyle={{justifyContent: 'center'}}
    //       {...sendProps}
    //       sendButtonProps={{
    //         ...sendButtonProps,
    //         onPress: () => onSend(message),
    //       }}
    //       onSend={() => console.log('sdfsfsfsg')}
    //       disabled={message.length == 0 || message.trim() === ''}
    //       // onPress={onSend}
    //     >
    //       <View
    //         style={{
    //           paddingHorizontal: Sizes.fixPadding * 2,
    //           paddingVertical: Sizes.fixPadding * 0.7,
    //           borderRadius: 1000,
    //           backgroundColor: Colors.primaryLight,
    //         }}>
    //         <Text style={{...Fonts.white14RobotoMedium}}>Send</Text>
    //       </View>
    //     </Send>
    //   }
    // />
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  chatRequestData: state.chat.chatRequestData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(InputMesaage);

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
