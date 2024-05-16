import { View, Text } from 'react-native'
import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DemoClassHistory from '../Screens/History/DemoClassHistory';
import ScheduleClassHistory from '../Screens/History/ScheduleClassHistory';
import MyHeader from '../component/MyHeader';
import { Colors, Fonts } from '../assets/style';
import MyStatusBar from '../component/MyStatusBar';

const Tab = createMaterialTopTabNavigator();

const ClassHistory = ({navigation}) => {
    return (
        <View style={{flex: 1}}>
          <MyStatusBar backgroundColor={Colors.primaryLight} barStyle={'light-content'} />
          {header()}
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {backgroundColor: Colors.primaryLight},
              tabBarLabelStyle: {...Fonts.white18RobotBold, fontSize: 13, textTransform: 'capitalize'},
              tabBarIndicatorStyle: {
                backgroundColor: Colors.white,
                height: 6,
                borderTopLeftRadius: 1000,
                borderTopRightRadius: 1000,
              },
            }}>
            <Tab.Screen
              name="demoClassHistory"
              component={DemoClassHistory}
              options={{tabBarLabel: 'Demo Class'}}
            />
            <Tab.Screen
              name="scheduleClassHistory"
              component={ScheduleClassHistory}
              options={{tabBarLabel: 'Schedule Class'}}
            />
          </Tab.Navigator>
        </View>
      );
      function header() {
        return <MyHeader title={'History Class'} navigation={navigation} />;
      }
}

export default ClassHistory