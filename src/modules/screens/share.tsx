import React, { useEffect, useState, useRef, Fragment } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	TouchableWithoutFeedback,
	SafeAreaView,
	TextInput,
	Switch,
	Picker,
	Platform,
	StatusBar,
	Alert,
} from 'react-native';
import { useNavigation, useNavigationState } from 'react-navigation-hooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _, { debounce } from 'lodash';
import { ContentList, PickerDate, BText, BTextInput } from '../components';
import { Colors, Font } from '../../theme';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { IContentItem, useActionTask, selectShare } from '../../core/modules';
import { Icon, MaterialIcon } from '../../packages';
import firebase, { Firebase } from 'react-native-firebase';
import { FirebaseDatabase } from '../../core';
import RBSheet from 'react-native-raw-bottom-sheet';

export function ShareScreen() {
	const { goBack, setParams } = useNavigation();
	const { params } = useNavigationState();
	const item = useSelector(selectShare(params.id));
	const [currentItem, setItem] = useState(() => item);
	const [title, setTitle] = useState(currentItem.title);
	const [desc, setDesc] = useState(currentItem.content);
	const [isUrgent, onSwitchUrgent] = useState(currentItem.isUrgent);
	const [dateTime, setDateTime] = useState(currentItem.alertOptions.date);
	const [repeat, setRepeating] = useState(
		currentItem.alertOptions.repeat
	);
	const [enableAlert, setEnableAlert] = useState(currentItem.enableAlert);

	const [isVisibleDate, setIsVisibleDate] = useState(false);
	let rbSheetRef = useRef<RBSheet>(null);
	let alertSheetRef = useRef<RBSheet>(null);

	const toggleUrgent = (val: boolean) => {
		onSwitchUrgent(val);
	};

	const onChangeTitle = (str: string) => {
		setTitle(str);
	};

	const onChangeDesc = (newList: IContentItem[]) => setDesc(newList);
	const debounce = _.debounce(onChangeTitle, 500);

    useEffect(() => {
        setParams({...params, color: currentItem.category.color})
    }, [])

	useEffect(() => {
		item && item.id && setItem(item);
	}, [item]);

	const getDayOfWeek = () => moment(dateTime).format('HH:mm / ddd, DD MMM');

	const _onChangeDate = (newTime: number) => {
		setDateTime(newTime);
	};
	const _onToggleDate = (val: boolean) => {
		setIsVisibleDate(val);
    };
    
    const _onShowDate = () => {
		alertSheetRef.current!.close();
		setTimeout(() => setIsVisibleDate(true), 300);
	};

	const openBottom = () => {
		rbSheetRef.current && rbSheetRef.current.open();
	};

	const openAlertSheet = () => {
		alertSheetRef.current && alertSheetRef.current.open();
    };

    const SettingOptionsView = () => {
		return (
			<Fragment>
				<Text
					style={{
						margin: 8,
						fontSize: 18,
						textAlign: 'center',
					}}
				>
					Settings
				</Text>
				<TouchableOpacity
					style={styles.optionView}
					// onPress={onSelectType}
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
										color: currentItem.category.color,
									},
								]}
							>
								{_.startCase(currentItem.category.name)}
							</BText>
							<Icon
								name={'chevron-right'}
								size={18}
								style={{ textAlignVertical: 'center' }}
							/>
						</View>
					</View>
				</TouchableOpacity>
				{/* <View style={styles.urgentView}>
					<Text>Mark as Urgent</Text>
					<Switch
						trackColor={{
							false: Colors.white,
							true: currentItem.category.color,
						}}
						tintColor={'rgba(0,0,0,0.1)'}
						value={isUrgent}
						onValueChange={toggleUrgent}
					/>
				</View> */}
			</Fragment>
		);
    };

    const onChangeEnableAlert = (val: boolean) => setEnableAlert(val);

	const AlertOptionView = () => {
		return (
			<Fragment>
				<BText defaultSize={18}
					style={{ margin: 8, fontSize: 18, textAlign: 'center' }}
				>
					Alert Setting
				</BText>
				<View style={styles.urgentView}>
					<BText>Enable Alert</BText>
					<Switch
						trackColor={{
							false: Colors.white,
							true: currentItem.category.color,
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
										{ color: currentItem.category.color },
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
    
	const onTaskDone = () => {
		const remove = () => {
			goBack();
			FirebaseDatabase.getInstance().offListener(
				currentItem.id
			);
		}
		const alertButton: AlertButton[] = [
			{
				text: 'Done',
				style: 'default',
				onPress: () => remove(),
			},
			{
				text: 'Cancel',
				style: 'cancel',
			},
		];
		const isCompleteAllTak =
			desc.filter(item => !item.isChecked) !== [];
		const message = isCompleteAllTak
			? 'There is still some unfinished content.'
			: 'Everything is complete.';
		Alert.alert(
			'Are you sure you want to close this task?',
			message,
			alertButton
		);
		
	};

	useEffect(() => {
		const cache = {
			title: title,
			isUrgent: isUrgent,
            content: desc,
            alertOptions: {
                date: dateTime
            },
            category: currentItem.category,
            enableAlert: enableAlert,
		};
		console.log(cache);
		firebase
			.database()
			.ref('Notes')
			.child(currentItem.id)
			.update(cache);
	}, [title, isUrgent, desc, dateTime, enableAlert]);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle={'light-content'} />
			<KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
				<View style={styles.detailView}>
					<BTextInput
						// editable={false}
						defaultSize={Font.size.title}
						style={styles.textInput}
						multiline
						onChangeText={debounce}
						placeholder={'Enter checklist title'}
						defaultValue={title}
					/>
					<ContentList data={desc} onChangeData={onChangeDesc} />
				</View>
			</KeyboardAwareScrollView>
			<View style={styles.bottomView}>
				<TouchableOpacity
					style={[
						styles.addButton,
						{ backgroundColor: currentItem.category.color },
					]}
					onPress={onTaskDone}
				>
					<BText
						style={[styles.addTitle]}
						defaultSize={Font.size.content}
					>
						{'Close'}
					</BText>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					style={[
						styles.smalButton,
						enableAlert && {
							backgroundColor: Colors.texasRose,
						},
					]}
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
	},
});