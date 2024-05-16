import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import {Colors, Sizes, Fonts} from '../../assets/style';
import Modal from 'react-native-modal';
import moment from 'moment';
import {connect} from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions';

const HistoryModal = ({waitingModalVisible, recentChatData, dispatch}) => {
  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          padding: Sizes.fixPadding,
          borderBottomWidth: index + 1 == recentChatData.length ? 0 : 1,
          borderBottomColor: Colors.gray + '60',
        }}>
        <Text style={styles.normalText}>Order Id: {item?.order_id}</Text>
        <Text style={styles.helightText}>Name: {item?.username}</Text>
        <Text style={styles.normalText}>
          Order Time: {moment(item?.in_time).format('DD MMM YYYY, hh:mm A')}
        </Text>
        <Text style={styles.normalText}>
          Duration:{' '}
          {item?.duration ? (parseFloat(item?.duration) / 60).toFixed(2) : '0'}{' '}
          mins
        </Text>
        <Text style={styles.helightText}>
          Status: <Text style={{color: Colors.green}}>{'Completed'}</Text>
        </Text>
      </View>
    );
  };
  return (
    <Modal
      isVisible={waitingModalVisible}
      backdropOpacity={0.2}
      onBackdropPress={() =>
        dispatch(ChatActions.setWaitingModalVisible(false))
      }
      onDismiss={() => dispatch(ChatActions.setWaitingModalVisible(false))}
      style={{padding: 0, margin: 0}}>
      <View style={styles.container}>
        {recentChatData && (
          <FlatList
            data={recentChatData}
            renderItem={renderItem}
            keyExtractor={item => item.order_id}
            initialNumToRender={5}
            pa
          />
        )}
      </View>
    </Modal>
  );
};

const mapStateToProps = state => ({
  waitingModalVisible: state.chat.waitingModalVisible,
  recentChatData: state.chat.recentChatData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryModal);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: Colors.white,
    bottom: 50,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding * 2,
    paddingBottom: Sizes.fixPadding * 4,
    height: SCREEN_HEIGHT * 0.6,
  },

  helightText: {
    ...Fonts.black16RobotoMedium,
    fontSize: 14,
    color: Colors.Dark_grayish_red,
  },
  normalText: {
    ...Fonts.black12RobotoRegular,
    fontSize: 13,
    color: Colors.Dark_grayish_red,
  },
});
