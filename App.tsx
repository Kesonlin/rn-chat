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

import {NativeBaseProvider, Box, Text, Button} from 'native-base';

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
    <NativeBaseProvider>
      <Navigate />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
