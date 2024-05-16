import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import { SCREEN_WIDTH} from '../../config/Screen';
import Loader from '../../component/Loader';
import {
  api_url,
  api2_get_manglik_dosha,
  api2_get_kalsarph_dosha,
  api2_get_sadhesati_status
} from '../../config/Constants';
import axios from 'axios';

const KundliDosh = ({id}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [manglik, setManglik] = useState(null);
  const [kalSarpa, setKalSarpa] = useState(null);
  const [sadheSati, setSadheSati] = useState(null);

  useEffect(() => {
    manglik_dosha();
    kalSarpa_dosha();
    sadheSati_dosha();
  }, []);

  const manglik_dosha = async () => { 
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_manglik_dosha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: id,
      },
    }) .then(res => {
        setManglik(res.data?.manglik);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }

  const kalSarpa_dosha = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_kalsarph_dosha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id:id,
      },
    }) .then(res => {
        setKalSarpa(res.data?.kalsarpa_details.report);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }

  const sadheSati_dosha = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_sadhesati_status,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: id,
      },
    }) .then(res => {
        setSadheSati(res.data?.sadhesati_current_status);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
            {doshaInfo()}
            </>
          }
        />
      </View>
    </View>
  )

  function doshaInfo() {
    return (
      <View>
        <Image
          source={require('../../assets/images/kundli_dosha.png')}
          style={{
            width: SCREEN_WIDTH * 0.55,
            height: SCREEN_WIDTH * 0.55,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Manglik Dosha
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            {manglik?.manglik_report}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            KalSarpa Dosha
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            {kalSarpa?.report?.report ?? 'Not Detected'} 

          </Text>
        </View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            SadheSati Dosha
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            {sadheSati?.is_undergoing_sadhesati}
          </Text>
        </View>
      </View>
    );
  }
}

export default KundliDosh;
