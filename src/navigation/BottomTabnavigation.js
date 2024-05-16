import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, StyleSheet, Image } from 'react-native'

import { TouchableOpacity } from 'react-native-gesture-handler';

import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
var Tab = createBottomTabNavigator()

export default function BottomTabsNavigator() {

    const TabArr = [
        { id: 1, route: 'Chat', icon: require(`../../assets/IconsImage/chat.png`), component: Chat, bwidth: '20%' },
        { id: 2, route: 'Tips', icon: require(`../../assets/IconsImage/tips.png`), component: Tips, bwidth: '20%' },
        { id: 3, route: 'HomeScreen', icon: require(`../../assets/IconsImage/home.png`), component: HomeScreen, bwidth: '20%' },
        { id: 4, route: 'Favorites', icon: require(`../../assets/IconsImage/fav.png`), component: Favourites, bwidth: '20%' },
        { id: 4, route: 'Profile', icon: require(`../../assets/IconsImage/profile.png`), component: Profile, bwidth: '20%' }

    ]
    const CustomTabbarButton = (props) => {
        const { item, onPress, accessibilityState } = props;
        const focused = accessibilityState.selected
        return (
            <View style={{ alignItems: 'center', width: item.bwidth, justifyContent: 'center' }}>
                {focused ?
                    <TouchableOpacity
                        style={styles.CustomButtonContainer}
                        onPress={onPress}
                    >
                        <Animated.View style={styles.btncircle} entering={ZoomIn} exiting={ZoomOut}>
                            <Image
                                source={item.icon}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: 'black'
                                }}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={styles.CustomButtonContainer2}
                        onPress={onPress}
                    >
                        <View style={styles.btn}>
                            <Image
                                source={item.icon}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: 'black'
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    }

    return (
        <Tab.Navigator
            initialRouteName='Homescreen'
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle:
                {
                    height: 60,
                    backgroundColor: '#00b894',
                }
            }}>
            {TabArr.map((item) => {
                return (
                    <Tab.Screen name={item.route} component={item.component} key={item.id}
                        options={{
                            tabBarButton: (props) => <CustomTabbarButton {...props} item={item} />
                        }}
                    />
                )
            })
            }

        </Tab.Navigator >
    )
}
const styles = StyleSheet.create({
    CustomButtonContainer: {
        top: -30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    CustomButtonContainer2: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    btncircle: {
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        elevation: 5,
    },
})