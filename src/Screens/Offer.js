import {View, Text, FlatList, Dimensions, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../component/MyStatusBar';
import MyHeader from '../component/MyHeader';
import {Colors, Fonts, Sizes} from '../assets/style';
import {Switch} from 'react-native-switch';
import {
  api_url,
  get_all_offers,
  update_offer_status,
} from '../config/Constants';
import Loader from '../component/Loader';
const {width, height} = Dimensions.get('screen');
import {connect} from 'react-redux';
import axios from 'axios';

const Offer = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [offersList, setOffersList] = useState();

  useEffect(() => {
    fetch_all_offers();
  }, []);

  const fetch_all_offers = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_all_offers,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: props.providerData.id,
      },
    })
      .then(async res => {
        console.log(res.data);
        if (res.data?.status == 1) {
          setOffersList(res.data.records);
          setIsLoading(false);
        }
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const change_status = async (offer_id, offer_status) => {
    setIsLoading(true);
    console.log({
      offer_id: offer_id,
      status: offer_status == '1' ? '0' : '1',
      astro_id: props.providerData?.id,
    });
    await axios({
      method: 'post',
      url: api_url + update_offer_status,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        offer_id: offer_id,
        status: offer_status == '1' ? '0' : '1',
        astro_id: props.providerData?.id,
      },
    })
      .then(async res => {
        fetch_all_offers();
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title="Call & Chat Offers" navigation={props.navigation} />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        <FlatList ListHeaderComponent={<>{offersInfo()}</>} />
      </View>
    </View>
  );

  function offersInfo() {
    const renderItem = ({item}) => {
      return (
        <View
          style={{
            marginHorizontal: 15,
            backgroundColor: Colors.dullWhite,
            marginBottom: 10,
          }}>
          <View
            style={{
              borderRadius: 20,
              flex: 0,
              backgroundColor: Colors.dullWhite,
              borderRadius: 10,
              padding: 15,
              elevation: 5,
              shadowColor: Colors.blackLight,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '70%'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      ...Fonts.black16RobotoMedium,
                      fontWeight: '600',
                      color: Colors.gray,
                    }}>
                    Offer Name:{' '}
                  </Text>
                  <Text
                    style={{
                      ...Fonts.black16RobotoMedium,
                      fontWeight: '600',
                      color: Colors.green,
                    }}>
                    {item.offer_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      ...Fonts.black16RobotoMedium,
                      fontWeight: '600',
                      color: Colors.gray,
                      lineHeight: 18,
                    }}>
                    Display Name:{' '}
                  </Text>
                  <Text
                    style={{
                      ...Fonts.black16RobotoMedium,
                      fontWeight: '600',
                      color: Colors.primaryLight,
                      lineHeight: 18,
                    }}>
                    {item.discount}% off
                  </Text>
                </View>
              </View>
              <Switch
                value={item?.user_status == '1'}
                renderActiveText={false}
                renderInActiveText={false}
                circleBorderWidth={4}
                circleSize={20}
                onValueChange={() => change_status(item.id, item?.user_status)}
                circleBorderActiveColor={Colors.primaryLight}
                backgroundActive={Colors.primaryLight}
                backgroundInactive={Colors.gray3}
                circleBorderInactiveColor={Colors.primaryLight}
              />
            </View>
            <View>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                User Type: All Users
              </Text>
              <Text
                style={{...Fonts.gray12RobotoMedium, fontSize: width * 0.03}}>
                India: My Share: {parseFloat(item.my_share.toFixed(2))} | AT
                Share: {parseFloat(item.admin_share.toFixed(2))} | Customer
                Pays: {parseFloat(item.current_pays.toFixed(2))}
              </Text>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View style={{marginTop: '4%'}}>
        <FlatList
          data={offersList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingVertical: 15}}
        />
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Offer);
