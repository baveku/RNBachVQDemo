/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import "babel-polyfill";
console.disableYellowBox = true
AppRegistry.registerComponent(appName, () => App);
