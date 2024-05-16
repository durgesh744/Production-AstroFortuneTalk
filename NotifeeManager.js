import notifee, {
    AndroidCategory,
    AndroidColor,
    AndroidImportance,
    AndroidVisibility,
    AndroidLaunchActivityFlag,
    NotificationFullScreenAction
  } from '@notifee/react-native';
  import messaging from '@react-native-firebase/messaging';

export const initializeNotification = async()=>{
    try {
        await notifee.requestPermission();
        await messaging().registerDeviceForRemoteMessages();
        await notifee.createChannel({
          id: 'chat_request',
          name: 'Chat Request',
          vibration: true,
          vibrationPattern: [300, 500],
          sound: 'chat_request',
          importance: AndroidImportance.HIGH,
        });
      } catch (e) {
        console.log(e);
      }
}

export const onNotification = async (message)=>{
    try {
        const {data} = message;
        switch (data?.type) {
          case 'chat_request': {
            showChatNotification(message);
            return;
          }
          default: {
            showDefaultNotification(message);
            return;
          }
        }
      } catch (e) {
        console.log(e);
      }
}

export const onNotificationBackground = message => {
    console.log('Background onNotification',message);
    try {
      const {data} = message;
      switch (data?.type) {
        case 'chat_request': {
          showChatNotification(message);
          return;
        }
        default: {
          showDefaultNotification(message);
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

export const  showChatNotification = async message => {
    const {data, notification} = message;
    const {title, body} = data;
    // await notifee.requestPermission();
    await notifee.displayNotification({
      title: 'FortuneTalk',
      body: 'Full Screen Notification',
      android: {
        channelId: 'chat_request',
        smallIcon: 'ic_launcher',
        importance: AndroidImportance.HIGH,
        category: AndroidCategory.CALL,
        sound: 'chat_request',
        loopSound: true,
        lightUpScreen: true,
        colorized: true,
        color: AndroidColor.CYAN,
        ongoing: false,
        actions: [
          {
            title: 'Open',
            pressAction: {
              id: 'accept_chat',
              launchActivity: 'com.ksbm.astrofortunetalk.FullScreenActivity',
            },
          },
        ],
        fullScreenAction: {
          id: 'full_screen',
          launchActivity: 'com.ksbm.astrofortunetalk.FullScreenActivity',
          // launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP]
        },
        // asForegroundService: true,
      },
      data: data
    });
  };

export const  showDefaultNotification = async message => {
    const {data, notification} = message;
    const {title, body} = notification;
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
      vibration: true,
      vibrationPattern: [300, 500],
    });

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        importance: AndroidImportance.DEFAULT,
        visibility: AndroidVisibility.PUBLIC,
        category: AndroidCategory.CALL,
        pressAction: {
          id: 'default',
        },
      },
    });
  };