import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../assets/style';

const Singlecont = ({title, value1}) => {
  return (
    <View
      style={{
        marginHorizontal: 15,
        marginBottom: 10,
        marginTop: 18,
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
        <View
          style={{
            borderTopWidth: 2,
            borderColor: Colors.gray_back,
            width: 310,
            flexDirection: 'row',
          }}>
          <View
            style={{
              borderEndWidth: 2,
              borderColor: Colors.gray_back,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                ...Fonts.primaryLight15RobotoMedium,
                fontSize: 17.5,
                color: Colors.black,
                width: 100,
              }}>
              Busy time (in mins)
            </Text>
          </View>
          <View
            style={{
              borderEndWidth: 2,
              borderColor: Colors.gray_back,
              paddingVertical: 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.primaryLight15RobotoMedium,
                fontSize: 17.5,
                color: Colors.primaryDark,
                width: 100,
                textAlign: 'center',
              }}>
              {value1}
            </Text>
          </View>
          <View
            style={{
              borderEndWidth: 2,
              borderColor: Colors.gray_back,
              paddingVertical: 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.primaryLight15RobotoMedium,
                fontSize: 17.5,
                color: Colors.black,
                width: 55,
                textAlign: 'center',
              }}>
              N/A
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.primaryLight15RobotoMedium,
                fontSize: 17.5,
                color: Colors.black,
                width: 55,
                textAlign: 'center',
              }}>
              N/A
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Singlecont;

const styles = StyleSheet.create({});
