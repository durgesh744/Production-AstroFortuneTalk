import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
const {width, height} = Dimensions.get('screen');
import LinearGradient from 'react-native-linear-gradient';

const Performancecont = ({title}) => {
  return (
    <View
      style={{
        marginHorizontal: 15,
        marginVertical: 10,
      }}>
      <View
        style={{
          borderRadius: 20,
          flex: 0,
          backgroundColor: Colors.dakWhite,
          borderRadius: 10,
          padding: 10,
          elevation: 5,
        }}>
        <View style={{marginBottom: 5}}>
          <Text
            style={{
              ...Fonts.primaryLight15RobotoMedium,
              fontSize: 17.5,
              color: Colors.primaryDark,
            }}>
            {title}
          </Text>
        </View>
        <LinearGradient
          colors={[Colors.red, Colors.rating_clr, Colors.green]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{
            borderRadius: 20,
            flex: 0,
            borderRadius: 10,
            padding:5,
            elevation: 5,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 2.5,
          }}>
          <Text style={{fontWeight: 'bold'}}>0.0</Text>
          <Text style={{fontWeight: 'bold'}}>10.0</Text>
          <Text style={{fontWeight: 'bold'}}>15.0</Text>
          <Text style={{fontWeight: 'bold'}}>100</Text>
        </View>
        <View
          style={{
            borderTopWidth: 10,
            borderColor: Colors.dullWhite,
            width: 340,
            flexDirection: 'row',
            marginLeft:-15,
          }}
        />
        <View style={{marginTop:10}}>
            <Text style={{fontWeight: 'bold', fontSize:15}}>Your Score</Text>
        </View>
        <View style={{
            borderRadius: 20,
            borderRadius: 10,
            padding:10,
            backgroundColor: Colors.rating_clr,
            elevation: 5,
            marginVertical:15
          }}/>
          <View style={{ marginBottom:15 }}>
            <Text style={{ color:Colors.Dark_grayish_red,fontWeight:500}}>MO retention means that if you talk to 100 MO customers and 32 out of those customers do a paid transaction on FortuneTalk, then your MO retention is 32%. For MO retention, it doesn't matter if the customer comes back to you or not but the purpose of PO is to make the customer a paid user. It can change (increase/decrease) even if you did not work on the previous day because 90th </Text>
          </View>
          <View style={{ marginBottom:10 }}>
            <Text style={{ color:Colors.Dark_grayish_red,fontWeight:'bold'}}>Rank: N/A</Text>
          </View>
      </View>
    </View>
  );
};

export default Performancecont;
