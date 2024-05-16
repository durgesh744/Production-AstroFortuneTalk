import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { actions } from '../../config/data';

const BottomModal = ({ isVisible, onClose, onSelectOption }) => {
  const options = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <Modal
      isVisible={isVisible}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <View style={{ backgroundColor: 'white', padding: 16 }}>
        {options.map((option, index) => (
          <TouchableOpacity key={index} onPress={() => onSelectOption(option)}>
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={onClose}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default BottomModal;
