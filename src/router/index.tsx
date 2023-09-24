import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Box, Text, Button} from 'native-base';
import {View} from 'react-native';
import Message from '../pages/Message';
import Login from '../pages/Login';

function SettingsScreen() {
  return (
    <View>
      <Text>Settings!</Text>
    </View>
  );
}
const Tab = createBottomTabNavigator();
export default function Navigate(): JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="登录" component={Login} />
        <Tab.Screen name="消息" component={Message} />
        <Tab.Screen name="联系人" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
