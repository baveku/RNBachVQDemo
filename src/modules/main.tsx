import React, { Component, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	Dimensions,
	StatusBar,
} from 'react-native';
import { Colors } from '../theme/color';
import { CatogryList } from './components';
import { useStore, useSelector, useDispatch } from 'react-redux';
import { setupPushNotification, FirebaseDatabase } from '../core';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SearchScreen } from './screens';
import { useNavigation, useNavigationParam, useNavigationState } from 'react-navigation-hooks';
interface Props { }

const SEACH_HEIGHT = Dimensions.get('screen').height * 90 / 100;

export default function MainScreen(props: Props) {
	let searchShowRef = useRef<RBSheet>(null)
	const { setParams } = useNavigation()
	const {params} = useNavigationState()

	const SearchView = () => {
		return <SearchScreen onSelectedItem={onHide} />;
	}

	const onShow = () => {
		searchShowRef && searchShowRef.current && searchShowRef.current.open()
	}

	const onHide = () => {
		searchShowRef &&
			searchShowRef.current &&
			searchShowRef.current.close();
	}

	useEffect(() => {
		setParams({...params, onPressSearch: onShow})
	}, [])

    return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" />
			<CatogryList />
			<RBSheet
				ref={searchShowRef}
				animationType={'fade'}
				customStyles={{ container: styles.bottomSheet }}
				height={SEACH_HEIGHT}
				duration={250}
				closeOnDragDown
				closeOnPressMask
			>
				<SearchView />
			</RBSheet>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		width: 120,
		height: 40,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.dodgerBlue,
		marginBottom: 20,
		marginTop: 20,
	},
	flatlist: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	flatItem: {
		height: 80,
	},
	taskTitle: {
		flexDirection: 'row',
	},
	bottomSheet: {
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
});
