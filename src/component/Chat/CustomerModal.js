import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {SCREEN_WIDTH} from '../../config/Screen';
import {Colors, Fonts, Sizes} from '../../assets/style';
import moment from 'moment';
import { connect } from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions'

const CustomerModal = ({customerModalVisible, userData, dispatch}) => {

  console.log("userData ====>>>>>>>>>>>>" , userData)

  return (
    <Modal
      visible={customerModalVisible}
      transparent
      onRequestClose={() => dispatch(ChatActions.setCustomerModalVisible(false))}>
      <TouchableOpacity
        onPressOut={() => dispatch(ChatActions.setCustomerModalVisible(false))}
        style={{flex: 1, backgroundColor: Colors.black + '10'}}>
        <View style={styles.container}>
          <Text style={{...Fonts.primaryLight15RobotoMedium}}>
            User Details:{' '}
          </Text>
          <Text style={styles.itemText}>Name : {userData?.username}</Text>
          <Text style={styles.itemText}>
            Gender :{' '}
            {userData?.gender == '1'
              ? 'Male'
              : userData?.gender == '2'
              ? 'Female'
              : userData?.gender}
          </Text>
          <Text style={styles.itemText}>
            Birth Date :{' '}
            {moment(userData?.date_of_birth).format('DD-MMMM-YYYY')}
          </Text>
          <Text style={styles.itemText}>
            Birth Time :{' '}
            {moment(userData?.time_of_birth, 'hh:mm').format('hh:mm A')}{' '}
          </Text>
          <Text style={styles.itemText}>
            Birth Place : {userData?.place_of_birth}
          </Text>
          <Text style={styles.itemText}>
            Current Address : {userData?.current_address}
          </Text>
          <Text style={styles.itemText}>
            Occupation : {userData?.occupation}
          </Text>
          <Text style={styles.itemText}>
            Problem Area : {userData?.problem}
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const mapStateToProps = state => ({
  userData: state.chat.userData,
  customerModalVisible: state.chat.customerModalVisible,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerModal);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: Colors.white,
    bottom: 50,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 2,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizes.fixPadding * 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  itemText: {
    ...Fonts.black14RobotoRegular,
    marginVertical: Sizes.fixPadding * 0.5,
    textTransform: 'capitalize',
  },
});
