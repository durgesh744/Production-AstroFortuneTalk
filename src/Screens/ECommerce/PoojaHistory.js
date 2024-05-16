import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyHeader from '../../component/MyHeader';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import axios from 'axios';
import {api_url, astro_history_pooja} from '../../config/Constants';
import {connect} from 'react-redux';
import {err} from 'react-native-svg/lib/typescript/xml';
import Loader from '../../component/Loader';
import moment from 'moment';

const listData = [
  {
    id: 1,
    pooja_name: 'Jal Abhishek Pooja',
    scheduled_date: '18th October 2023',
    scheduled_time: '02.45 pm',
    price: '2299',
    status: '1',
  },
  {
    id: 2,
    pooja_name: 'Jal Abhishek Pooja',
    scheduled_date: '18th October 2023',
    scheduled_time: '02.45 pm',
    price: '2299',
    status: '0',
  },
];

const PoojaHistory = ({navigation, providerData}) => {
  const [state, setState] = useState({
    isLoading: false,
    historyData: null,
  });

  useEffect(() => {
    get_pooja_history();
  }, []);

  const get_pooja_history = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + astro_history_pooja,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData?.id,
      },
    })
      .then(res => {
        console.log(res.data.data);
        updateState({isLoading: false});
        if (res.data.status) {
          updateState({historyData: res.data.data});
        }
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, historyData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList ListHeaderComponent={<>{historyData && listInfo()}</>} />
      </View>
    </View>
  );

  function listInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('historyDetails', {poojaData: item})
          }
          style={styles.itemContainer}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...Fonts.primaryDark16RobotoMedium,
                marginBottom: Sizes.fixPadding,
              }}>
              {item?.pooja_detail[0]?.title}
            </Text>
            <Text
              style={{
                ...Fonts.primaryLight15RobotoMedium,
                textDecorationLine: 'underline',
              }}>
              View
            </Text>
          </View>

          <Text
            style={{
              ...Fonts.gray14RobotoMedium,
              color: Colors.blackLight,
              marginBottom: Sizes.fixPadding * 0.3,
            }}>
            Scheduled Date - {moment(item?.date).format('DD-MMMM-YYYY')}
          </Text>
          <Text
            style={{
              ...Fonts.gray14RobotoMedium,
              color: Colors.blackLight,
              marginBottom: Sizes.fixPadding * 0.3,
            }}>
            Scheduled Time - {moment(item?.time).format('hh:mm A')}
          </Text>

          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...Fonts.primaryLight14RobotoMedium,
              }}>
              Price of Pooja - ₹{item.price}-/
            </Text>
            <Text
              style={{
                ...Fonts.black16RobotoMedium,
                color: item?.status != '1' ? Colors.greenLight : Colors.red2,
              }}>
              {item?.status != '1' ? 'Completed' : 'Incomplete'}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginVertical: Sizes.fixPadding * 2,
        }}>
        <FlatList
          data={historyData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  function header() {
    return <MyHeader navigation={navigation} title={'Pooja History'} />;
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(PoojaHistory);

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.grayLight,
    marginBottom: Sizes.fixPadding * 2,
    borderRadius: Sizes.fixPadding * 1.4,
    padding: Sizes.fixPadding * 1.5,
    elevation: 3,
    shadowColor: Colors.black,
  },
});
