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
import Moments from '../pages/Moments';

const MessageStack = createNativeStackNavigator();

function MessageStackScreen() {
  return (
    <MessageStack.Navigator>
      <MessageStack.Screen
        name="center"
        component={Message}
        options={{
          title: 'chat',
          headerTitleAlign: 'center',
          // headerShown: false,
          headerStyle: {
            backgroundColor: '#67e8f9',
          },
        }}
      />
      <MessageStack.Screen
        name="chat"
        component={Chat}
        options={({route}: {[key: string]: any}) => ({
          title: route.params.frends?.userName,
          headerTitleAlign: 'center',
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
        <Tab.Screen name="moments" component={Moments} />
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
