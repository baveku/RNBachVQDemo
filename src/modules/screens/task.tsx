import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Switch,
	SafeAreaView,
	AlertButton,
	Alert,
	Platform,
    InteractionManager,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Colors, Font, Color } from '../../theme';
import { Icon, flashMessageAlert, MaterialIcon } from '../../packages';
import { useNavigation, useNavigationState } from 'react-navigation-hooks';
import { MainStackRouterName } from '../../navigator';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ContentList, PickerDate } from '../components';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
	selectCategory,
	Tasky,
	selectAllCategory,
	defaultTasky,
	useActionTask,
	selectNote,
	IContentItem,
} from '../../core/modules';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import { RepeatType } from 'react-native-push-notification';
import firebase from 'react-native-firebase';
import { BText } from '../components/BText';
import { showAdmob } from '../../functions';

export function TaskScreen() {
	const { navigate, setParams, goBack, replace } = useNavigation();
    const { params } = useNavigationState();
    const isEditing = params && params.noteId;
	const item =
		params && params.noteId
			? useSelector(selectNote(params.noteId))
			: defaultTasky(params.categoryId);
	const [currentItem, setItem] = useState(item);

	const allCategory = useSelector(selectAllCategory);
	const categoryItem = useSelector(
		selectCategory(
			currentItem.categoryId !== ''
				? currentItem.categoryId
				: allCategory[0].id
		)
	);

	useEffect(() => {
		// showAdmob()
	}, [])

	const [onUpdate, onRemove] = useActionTask(currentItem.id);

	const [title, setTitle] = useState(currentItem.title);
	const [desc, setDesc] = useState(currentItem.content);
	const [isUrgent, onSwitchUrgent] = useState(currentItem.isUrgent);
	const [taskType, onChangeType] = useState(categoryItem);
	const [dateTime, setDateTime] = useState(currentItem.alertOptions.date);
	const [repeat, setRepeating] = useState(currentItem.alertOptions.repeat);
    const [enableAlert, setEnableAlert] = useState(currentItem.enableAlert);

    const [isVisibleDate, setIsVisibleDate] = useState(false);

	let rbSheetRef = useRef<RBSheet>(null);
	let alertSheetRef = useRef<RBSheet>(null);

	const toggleUrgent = (val: boolean) => {
		onSwitchUrgent(val);
	};

    const setTaskType = (index: number) => {
        const newVal = allCategory[index];
        flashMessageAlert('Successfully', `From: ${categoryItem.name}\n to: ${newVal.name}`)
		onChangeType(newVal);
	};

	const onChangeRepeat = (val: RepeatType | undefined) => {
		setRepeating(val === repeat ? undefined : val);
    };
    
    const onChangeEnableAlert = (val: boolean) => setEnableAlert(val);

	const openBottom = () => {
		rbSheetRef.current && rbSheetRef.current.open();
	};

	const openAlertSheet = () => {
		alertSheetRef.current && alertSheetRef.current.open();
    };

    const onSelectType = () => {
        rbSheetRef.current!.close()
        InteractionManager.runAfterInteractions(() => {
            const data = allCategory.map(item => ({
				label: item.name,
				color: item.color,
			}));
			navigate(MainStackRouterName.select, {
				title: 'Selected Category',
				data,
				onSelected: setTaskType,
			});
        })
    };

	const onChangeTitle = (str: string) => {
		setTitle(str);
	};

	const onChangeDesc = (newList: IContentItem[]) => setDesc(newList);
	const debounce = _.debounce(onChangeTitle, 500);

	useEffect(() => {
		setParams({ ...params, color: taskType.color, title: taskType.name });
	}, [taskType]);

	const getDayOfWeek = () => moment(dateTime).format('HH:mm / ddd, DD MMM');

	const _onChangeDate = (newTime: number) => {
		setDateTime(newTime);
    };
    
	const _onToggleDate = (val: boolean) => {
		setIsVisibleDate(val);
    };
    
    const _onShowDate = () => {
        alertSheetRef.current!.close()
        InteractionManager.runAfterInteractions(() => {
            setIsVisibleDate(true);
        });
    };

	const SettingOptionsView = () => {
		return (
			<Fragment>
				<BText
					style={{
						margin: 8,
						fontSize: 18,
						textAlign: 'center',
					}}
				>
					Settings
				</BText>
				<TouchableOpacity
					style={styles.optionView}
					onPress={onSelectType}
				>
					<View
						style={{
							width: '100%',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							paddingLeft: 8,
							paddingRight: 8,
						}}
					>
						<BText>Type</BText>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<BText
								defaultSize={Font.size.subTitle}
								style={[
									styles.text,
									{
										color: taskType.color,
									},
								]}
							>
								{_.startCase(taskType.name)}
							</BText>
							<Icon
								name={'chevron-right'}
								size={18}
								style={{ textAlignVertical: 'center' }}
							/>
						</View>
					</View>
				</TouchableOpacity>
				<View style={styles.urgentView}>
					<BText>Mark as Urgent</BText>
					<Switch
						trackColor={{
							false: Colors.white,
							true: taskType.color,
						}}
						tintColor={'rgba(0,0,0,0.1)'}
						value={isUrgent}
						onValueChange={toggleUrgent}
					/>
				</View>
			</Fragment>
		);
	};

	const AlertOptionView = () => {
		return (
			<Fragment>
				<BText style={{ margin: 8, textAlign: 'center' }} defaultSize={18}>Alert Setting</BText>
				<View style={styles.urgentView}>
					<BText>Enable Alert</BText>
					<Switch
						trackColor={{
							false: Colors.white,
							true: taskType.color,
						}}
						tintColor={'rgba(0,0,0,0.1)'}
						value={enableAlert}
						onValueChange={onChangeEnableAlert}
					/>
				</View>
				{enableAlert && (
					<TouchableOpacity
						style={styles.optionView}
						onPress={_onShowDate}
					>
						<View
							style={{
								width: '100%',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								paddingLeft: 8,
								paddingRight: 8,
							}}
						>
							<BText>DateTime</BText>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<BText
									defaultSize={Font.size.subTitle}
									style={[
										styles.text,
										{ color: taskType.color },
									]}
								>
									{`${getDayOfWeek()}`}
								</BText>
								<Icon
									name={'chevron-right'}
									size={18}
									style={{
										textAlignVertical: 'center',
									}}
								/>
							</View>
						</View>
					</TouchableOpacity>
				)}
			</Fragment>
		);
	};

	useEffect(() => {
        isEditing && title && onUpdateTask();
    }, [title, isUrgent, taskType, desc, dateTime, enableAlert, repeat]);
    
    const onUpdateTask = () => {
        const cache = {
			id: currentItem.id,
			title: title,
			isUrgent: isUrgent,
			content: desc,
			categoryId: taskType.id,
			enableAlert: enableAlert,
			alertOptions: {
				date: dateTime,
				repeat,
			},
		};
        onUpdate(cache);
        !isEditing && setTimeout(() => {
            flashMessageAlert(`${title} has added to storage`)
            replace(MainStackRouterName.info, { noteId: currentItem.id, color: taskType.id, title: taskType.name })
        }, 300)
    }

	const onTaskDone = () => {
		const alertButton: AlertButton[] = [
			{
				text: 'Done',
				style: 'default',
				onPress: () => onRemove(),
			},
			{
				text: 'Cancel',
				style: 'cancel',
			},
		];
		const isCompleteAllTak = desc.filter(item => !item.isChecked) !== [];
		const message = isCompleteAllTak
			? 'There is still some unfinished content.'
			: 'Everything is complete.';
		Alert.alert(
			'Are you sure you want to close this task?',
			message,
			alertButton
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
				<View style={styles.detailView}>
					<TextInput
						editable
						multiline
						style={styles.textInput}
						onChangeText={debounce}
						placeholder={'Enter checklist title'}
						defaultValue={title}
					/>
					<ContentList
						category={taskType}
						data={desc}
						onChangeData={onChangeDesc}
					/>
				</View>
			</KeyboardAwareScrollView>
			<View style={styles.bottomView}>
				<TouchableOpacity
					style={[
						styles.addButton,
						{ backgroundColor: taskType.color },
					]}
					onPress={
						isEditing ? onTaskDone : onUpdateTask
					}
				>
					<Text style={[styles.addTitle]}>
						{isEditing ? 'Close' : 'Add'}
					</Text>
				</TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
					style={[styles.smalButton, enableAlert && {backgroundColor: Colors.texasRose}]}
					onPress={openAlertSheet}
				>
					<MaterialIcon
						name={'bell-ring'}
						size={18}
						color={enableAlert ? 'white' : Colors.stormGray}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.smalButton]}
					onPress={openBottom}
				>
					<MaterialIcon
						name={'dots-horizontal'}
						size={18}
						color={Colors.stormGray}
					/>
				</TouchableOpacity>
			</View>
			<PickerDate
				onUpdateTime={_onChangeDate}
				time={dateTime}
				isVisible={isVisibleDate}
				onSetVisible={_onToggleDate}
			/>
			<RBSheet
				ref={rbSheetRef}
				animationType={'fade'}
				customStyles={{ container: styles.bottomSheet }}
				height={300}
				duration={250}
				closeOnDragDown
				closeOnPressMask
			>
				<SettingOptionsView />
			</RBSheet>
			<RBSheet
				ref={alertSheetRef}
				animationType={'fade'}
				customStyles={{ container: styles.bottomSheet }}
				height={300}
                duration={250}
				closeOnDragDown
				closeOnPressMask
			>
				<AlertOptionView />
			</RBSheet>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	titleView: {
		minHeight: 60,
		padding: 4,
		backgroundColor: 'white',
		borderRadius: 8,
	},
	descView: {
		marginTop: 8,
		height: 80,
		backgroundColor: 'white',
		borderRadius: 8,
	},
	dateView: {
		flexDirection: 'row',
		marginTop: 8,
		height: 80,
		backgroundColor: 'white',
		borderRadius: 8,
	},
	dateChild: {
		flex: 1,
		margin: 8,
		alignItems: 'center',
	},
	dateTitleButton: {
		color: Colors.mayaBlue,
		fontSize: 16,
		fontWeight: '700',
	},
	dateBtn: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	optionView: {
		height: 40,
		borderRadius: 8,
		marginTop: 8,
		backgroundColor: Colors.white,
		justifyContent: 'center',
	},
	fill: {
		flex: 1,
		padding: 8,
	},
	text: {
		fontSize: Font.size.subTitle,
		paddingLeft: 32,
		fontWeight: '700',
	},
	bottomView: {
		height: 56,
		paddingTop: 16,
		marginLeft: 16,
        marginRight: 16,
        marginBottom: 8,
		alignItems: 'center',
		flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopColor: 'rgba(0,0,0,0.5)',
        borderTopWidth: 1,
	},
	addButton: {
		flex: 0.9,
		height: '100%',
		borderRadius: 4,
		backgroundColor: Colors.mayaBlue,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addTitle: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: '700',
		width: '100%',
		textAlign: 'center'
	},
	urgentView: {
		height: 40,
		marginTop: 8,
		padding: 8,
		borderRadius: 8,
		backgroundColor: Colors.white,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	label: {
		paddingLeft: 8,
		paddingTop: 4,
		textDecorationLine: 'underline',
		textDecorationStyle: 'dotted',
	},
	viewLabel: {
		color: 'rgba(0,0,0,0.4)',
	},
	detailView: {
		flex: 1,
		marginTop: 8,
		// borderRadius: 8,
		// borderBottomColor: 'rgba(0,0,0,0.4)',
		// borderBottomWidth: 1,
	},
	textInput: {
		fontSize: Font.size.title,
		fontWeight: '700',
		backgroundColor: 'white',
		textAlignVertical: 'center',
		padding: 8,
	},
	textInputContent: {
		fontSize: Font.size.content,
		fontWeight: '500',
	},
	smalButton: {
		width: 48,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 6,
		backgroundColor: 'rgba(0,0,0,0.12)',
    },
    bottomSheet: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    }
});
