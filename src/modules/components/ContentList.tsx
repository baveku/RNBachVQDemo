import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
	View,
	Keyboard,
	TextInput,
	StyleSheet,
	FlatList,
	CheckBox,
	Text,
	TouchableOpacity,
	Alert,
	AlertButton,
} from 'react-native';
import {
	Icon,
	Checkbox,
	MaterialIcon,
	MaterialIconKeys,
	EntypoIcon,
} from '../../packages';
import { Colors, DELTAGREY } from '../../theme';
import _ from 'lodash';
import { CategoryItem, IContentItem } from '../../core/modules';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BText, BTextInput } from '.';

interface Props {
	data?: IContentItem[];
	onChangeData?(data: IContentItem[]): void;
	category?: CategoryItem;
}

export function ContentList(props: Props) {
	const list =
		!!props.data && props.data.length > 0
			? props.data
			: [{ text: '', isChecked: false }];
	const [type, setType] = useState(
		props.category || {
			id: 'shared',
			color: Colors.gradient.cyan_white[1],
			name: 'shared',
			numberOfItem: 0,
		}
	);

	const [data, setData] = useState(
		list.map((item, index) => ({ ...item, index }))
	);
	const listText = data.filter(item => item.isChecked == false);
	const listCheckedData = data.filter(item => item.isChecked);
	const color = type.color;

	const onAddTask = () => {
		const length = data.length;
		let newVal = [...data, { text: '', isChecked: false, index: length }];
		console.log(newVal);
		setData(newVal);
	};

    const onRemoveItem = (index: number) => {
        let val = [...data];
        const item = val.find(item => item.index === index)!;
		const remove = () => {
			console.debug(`Remove item: ${index}`);
			if (data.length > 1) {
                const indexs = val.indexOf(item)
                console.log('index: ', index)
				val.splice(indexs, 1);
            } else {
                item.text = ''
            }
                setData(val)
		};
		const alertButton: AlertButton[] = [
			{
				text: 'Delete',
				style: 'default',
				onPress: remove,
			},
			{
				text: 'Cancel',
				style: 'cancel',
			},
		];

		Alert.alert(
			`Confirm Action`,
			`Are you sure to remove item ${item.text}?`,
			alertButton
		);
	};

	const onChangeValue = (index: number, value: string) => {
		console.log(data, index);
		let val = [...data];
		if (!val.find(item => item.index === index))
			val.push({
				text: value,
				isChecked: false,
				index: val.length,
			});
		else val.find(item => item.index === index)!.text = value;
		setData(val);
	};

	const onPressChecked = (index: number, newVal: boolean) => {
		let val = [...data];
        val.find(item => item.index === index)!.isChecked = newVal;
        const filterNoneChecked = val.filter(item => item.isChecked === false)
        if (!(filterNoneChecked.length > 0)) val.push({index: val.length, text: '', isChecked: false})
		setData(val);
	};

	const toggleChecked = () => {
		const show = !showListCheckedItem;
		setshowListCheckedItem(show);
	};

	useEffect(() => {
		props.category && setType(props.category);
	}, [props.category]);

	useEffect(() => {
		props.onChangeData && props.onChangeData(data);
	}, [data]);

	const [showListCheckedItem, setshowListCheckedItem] = useState(true);

	const renderItem = ({ item, index }: any) => (
		<FieldItem
			color={color}
			index={index}
			item={item}
			onChangeValue={onChangeValue}
			onPressChecked={onPressChecked}
			onRemoveItem={onRemoveItem}
		/>
	);

	return (
		<KeyboardAwareScrollView style={styles.container}>
			<FlatList
				style={styles.flatlist}
				data={listText}
				renderItem={renderItem}
				keyExtractor={(item, index) => `_id${index + 1}`}
			/>
			<TouchableOpacity
				style={styles.headerView}
				onPress={onAddTask}
				activeOpacity={0.8}
			>
				<Ionicons
					name={'ios-add-circle'}
					color={DELTAGREY[500]}
                    size={20}
                    style={{textAlignVertical: 'center'}}
				/>
				<BText
					style={{ fontWeight: 'bold', color: DELTAGREY[500] }}
				>{` Add Item`}</BText>
			</TouchableOpacity>
			{listCheckedData.length > 0 && (
				<View>
					<View style={styles.line} />
					<TouchableOpacity
						style={styles.numberCheckedButton}
						onPress={toggleChecked}
					>
						<Text>
							<Ionicons
								name={
									showListCheckedItem
										? 'ios-arrow-down'
										: 'ios-arrow-up'
								}
								size={18}
							/>
							{` ${listCheckedData.length} checked item`}
						</Text>
					</TouchableOpacity>
					{showListCheckedItem && (
						<FlatList
							style={styles.flatlist}
							data={listCheckedData}
							renderItem={renderItem}
							keyExtractor={(item, index) =>
								`_id${index + 1}_${item.index}`
							}
						/>
					)}
				</View>
			)}
		</KeyboardAwareScrollView>
	);
}

const FieldItem = (props: {
	item: any;
	index: number;
	color: string;
	onRemoveItem: any;
	onPressChecked: any;
	onChangeValue: any;
}) => {
	const {
		item,
		index,
		onRemoveItem,
		onChangeValue,
		onPressChecked,
		color,
	} = props;
	const onRemove = () => {
		console.log(`Removed ${index}`);
		onRemoveItem(item.index);
	};

	const toggleCheck = () => {
		onPressChecked(item.index, !item.isChecked);
	};

	const onChangeText = (val: string) => {
		onChangeValue(item.index, val);
	};

	return (
		<View
			style={styles.item}
			key={`_id${index}`}
			// onPress={onFocus}
			// onPressOut={onEndFocus}
		>
			<Checkbox
				isSelected={item.isChecked}
				onPress={toggleCheck}
				color={!item.isChecked ? color : undefined}
			/>
			<BTextInput
				multiline
				// ref={inputRef}
				maxLength={250}
				style={[
					styles.textInput,
					item.isChecked && {
						textDecorationLine: 'line-through',
					},
				]}
				defaultValue={item.text}
				onChangeText={onChangeText}
				placeholder={'Enter content item'}
			/>
			{/* {focus && ( */}
			<MaterialIcon
				onPress={onRemove}
				color={!item.isChecked ? color : undefined}
				name={MaterialIconKeys.delete_outline}
				size={24}
				style={{ textAlignVertical: 'center' }}
			/>
			{/* )} */}
		</View>
	);
};

const styles = StyleSheet.create({
	flatlist: {
		marginTop: 8,
		width: '100%',
	},
	container: {
		borderTopColor: 'rgba(0,0,0,0.2)',
		borderTopWidth: 1,
        paddingTop: 16,
        marginTop: 8
	},
	headerView: {
		paddingLeft: 16,
        paddingRight: 16,
        marginTop: 12,
        height: 32,
        // backgroundColor: 'rgba(0,0,0,0.12)',
		justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
	},
	item: {
		marginLeft: 8,
		marginRight: 8,
		minHeight: 24,
		flexDirection: 'row',
		marginBottom: 2,
		marginTop: 2,
		justifyContent: 'center',
	},
	textInput: {
		flex: 1,
		height: '100%',
		paddingLeft: 8,
		paddingRight: 8,
	},
	addButton: {
		height: '100%',
		width: 80,
		marginLeft: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	numberCheckedButton: {
		justifyContent: 'center',
		margin: 4,
		marginLeft: 8,
	},
	line: {
		marginTop: 24,
		height: 1,
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
});
