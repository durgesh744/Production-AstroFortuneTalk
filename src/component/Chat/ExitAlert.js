import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import {Colors, Fonts, Sizes} from '../../assets/style';
import { connect } from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions'

const ExitAlert = ({ exitVisible, dispatch}) => {
  return (
    <Modal
      visible={exitVisible}
      onDismiss={() => dispatch(ChatActions.setExitVisible(false))}>
      <View
        style={{
          height: SCREEN_HEIGHT,
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.modal2}>
          <Text
            style={{
              width: '75%',
              ...Fonts.gray16RobotoMedium,
              marginBottom: Sizes.fixPadding,
              textAlign: 'center',
            }}>
            Are you sure you want to leave the chat
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => dispatch(ChatActions.setExitVisible(false))}
              style={{
                width: '45%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: Sizes.fixPadding * 2,
                backgroundColor: Colors.gray3,
                paddingVertical: Sizes.fixPadding,
                paddingHorizontal: Sizes.fixPadding * 2,
              }}>
              <Text style={{...Fonts.black16RobotoMedium, color: Colors.white}}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={()=>dispatch(ChatActions.onDeductWallet())}
              style={{
                width: '45%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: Sizes.fixPadding * 2,
                backgroundColor: Colors.primaryDark,
                paddingVertical: Sizes.fixPadding,
                paddingHorizontal: Sizes.fixPadding * 2,
              }}>
              <Text style={{...Fonts.black16RobotoMedium, color: Colors.white}}>
                Leave
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = state => ({
  exitVisible: state.chat.exitVisible
})

const mapDispatchToProps = dispatch => ({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(ExitAlert);

const styles = StyleSheet.create({
  modal2: {
    width: SCREEN_WIDTH * 0.75,
    padding: Sizes.fixPadding * 1.5,
    borderRadius: Sizes.fixPadding * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    // elevation: 5,
    // shadowColor: Colors.black,
    // shadowOffset: {
    //   width: 5,
    //   height: 5,
    // },
    // shadowRadius: 5,
    // shadowOpacity: 0.5,
  },
});
