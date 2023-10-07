/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// LogBox.ignoreLogs([/'In React 18'/]);
// LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);
