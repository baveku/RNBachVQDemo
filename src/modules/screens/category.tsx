import React, { useState, useEffect, useRef } from 'react';
import {
	SafeAreaView,
	TextInput,
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	Dimensions,
	StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors, Font, MaterialColors } from '../../theme';
import _ from 'lodash';
import { Icon } from '../../packages';
import {
	useCategoryActions,
	selectCategory,
	genCategory,
	CategoryItem,
} from '../../core/modules';
import { useNavigationState, useNavigation } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import { BTextInput, BText } from '../components';
import RBSheet from 'react-native-raw-bottom-sheet';
import { MainStackRouterName } from '../../navigator';

const BOTTOM_HEIGHT = (Dimensions.get('screen').height * 3) / 10;

export function CategoryScreen() {
	const { params } = useNavigationState();
	const { replace } = useNavigation();
	const item: CategoryItem =
		params && params.id
			? useSelector(selectCategory(params.id))
			: genCategory();
	const [onUpdate, onDelete] = useCategoryActions(item.id);
	const [color, setColor] = useState(item.color);
	const [title, setTitle] = useState(item.name);

	let colorSheetRef = useRef<RBSheet>(null);
	const onOpenSheet = () => {
		colorSheetRef && colorSheetRef.current && colorSheetRef.current.open();
	};

	const onChangeTitle = (str: string) => {
		setTitle(str.toString());
	};
	const _debounce = _.debounce(onChangeTitle, 200);

	const _onUpdate = () => {
		title.length > 0 &&
			onUpdate({
				name: title,
				color: color,
				numberOfItem: item.numberOfItem,
			}) &&
			showMessage({
				message: 'Succesfully',
				description: `${title.toUpperCase()} is updated`,
				type: 'success',
				backgroundColor: color, // background color
				color: 'white', // text color
			});
		!params &&
			setTimeout(() => {
				replace(MainStackRouterName.group, {
					title,
					color,
					categoryId: item.id,
				});
			}, 500);
	};

	const onChangeColor = (str: string) => {
		colorSheetRef.current!.close();
		setColor(str);
	};

	const renderColorItem = ({ item, index }: any) => {
		const onPress = () => onChangeColor(item);

		return (
			<TouchableOpacity
				style={[styles.colorItem, { backgroundColor: item }]}
				onPress={onPress}
			/>
		);
	};

	const ColorsView = () => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<BText style={{ marginTop: 16, marginBottom: 16 }}>
					Select Color
				</BText>
				<FlatList
					style={{ flex: 1, marginBottom: 16 }}
					numColumns={5}
					data={MaterialColors}
					renderItem={renderColorItem}
					keyExtractor={(item, index) => `${item}_${index}`}
				/>
			</View>
		);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle={'dark-content'} />
			<KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
				<View>
					<View style={styles.container}>
						<BTextInput
							defaultSize={24}
							multiline
							autoFocus
							style={styles.input}
							maxLength={50}
							defaultValue={title}
							onChangeText={_debounce}
							placeholder={'Enter Category Name'}
						/>
					</View>
					<TouchableOpacity
						style={styles.optionView}
						onPress={onOpenSheet}
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
							<BText>Selected Color:</BText>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<BText
									defaultSize={Font.size.subTitle}
									style={[styles.text, { color: color }]}
								>
									{`${color.replace('#', '').toUpperCase()}`}
								</BText>
								<Icon name={'chevron-right'} size={18} />
							</View>
						</View>
					</TouchableOpacity>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<TouchableOpacity
							style={[
								styles.addButton,
								{ backgroundColor: color },
							]}
							onPress={_onUpdate}
							activeOpacity={0.8}
						>
							<BText style={styles.titleBtn}>
								{params && params.id
									? 'Update'
									: 'Add Category'}
							</BText>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<RBSheet
				ref={colorSheetRef}
				animationType={'fade'}
				customStyles={{ container: styles.bottomSheet }}
				height={BOTTOM_HEIGHT}
				duration={250}
				closeOnDragDown
				closeOnPressMask
			>
				<ColorsView />
			</RBSheet>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		margin: 8,
	},
	input: {
		color: 'rgba(0,0,0,0.8)',
		fontSize: 24,
		fontWeight: '700',
		height: 80,
	},
	addButton: {
		marginTop: 8,
		height: 40,
		width: 120,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.mayaBlue,
		borderRadius: 8,
	},
	titleBtn: {
		color: 'white',
	},
	optionView: {
		height: 40,
		borderRadius: 8,
		margin: 8,
		borderColor: 'rgba(0,0,0,0.2)',
		borderWidth: 1,
		justifyContent: 'center',
	},
	text: {
		fontSize: Font.size.subTitle,
		paddingLeft: 32,
		fontWeight: '700',
	},
	colorItem: {
		margin: 8,
		width: 32,
		height: 32,
		borderRadius: 16,
	},
	bottomSheet: {
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
});
