import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import React, { useCallback } from 'react';
import {SCREEN_WIDTH} from '../../config/Screen';
import {Colors, Fonts, Sizes} from '../../assets/style';
import { connect } from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions'
import { navigate } from '../../navigation/NavigationServices';

const TarotModal = ({taroatModalVisible, dispatch}) => {
  
  const on_click = (type)=>{
    dispatch(ChatActions.setTaroatModalVisible(false))
    dispatch(ChatActions.setTaroatType(type))
    dispatch(ChatActions.setTaroatCount(type))
    console.log('hii')
    navigate('selectTaroat', {count: type})
  }
  return (
    <Modal
      visible={taroatModalVisible}
      transparent
      onRequestClose={() => dispatch(ChatActions.setTaroatModalVisible(false))}>
      <TouchableOpacity
        onPressOut={() => dispatch(ChatActions.setTaroatModalVisible(false))}
        style={{flex: 1, backgroundColor: Colors.black + '10'}}>
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => on_click(1)} 
            style={styles.itemContainer}>
            <Text style={styles.itemText}>One Tarot Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => on_click(2)}
            style={styles.itemContainer}>
            <Text style={styles.itemText}>Two Tarot Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => on_click(3)}
            style={[styles.itemContainer, {borderBottomWidth: 0}]}>
            <Text style={styles.itemText}>Three Tarot Card</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const mapStateToProps = state => ({
  taroatModalVisible: state.chat.taroatModalVisible
})

const mapDispatchToProps = dispatch => ({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(TarotModal);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.65,
    backgroundColor: Colors.white,
    bottom: 50,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizes.fixPadding * 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  itemText: {
    ...Fonts.black14RobotoRegular
  },
});
