import React from 'react';
import {
	createAppContainer,
	createStackNavigator,
	NavigationScreenOptions,
	NavigationScreenOption,
} from 'react-navigation';
import MainScreen from '../modules/main';
import { Colors } from '../theme/color';
import {
	SearchScreen,
	SettingScreen,
	ShareScreen,
	TaskScreen,
	TaskGroupScreen,
	CategoryScreen,
    ShareGroupScreen,
} from '../modules/screens';
import { MainStackRouterName, ShareStackRouterName } from './nav';
import { MainNavOptions } from '../modules/components/MainHeader';
import { Easing, Animated, View } from 'react-native';
import { SelectOptionsScreen } from '../modules/screens/selectoptions';
import { ShareIcon, AddIcon, TaskSettingIcon } from './header';
import _ from 'lodash';
import { ThemeScreen } from '../modules/screens/settings/theme';
import { SoundScreen } from '../modules/screens/settings/sound';
import { BackupScreen } from '../modules/screens/settings/backup';
import { GREY } from '../theme';

const headerStyle = {
	headerTitleStyle: {
		color: GREY[900],
		alignSelf: 'center',
		textAlign: 'center',
		flex: 1,
	},
	headerRight: <View />,
	headerStyle: {
		// backgroundColor: GREY[900],
	},
	// headerTintColor: 'white',
};

const MainStack = createStackNavigator(
	{
		[MainStackRouterName.main]: {
			screen: MainScreen,
			navigationOptions: MainNavOptions,
		},
		[MainStackRouterName.search]: {
			screen: SearchScreen,
			navigationOptions: {
				title: 'Search',
				...headerStyle,
			},
		},
		[MainStackRouterName.setting]: {
			screen: SettingScreen,
			navigationOptions: {
				title: 'Settings',
				...headerStyle,
			},
		},
		[MainStackRouterName.task]: {
			screen: TaskScreen,
			navigationOptions: ({ navigation }: any) => {
				const { params } = navigation.state;
				const color = !!params.color ? params.color : 'white';
				return {
					title: 'Note',
					...headerStyle,
					headerStyle: {
						backgroundColor: color,
					},
					headerTintColor: 'white',
					headerTitleStyle: {
						...headerStyle.headerTitleStyle,
						color: 'white',
					}
				};
			},
		},
		[MainStackRouterName.group]: {
			screen: TaskGroupScreen,
			navigationOptions: ({ navigation }: any) => {
				const { params } = navigation.state;
				const { title, color } = params;
				return {
					title: _.startCase(title || ''),
					headerRight:
						params && params.categoryId ? (
							<AddIcon categoryId={params.categoryId} />
						) : (
							<View />
						),
					headerStyle: {
						backgroundColor: color || 'white',
					},
					headerTitleStyle: {
						color: 'white',
						alignSelf: 'center',
						textAlign: 'center',
						flex: 1,
					},
					headerTintColor: 'white',
				};
			},
		},
		[MainStackRouterName.select]: {
			screen: SelectOptionsScreen,
			navigationOptions: ({ navigation }: any) => {
				const { params } = navigation.state;
				return {
					title: params.title || 'Select Options',
					...headerStyle,
				};
			},
		},
		[MainStackRouterName.info]: {
			screen: TaskScreen,
			navigationOptions: ({ navigation }: any) => {
				const { params } = navigation.state;
				const {
					color = Colors.white,
					title = '',
					noteId = '',
				} = params;
				return {
					title: title,
					headerRight: <ShareIcon id={noteId} />,
					headerStyle: {
						backgroundColor: color,
					},
					headerTitleStyle: {
						color: 'white',
						alignSelf: 'center',
						textAlign: 'center',
						flex: 1,
					},
					headerTintColor: 'white',
				};
			},
		},
		[MainStackRouterName.add_category]: {
			screen: CategoryScreen,
			navigationOptions: {
				title: 'Category',
				...headerStyle,
			},
		},
		[MainStackRouterName.shareTaskInfo]: {
			screen: ShareScreen,
			navigationOptions: ({ navigation }: any) => {
				const { params } = navigation.state;
				const { color } = params;
				return {
					title: 'Shared',
					headerRight: <View />,
					headerStyle: {
						backgroundColor: color
							? color
							: Colors.gradient.cyan_white[1],
					},
					headerTitleStyle: {
						color: 'white',
						alignSelf: 'center',
						textAlign: 'center',
						flex: 1,
					},
					headerTintColor: 'white',
				};
			},
		},
		[MainStackRouterName.shareGroup]: {
			screen: ShareGroupScreen,
			navigationOptions: {
				title: 'All Shared',
				headerRight: <View />,
				headerStyle: {
					backgroundColor: Colors.gradient.cyan_white[1],
				},
				headerTitleStyle: {
					color: 'white',
					alignSelf: 'center',
					textAlign: 'center',
					flex: 1,
				},
				headerTintColor: 'white',
			},
		},
		[MainStackRouterName.settings.theme]: {
			screen: ThemeScreen,
			navigationOptions: {
				title: 'Theme',
				...headerStyle,
			},
		},
		[MainStackRouterName.settings.sound]: {
			screen: SoundScreen,
			navigationOptions: {
				title: 'Sound',
				...headerStyle,
			},
		},
		[MainStackRouterName.settings.backup]: {
			screen: BackupScreen,
			navigationOptions: {
				title: 'Backup',
				...headerStyle,
			},
		},
	},
	{ initialRouteName: MainStackRouterName.main }
);

const ShareStackModal = createStackNavigator(
	{
		main: {
			screen: ShareScreen,
			navigationOptions: {
				header: null,
			},
		},
	},
	{
		initialRouteName: 'main',
		transparentCard: true,
	}
);

const AppNavigator = createStackNavigator(
	{
		main: MainStack,
		[ShareStackRouterName.default]: ShareStackModal,
	},
	{
		headerMode: 'none',
		mode: 'modal',
		initialRouteName: 'main',
		transparentCard: true,
		cardStyle: {
			opacity: 1,
		},
		transitionConfig: () => ({
			transitionSpec: {
				duration: 750,
				easing: Easing.out(Easing.poly(4)),
				timing: Animated.timing,
				useNativeDriver: true,
			},
			screenInterpolator: sceneProps => {
				const { layout, position, scene } = sceneProps;
				const thisSceneIndex = scene.index;

				const height = layout.initHeight;
				const translateY = position.interpolate({
					inputRange: [
						thisSceneIndex - 1,
						thisSceneIndex,
						thisSceneIndex + 1,
					],
					outputRange: [height, 0, 0],
				});

				const opacity = position.interpolate({
					inputRange: [
						thisSceneIndex - 1,
						thisSceneIndex,
						thisSceneIndex + 1,
					],
					outputRange: [1, 0.5, 0.5],
				});

				return { opacity, transform: [{ translateY }] };
			},
		}),
	}
);

export default createAppContainer(AppNavigator);
export * from './nav';
export * from 'react-navigation';
