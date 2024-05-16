import {StyleSheet, View} from 'react-native';
import React from 'react';
import Shorts from './Item';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type RootStackParamList = {
  Reels: { items: String[] }; // Replace 'string[]' with the actual type of your items
};

// Define the navigation prop type
type ReelsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Reels'>;

// Define the route prop type
type ReelsRouteProp = NativeStackScreenProps<RootStackParamList, 'Reels'>;

// Combine the navigation and route prop types into ReelsProps
type ReelsProps = ReelsNavigationProp & ReelsRouteProp;

const Reels: React.FC<ReelsProps> = ({navigation, route}) => {
  const items = route.params?.data;

  return (
    <View style={styles.container}>
      <Shorts items={items} />
    </View>
  );
};

export default Reels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
