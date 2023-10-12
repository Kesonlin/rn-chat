import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Box, Text, Button} from 'native-base';
import {View} from 'react-native';
import Message from '../pages/Message';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Chat from '../pages/Chat';

const MessageStack = createNativeStackNavigator();

function MessageStackScreen() {
  return (
    <MessageStack.Navigator>
      <MessageStack.Screen name="center" component={Message} />
      <MessageStack.Screen
        name="chat"
        component={Chat}
        options={({route}: {[key: string]: any}) => ({
          title: route.params.frends?.userName,
        })}
      />
      <MessageStack.Screen name="login" component={Login} />
      <MessageStack.Screen name="register" component={Register} />
    </MessageStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
export default function Navigate(): JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="message" component={MessageStackScreen} />
        <Tab.Screen name="home" component={Home} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
