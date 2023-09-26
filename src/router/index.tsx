import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Box, Text, Button} from 'native-base';
import {View} from 'react-native';
import Message from '../pages/Message';
import Login from '../pages/Login';
import Register from '../pages/Register';

const MessageStack = createNativeStackNavigator();

function MessageStackScreen() {
  return (
    <MessageStack.Navigator>
      <MessageStack.Screen name="message1" component={Message} />
      <MessageStack.Screen name="login" component={Login} />
      <MessageStack.Screen name="register" component={Register} />
    </MessageStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
export default function Navigate(): JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="message" component={MessageStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
