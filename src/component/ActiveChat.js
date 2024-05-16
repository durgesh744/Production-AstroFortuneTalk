import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native-paper';
import {Colors, Fonts, Sizes} from '../assets/style';
import {SCREEN_WIDTH} from '../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from './Loader';
import {api_url, deductwallet} from '../config/constants';
import database from '@react-native-firebase/database';
import axios from 'axios';
import moment from 'moment';

const ActiveChat = ({
  navigation,
  activeChatVisible,
  updateState,
  chatData,
  userData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const deduct_wallet = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + deductwallet,
      data: {
        user_id: userData.id,
        astro_id: chatData?.astroData.id,
        amount: chatData?.astroData.chat_price_m,
        commission: chatData?.astroData.chat_commission,
        astro_amount: chatData?.astroData.chat_price_m,
        chat_id: chatData?.chat_id,
        chat_call: '1',
        end_time: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        transid: chatData?.trans_id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        end_chat_in_firebase();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const end_chat_in_firebase = () => {
    const firebaseId = () => {
        database()
          .ref(`UserId/${userData.id}`)
          .on();
      };
    console.log(firebaseId)
    // database()
    //   .ref(`/UserId/${chatData.astroData.id}`)
    //   .on('value', snapshot => {
    //     const send_msg = {
    //       message: 'User ended the chat.',
    //       timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
    //       to: snapshot.val(),
    //       type: 'text',
    //     };
    //     const node = database()
    //       .ref(`/UserId/${chatData.astroData.id}`)
    //       .push();
    //     const key = node.key;
    //     database().ref(`/Messages/${firebaseId}/${snapshot.val()}/${key}`).set({
    //       from: firebaseId,
    //       image: 'image = null',
    //       message: 'User ended the chat.',
    //       timestamp: new Date().getTime(),
    //       to: snapshot.val(),
    //       type: 'text',
    //     });
    //     database().ref(`/Messages/${snapshot.val()}/${firebaseId}/${key}`).set({
    //       from: firebaseId,
    //       image: 'image = null',
    //       message: 'User ended the chat.',
    //       timestamp: new Date().getTime(),
    //       to: snapshot.val(),
    //       type: 'text',
    //     });
    //     database()
    //       .ref(`/Chat/${firebaseId}/${snapshot.val()}`)
    //       .update(send_msg);
    //     database()
    //       .ref(`/Chat/${snapshot.val()}/${firebaseId}`)
    //       .update(send_msg);
    //     updateState({message: ''});
    //   });
    // const nodeRef_a = database().ref(`/CustomerCurrentRequest/${userData.id}`);
    // nodeRef_a.update({
    //     astroData: '',
    //     status: ''
    // })
    // updateState({activeChatVisible: false});
  };
  return (
    <Modal
      visible={activeChatVisible}
      onDismiss={() => updateState({activeChatVisible: false})}>
      <Loader visible={isLoading} />
      <View
        style={{
          backgroundColor: Colors.white,
          width: SCREEN_WIDTH * 0.8,
          alignSelf: 'center',
          padding: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
        }}>
        <Text
          style={{...Fonts.primaryLight18RobotoMedium, textAlign: 'center'}}>
          Alert!
        </Text>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            textAlign: 'center',
            marginVertical: Sizes.fixPadding * 2,
          }}>
          You have an active chat
        </Text>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={deduct_wallet}
            style={{borderRadius: Sizes.fixPadding, overflow: 'hidden'}}>
            <LinearGradient
              colors={[Colors.blackLight, Colors.gray]}
              style={{
                width: SCREEN_WIDTH * 0.3,
                paddingVertical: Sizes.fixPadding * 0.6,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                End
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('chatScreen', {
                astroData: chatData?.astroData,
                trans_id: chatData?.trans_id,
                chat_id: chatData?.chat_id,
              });
            }}
            style={{borderRadius: Sizes.fixPadding, overflow: 'hidden'}}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                width: SCREEN_WIDTH * 0.3,
                paddingVertical: Sizes.fixPadding * 0.6,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                Resume
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ActiveChat;
