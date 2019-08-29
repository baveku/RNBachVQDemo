import React, { useCallback, Fragment } from 'react';
import {
	View,
	StyleSheet,
	Text,
	SectionList,
	TouchableOpacity,
	AlertButton,
	Alert,
	StatusBar,
} from 'react-native';
import { Colors, Font, RED } from '../../theme';
import Icon from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from 'react-navigation-hooks';
import { MainStackRouterName } from '../../navigator';
import AsyncStorage from '@react-native-community/async-storage';
import { purgeStoredState } from 'redux-persist';
import { persistConfig } from '../../core';
import firebase from 'react-native-firebase';
import { BText } from '../components';

type SectionDataItem = { label: string; onAction?: any };
type Section = { title: string; data: string[] };

export function SettingScreen() {
	const { navigate } = useNavigation();

	const clearData = () => {
		const clean = () => {
			purgeStoredState(persistConfig);
			firebase.notifications().cancelAllNotifications();
			firebase.crashlytics().crash();
		};
		const alertButton: AlertButton[] = [
			{
				text: 'Reset App',
				style: 'destructive',
				onPress: clean,
			},
			{
				text: 'Cancel',
				style: 'cancel',
			},
		];

		Alert.alert(
			'Do you want to reset all data?',
			'Please backup data before resetting',
			alertButton
		);
	};

	const appItems: SectionDataItem[] = [
		{
			label: 'Sound',
			onAction: () => navigate(MainStackRouterName.settings.sound),
		},
		{
			label: 'Theme',
			onAction: () => navigate(MainStackRouterName.settings.theme),
		},
		// { label: 'Alert', onAction: () => {} },
	];

	const analysticItems: SectionDataItem[] = [
		{
			label: 'Backup',
			onAction: () => navigate(MainStackRouterName.settings.backup),
		},
		// { label: 'Analystic' },
	];

	const generateSection = (
		title: string,
		data: SectionDataItem[],
		renderItem: any
	) => {
		return { title, data: data.map(item => item.label), renderItem };
	};

	const termsAndServiceItems: SectionDataItem[] = [
		{ label: 'Policies' },
		{ label: 'Infomation' },
		{ label: 'Reset', onAction: clearData },
	];

	const sectionHeader = ({ section: { title } }: any) => {
		return <View style={{ marginTop: 20 }} />;
	};

	const ItemView = ({
		item,
		index,
	}: {
		item: SectionDataItem;
		index: number;
	}) => {
		const onPress = item.onAction ? item.onAction : () => {};
		return (
			<TouchableOpacity style={styles.item} onPress={onPress}>
				<View
					style={{
						width: '100%',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						{/* <Ionicons
							name={'ios-volume-high'}
							style={{
								backgroundColor: RED[500],
								borderRadius: 2,
								height: '80%',
								aspectRatio: 1,
								textAlign: 'center',
								textAlignVertical: 'center',
							}}
							color={'white'}
							size={24}
						/> */}
						<BText style={styles.text}>{item.label}</BText>
					</View>
					<Icon name={'chevron-right'} size={18} />
				</View>
			</TouchableOpacity>
		);
	};

	const renderAppSectionItem = ({ item, index, section }: any) => {
		const value = appItems[index];
		return (
			<ItemView
				item={value}
				index={index}
				key={value.label + `${index}`}
			/>
		);
	};

	const renderAnalysticSectionItem = ({ item, index, section }: any) => {
		const value = analysticItems[index];
		return (
			<ItemView
				item={value}
				index={index}
				key={value.label + `${index}`}
			/>
		);
	};

	const renderTermAndServicesSectionItem = ({
		item,
		index,
		section,
	}: any) => {
		const value = termsAndServiceItems[index];
		return (
			<ItemView
				item={value}
				index={index}
				key={value.label + `${index}`}
			/>
		);
	};

	const data: Section[] = [
		generateSection('App', appItems, renderAppSectionItem),
		generateSection(
			'Analystic',
			analysticItems,
			renderAnalysticSectionItem
		),
		generateSection(
			'Terms and Services',
			termsAndServiceItems,
			renderTermAndServicesSectionItem
		),
	];

	return (
		<Fragment>
			<StatusBar barStyle={'dark-content'} />
			<SectionList
				style={styles.sections}
				sections={data}
				renderSectionHeader={sectionHeader}
			/>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	sections: {
		flex: 1,
		paddingTop: 16,
		backgroundColor: Colors.primary,
	},
	item: {
		height: 48,
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.2)',
		paddingLeft: 16,
		paddingRight: 8,
	},
	text: {
		fontSize: Font.size.subTitle,
		marginLeft: 16,
	},
});
