import {View, Text, StyleSheet, AppState} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import database from '@react-native-firebase/database';
import CountDown from './CountDown';
import {connect} from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions';

const Time = ({isChatStart, maxDuration, dispatch}) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    dispatch(ChatActions.getChatData({dispatch}));
  }, [appStateVisible]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [appStateVisible]);

  return (
    <View
      style={[
        // styles.row,
        {
          justifyContent: 'center',
          marginVertical: Sizes.fixPadding * 2,
          backgroundColor: 'transparent',
          alignItems: 'center',
        },
      ]}>
      <View
        style={{
          backgroundColor: Colors.primaryLight,
          width: '30%',
          paddingVertical: Sizes.fixPadding * 0.5,
          borderRadius: 1000,
        }}>
        <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
          {maxDuration && (
            <CountDown duration={maxDuration} isActive={isChatStart} />
          )}
        </Text>
      </View>
      <Text
        style={{
          ...Fonts.gray16RobotoMedium,
          textAlign: 'center',
          marginVertical: 10,
        }}>
        Chat in progress
      </Text>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  isChatStart: state.chat.isChatStart,
  maxDuration: state.chat.maxDuration,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Time);
