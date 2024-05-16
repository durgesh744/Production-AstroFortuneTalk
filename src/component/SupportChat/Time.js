import {View, Text, StyleSheet, AppState} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import database from '@react-native-firebase/database';

const Time = ({providerData, deduct_wallet, userData, updateState}) => {
  const [minutes, setMinutes] = useState(0);
  const [isChatStart, setIsChatStart] = useState(false);
  const [wallet, setWallet] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    database()
      .ref(`CurrentRequest/${providerData?.id}`)
      .on('value', snapshot => {
        setWallet(snapshot.val()?.wallet);
      });
    database()
      .ref(`CurrentRequest/${providerData?.id}`)
      .once('value', snapshot => {
        setMinutes(parseInt(snapshot.val()?.minutes));
      });
    database()
      .ref(`CustomerCurrentRequest/${userData?.user_id}`)
      .on('value', snapshot => {
        if (snapshot.val()?.status == 'active') {
          setIsChatStart(true);
          database()
            .ref(`CurrentRequest/${providerData?.id}`)
            .once('value', snapshot => {
              updateState({
                inVoiceId: snapshot.val()?.invoice_id,
                startTime: snapshot.val()?.date,
              });
            });
        } else {
          setIsChatStart(false);
        }
      });
  }, [wallet, appStateVisible]);

  useEffect(() => {
    const interValId = setInterval(() => {
      if (isChatStart) {
        setMinutes(prevTime => {
          database()
            .ref(`CurrentRequest/${providerData?.id}`)
            .update({
              minutes: prevTime - 1,
            });
          if (prevTime - 1 <= 0) {
            clearInterval(interValId);
            deduct_wallet();
          }
          return prevTime - 1;
        });
      } else {
        clearInterval(interValId);
      }
    }, 1000);
    return () => {
      clearInterval(interValId);
    };
  }, [isChatStart]);

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
      database().ref(`CustomerCurrentRequest/${userData?.user_id}`).off();
      database().ref(`CurrentRequest/${providerData?.id}`).off();
    };
  }, []);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
      String(minutes).padStart(2, '0') +
      ':' +
      String(remainingSeconds).padStart(2, '0')
    );
  };

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
          {formatTime(minutes)}
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

export default Time;
