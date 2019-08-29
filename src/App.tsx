/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState, useCallback } from 'react';

import AppContainer from './navigator';
import { Provider, useDispatch, useStore, useSelector } from 'react-redux';
import {
	persistor,
	store,
	setupPushNotification,
	FirebaseDatabase,
} from './core';
import { PersistGate } from 'redux-persist/integration/react';
import FlashMessage from 'react-native-flash-message';
import { IRootState, RootActionKeys } from './core/types';
import _ from 'lodash';
import { View, AppState, Linking } from 'react-native';
import { TaskActionKeys, TaskyShare, selectAllTask } from './core/modules';
import { Firebase } from 'react-native-firebase';
function App() {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<AppDelegate>
					<AppContainer />
				</AppDelegate>
			</PersistGate>
			<FlashMessage position={'bottom'} />
		</Provider>
	);
}

function AppDelegate(props: { children: any }) {
	const dispatch = useDispatch();
	const store = useStore();
	console.log(store.getState());
	const shareIds = useSelector((state: IRootState) =>
		_.map(state.task.sharedItems, (val, key) => key)
	);
	const rootIds = useSelector(selectAllTask);

	const updateRootCard = useCallback(
		(payload: TaskyShare) => {
			const payloadData = {
				id: payload.id,
				title: payload.title,
				updatedAt: payload.updatedAt,
				content: payload.content,
				enableAlert: payload.enableAlert,
				alertOptions: payload.alertOptions,
			};
			dispatch({ type: TaskActionKeys.update, payload: payloadData });
		},
		[dispatch]
	);

	const onRestoreState = useCallback(
		(payload: IRootState) =>
			dispatch({ type: RootActionKeys.restore, payload }),
		[dispatch]
	);

	const updateShareTask = useCallback(
		(payload: any) =>
			dispatch({
				type: TaskActionKeys.updateShareTask,
				payload: payload,
			}),
		[dispatch]
	);

	const removeShareTask = useCallback(
		(id: string) =>
			dispatch({
				type: TaskActionKeys.removeShareTask,
				payload: { id },
			}),
		[dispatch]
	);

	const _handleDeeplink = (event: { url: string }) => {
		FirebaseDatabase.getInstance().handleDeeplink(event.url);
		FirebaseDatabase.getInstance().handleDeeplinkRestore(event.url);
	}

	useEffect(() => {
		console.log('re_render');
		setupPushNotification();
		FirebaseDatabase.getInstance().onStartApp(shareIds, rootIds, {
			rootDispatch: {
				update: updateRootCard,
				remove: () => {},
			},
			shareDispatch: {
				update: updateShareTask,
				remove: removeShareTask,
			},
			appDispatch: {
				restore: onRestoreState
			}
		});

		Linking.addEventListener('url', _handleDeeplink);
		return () => {
			Linking.removeListener('url', _handleDeeplink)
		}
	}, []);
	return <View style={{ flex: 1 }}>{props.children}</View>;
}

export default App;
