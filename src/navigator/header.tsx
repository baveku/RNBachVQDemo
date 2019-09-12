import React, { useState } from 'react';
import {
	Icon,
	IconKeys,
	shareTask,
	MaterialIcon,
	MaterialIconKeys,
	flashMessageAlert,
} from '../packages';
import { useNavigation } from 'react-navigation-hooks';
import { MainStackRouterName } from './nav';
import OctIcon from 'react-native-vector-icons/Octicons';
import { Colors } from '../theme';
import { useSelector } from 'react-redux';
import { selectNote, selectCategory } from '../core/modules';
import { View, ActivityIndicator, Clipboard } from 'react-native';
import Share from 'react-native-share';
import { shareCard } from '../functions';
export const ShareIcon = (props: { id: string }) => {
	const [loading, setLoading] = useState(false);
	const task = useSelector(selectNote(props.id));
	const category = useSelector(selectCategory(task.categoryId));
	const onPress = async () => {
		console.log(task);
		setLoading(true);

		try {
			const url = await shareCard({
				task,
				category,
				enableEditing: false,
			});
			Share.open({
				title: 'Share Card',
				url: url,
			})
				.then(openReturn => {
					// showAdmob()
				})
				.catch(err => {
					// flashMessage?Alert('ERROR', err.message);
				});
		} catch (err) {
			console.log(err);
			flashMessageAlert('Error', err.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<View
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				marginRight: 16,
			}}
		>
			{!loading ? (
				<Icon
					name={IconKeys.share}
					onPress={onPress}
					size={32}
					color={'white'}
				/>
			) : (
				<ActivityIndicator size={'small'} color={'white'} />
			)}
		</View>
	);
};

export const AddIcon = (props: { categoryId?: string; color?: string }) => {
	const { navigate } = useNavigation();
	const onPress = () =>
		navigate(MainStackRouterName.task, { categoryId: props.categoryId });
	return (
		<MaterialIcon
			name={MaterialIconKeys.plus}
			size={32}
			color={'white'}
			onPress={onPress}
			style={{ marginRight: 16 }}
		/>
	);
};

export const TaskSettingIcon = (props: { color: string }) => {
	const { navigate } = useNavigation();
	const pushToSetting = () => {
		navigate(MainStackRouterName.task_setting, { color: props.color });
	};
	return (
		<OctIcon
			size={32}
			onPress={pushToSetting}
			name={'settings'}
			color={!!props.color ? Colors.white : Colors.stormGray}
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				marginRight: 8,
			}}
		/>
	);
};
