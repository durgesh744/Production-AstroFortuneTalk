import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Sizes} from '../assets/style';
import MyStatusBar from '../component/MyStatusBar';
import MyHeader from '../component/MyHeader';
import Loader from '../component/Loader';
import {FlatList} from 'react-native';
import {ApiRequests} from '../config/requests';
import {api_url, privacy_policy_astrologer, terms} from '../config/Constants';
import RenderHtml from 'react-native-render-html';
import {SCREEN_WIDTH} from '../config/Screen';

const Terms = ({navigation}) => {
  const [state, setState] = useState({
    isLoading: false,
    policyData: null,
  });

  useEffect(() => {
    get_policy();
  }, []);

  const get_policy = async () => {
    try {
      updateState({isLoading: true});
      const response = await ApiRequests.getRequest({
        url: api_url + terms,
      });
      if (response?.status == 1) {
        updateState({policyData: response?.records[0]?.desc});
      }
      updateState({isLoading: false});
    } catch (e) {
      updateState({isLoading: false});
      console.log(e);
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, policyData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title="Terms and Conditions" navigation={navigation} />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        <FlatList ListHeaderComponent={<>{policyData && policyInfo()}</>} />
      </View>
    </View>
  );

  function policyInfo() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: Sizes.fixPadding,
        }}>
        <RenderHtml
          contentWidth={SCREEN_WIDTH}
          source={{html: policyData}}
          enableExperimentalMarginCollapsing={true}
          baseStyle={{
            color: Colors.blackLight,
            textAlign: 'auto',
            fontSize: '14px',
            lineHeight: 22,
          }}
        />
      </View>
    );
  }
};

export default Terms;
