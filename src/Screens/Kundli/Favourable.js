import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Fonts, Sizes } from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import { SCREEN_WIDTH } from '../../config/Screen';
import Loader from '../../component/Loader';
import {
  api_url,
  get_fav,
} from '../../config/Constants'
import axios from 'axios';

const Favourable = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(false);

  useEffect(() => {
    get_favrouable();
  }, []);


  const get_favrouable = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_fav,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: id
      },
    })
      .then(res => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };



  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{ width: SCREEN_WIDTH * 0.9, marginHorizontal: Sizes.fixPadding * 2 }}>
        <FlatList ListHeaderComponent={
          <>
            {favourableInfo()}
            {favourableData()}
          </>
        } />
      </View>
    </View>
  );

  function favourableData() {
    const renderItem = ({ renderItem }) => {
      return (
        <View style={{ borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding * 2, marginBottom: Sizes.fixPadding, backgroundColor: Colors.orange_light }}>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>Favourable Day -</Text>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>Sunday, Monday</Text>
        </View>
      )
    }
    return (
      <View style={{ marginVertical: Sizes.fixPadding }}>
        <View>
        </View>
        <View style={{ marginVertical: Sizes.fixPadding }}>
          <TouchableOpacity style={{ flexDirection: 'row', marginBottom: Sizes.fixPadding, backgroundColor: Colors.primaryLight, borderRadius: Sizes.fixPadding * 2.5, alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding * 0.5 }}>
            <View style={{ marginRight: Sizes.fixPadding, height: 30 }}>
              <Image source={require('../../../src/assets/images/indian.png')} style={{ width: 40, height: 30, resizeMode: 'cover' }} />
            </View>
            <Text style={{ ...Fonts.white16RobotoMedium }}>Favourable Mantra</Text>
          </TouchableOpacity>
          <Text style={{ ...Fonts.gray14RobotoMedium, textAlign: 'center' }}>{data?.numero_table?.fav_mantra}</Text>
        </View>
      </View>
    )
  }


  function favourableInfo() {
    return (
      <View>
        <View>
          <View style={{ marginVertical: Sizes.fixPadding, paddingRight: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding, borderColor: Colors.primaryDark, borderWidth: 2, borderRadius: Sizes.fixPadding, width: '45%' }}>
              <Text style={{ ...Fonts.primaryLight14RobotoMedium }}>Name No.-{data?.numero_table?.name_number}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding, borderColor: Colors.primaryDark, borderWidth: 2, borderRadius: Sizes.fixPadding, width: '45%' }}>
              <Text style={{ ...Fonts.primaryLight14RobotoMedium }}>Time-NA</Text>
            </View>
          </View>
          <View style={{ marginVertical: Sizes.fixPadding, paddingRight: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding, borderColor: Colors.primaryDark, borderWidth: 2, borderRadius: Sizes.fixPadding, width: '45%' }}>
              <Text style={{ ...Fonts.primaryLight14RobotoMedium }}>Friendly NO.-{data?.numero_table?.friendly_num}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding, borderColor: Colors.primaryDark, borderWidth: 2, borderRadius: Sizes.fixPadding, width: '45%' }}>
              <Text style={{ ...Fonts.primaryLight14RobotoMedium }}>Destiny NO.-{data?.numero_table?.destiny_number}</Text>
            </View>
          </View>
        </View>
        <View style={{ borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding * 2, marginBottom: Sizes.fixPadding, backgroundColor: Colors.orange_light }}>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>Favourable Day        -</Text>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>{data?.numero_table?.fav_day}</Text>
        </View>
        <View style={{ borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding * 2, marginBottom: Sizes.fixPadding, backgroundColor: Colors.orange_light }}>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>Favourable Colour   -</Text>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>{data?.numero_table?.fav_color}</Text>
        </View>
        <View style={{ borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding * 2, marginBottom: Sizes.fixPadding, backgroundColor: Colors.orange_light }}>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>Favourable Metal    -</Text>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>{data?.numero_table?.fav_stone}</Text>
        </View>
        <View style={{ borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding * 2, marginBottom: Sizes.fixPadding, backgroundColor: Colors.orange_light }}>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>Favourable God       -</Text>
          <Text style={{ ...Fonts.gray14RobotoMedium }}>{data?.numero_table?.fav_god}</Text>
        </View>
      </View>
    )
  }
}

export default Favourable