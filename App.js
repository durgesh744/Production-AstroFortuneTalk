/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';

import {AppState, Linking, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import Notifee, {
  AndroidChannel,
  AndroidImportance,
  Notification,
  EventType,
  Event,
  AuthorizationStatus,
  TimestampTrigger,
  RepeatFrequency,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import NetworkStatus from './src/component/NetworkStatus';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {setTopLevelNavigator} from './src/navigation/NavigationServices';
import {initializeNotification, onNotification} from './NotifeeManager';
import IncommingChat from './IncommingChat';
import {connect} from 'react-redux';
import * as ChatActions from './src/redux/actions/ChatActions';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(
  true, // isDebug
);

const App = ({screenType, dispatch, isActiveDevice}) => {
  const [isConnected, setIsConnected] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(null);
  async function checkNotificationPermission() {
    const settings = await Notifee.getNotificationSettings();
    if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permissions has been authorized');
      await Notifee.requestPermission();
    } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
      console.log('Notification permissions has been denied');
    }
  }

  const onMessaging = async message => {
    try {
      initializeNotification();
      onNotification(message);
      if (message?.data?.type == 'chat_request') {
        dispatch(ChatActions.setChatRequestData(message?.data));
        dispatch(ChatActions.setScreenType('CHAT_SCREEN'));
      } else {
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getInitialNotification = async () => {
    try {
      const notification = await Notifee.getInitialNotification();
      const currentNotification = await Notifee.getDisplayedNotifications();
      console.log(currentNotification);
      if (currentNotification.length != 0) {
        let chatStatus = true;
        for (const notifee of currentNotification) {
          if (notifee.notification.data?.type == 'chat_request') {
            dispatch(ChatActions.setChatRequestData(notifee.notification.data));
            dispatch(ChatActions.setScreenType('CHAT_SCREEN'));
            chatStatus = false;
            break;
          }
        }
        if (chatStatus) {
          dispatch(ChatActions.setScreenType('APP_SCREEN'));
        }
      } else if (notification) {
        if (notification?.notification?.data?.type == 'chat_request') {
          dispatch(
            ChatActions.setChatRequestData(notification?.notification?.data),
          );
          dispatch(ChatActions.setScreenType('CHAT_SCREEN'));
        } else {
          dispatch(ChatActions.setScreenType('APP_SCREEN'));
        }
      } else {
        dispatch(ChatActions.setScreenType('APP_SCREEN'));
      }
    } catch (e) {
      dispatch(ChatActions.setScreenType('APP_SCREEN'));
      console.log(e);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        console.log('hii', nextAppState);
        if (isActiveDevice) {
          getInitialNotification();
        }
       
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
      dispatch(ChatActions.setIsActiveDevice(false));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    checkNotificationPermission();
    initializeNotification();
    checkForUpdates()
    messaging().onMessage(onMessaging);
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkForUpdates = () => {
    inAppUpdates.checkNeedsUpdate({curVersion: '2.0.1'}).then(result => {
      if (result.shouldUpdate) {
        let updateOptions: StartUpdateOptions = {};
        if (Platform.OS === 'android') {
          // android only, on iOS the user will be promped to go to your app store page
          updateOptions = {
            updateType: IAUUpdateKind.FLEXIBLE,
          };
        }
        inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
      }
    }).catch(err=>{
      console.log(err)
    });
  };

  switch (screenType) {
    case 'CHAT_SCREEN': {
      return <IncommingChat />;
    }
    case 'APP_SCREEN': {
      return (
        <SafeAreaProvider style={{flex: 1}}>
          <PaperProvider>
            <NetworkStatus status={isConnected} />
            <NavigationContainer ref={ref => setTopLevelNavigator(ref)}>
              <StackNavigator />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      );
    }
    default: {
      return null;
    }
  }
};

const mapStateToProps = state => ({
  screenType: state.chat.screenType,
  isActiveDevice: state.chat.isActiveDevice,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(App);
