/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, View} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import Notifee, {EventType} from '@notifee/react-native';
import AcceptChat from './src/Screens/AcceptChat';
import {navigate} from './src/navigation/NavigationServices';
import {Text, TextInput} from 'react-native';
import IncommingChat from './IncommingChat';
import {
  initializeNotification,
  onNotification,
  onNotificationBackground,
  showChatNotification,
} from './NotifeeManager';
import store from './src/redux/store';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const onBackgroundMessaging = async message => {
  try {
    initializeNotification();
    // onNotificationBackground(message)
    showChatNotification(message);
  } catch (e) {
    console.log(e);
  }
};

const RNRedux = () => {
  return (
    <Provider store={store}>
      <App  />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNRedux);

messaging().setBackgroundMessageHandler(onBackgroundMessaging);

Notifee.onForegroundEvent(async ({type, detail, headless}) => {
  const {notification, pressAction} = detail;
  if (type === EventType.ACTION_PRESS && pressAction.id === 'accept_chat') {
    await Notifee.cancelNotification(notification.id);
    console.log('onForegroundEvent')
    await Notifee.cancelNotification(notification.id);
    setTimeout(() => {

      // navigate('acceptChat', {message: notification?.data});
    }, 500);
  } 
});

Notifee.onBackgroundEvent(async ({type, detail, headless}) => {
  const {notification, pressAction} = detail;
  if (type === EventType.ACTION_PRESS && pressAction.id === 'accept_chat') {
    await Notifee.cancelNotification(notification.id);
    await Notifee.cancelDisplayedNotification(notification.id)
    console.log('onBackgroundEvent');
    setTimeout(() => {
      // navigate('acceptChat', {message: notification?.data});
    }, 2000);
  } else if (
    type === EventType.ACTION_PRESS &&
    pressAction.id === 'reject_chat'
  ) {
    await Notifee.cancelNotification(notification.id);
  } else {
  }
});

Notifee.registerForegroundService(notification => {
  console.warn('Foreground service started.', notification);
  return new Promise(resolve => {
    /**
     * Cancel the notification and resolve the service promise so the Headless task quits.
     */

    /**
     * Cancel our long running task if the user presses the 'stop' action.
     */
 
  });
});
