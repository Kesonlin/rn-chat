/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NativeBaseProvider} from 'native-base';
import {GluestackUIProvider, Text} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';

import {request} from './src/network';
import Navigate from './src/router';

function App(): JSX.Element {
  console.log(11);

  // useEffect(() => {

  // }, []);

  const send = () => {
    request('/user')
      .then(res => {
        // console.log(res.json());
        console.log(res.data);
      })
      .catch(e => {
        console.log('error', e);
      });
  };

  return (
    <GluestackUIProvider config={config}>
      <NativeBaseProvider>
        <Navigate />
      </NativeBaseProvider>
    </GluestackUIProvider>
  );
}

export default App;
