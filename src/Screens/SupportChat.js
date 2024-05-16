import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import MyStatusBar from '../component/MyStatusBar';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyHeader from '../component/MyHeader';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import database from '@react-native-firebase/database';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const SupportChat = props => {
  const navigation = useNavigation();
  console.log(props.firebaseId);

  const create_chat = ({props, firebaseId}) => {
    const admin = 'MMy42mbMO1SF619sfSynBtY44TB2';
    const send_msg = {
      message: 'support Join',
      timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss'),
      to: admin,
      type: 'text',
    };
    const node = database().ref(`MMy42mbMO1SF619sfSynBtY44TB2`).push();
    const key = node.key;
    database().ref(`/SupportMessages/${props.firebaseId}/${admin}/${key}`).set({
      from: firebaseId,
      message: '',
      timestamp: new Date().getTime(),
      to: admin,
      type: 'text',
    });

    database()
      .ref(`/SupportChat/${props.firebaseId}/${admin}`)
      .update(send_msg);

    props.navigation.navigate('supportChatScreen');
  };

  // Example usage:
  const chatParams = {
    props: {
      firebaseId: props.firebaseId,
      navigation: navigation,
      // Other props as needed
    },
    firebaseId: props.firebaseId,
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title={'Support Chat'} navigation={props.navigation} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.white,
          flex: 0.1,
        }}>
        <Text
          style={{...Fonts.white14RobotBold, color: Colors.Dark_grayish_red}}>
          Data shown for last 3 days only
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.dullWhite,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{...Fonts.white14RobotBold, color: Colors.Dark_grayish_red}}>
          No Ticket Available
        </Text>
      </View>
      <View>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={style.gradient}>
          <TouchableOpacity onPress={() => create_chat(chatParams)}>
            <Text style={{...Fonts.white18RobotBold, fontSize: 16}}>
              + Create New Chat
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  requestData: state.provider.requestData,
  firebaseId: state.provider.firebaseId,
});

export default connect(mapStateToProps, null)(SupportChat);

const style = StyleSheet.create({
  gradient: {
    padding: Sizes.fixPadding,
    borderRadius: 30,
    width: '60%',
    marginVertical: Sizes.fixPadding,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
