import React from 'react';
import {
	View,
	FlatList,
	Text,
	StyleSheet,
	AlertButton,
	Alert,
} from 'react-native';
import { Font, Colors, Color } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from 'react-navigation-hooks';
import { MainStackRouterName } from '../../navigator';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcon, MaterialIconKeys } from '../../packages';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { selectorGetAllCategory } from '../../core/selectors';
import {
	CategoryItem,
	useCategoryActions,
	getTaskFromCategoryId,
	selectAllTask,
	selectUrgentTask,
	selectAllShare,
	fontSelector,
} from '../../core/modules';
import { BText } from './BText';

export function CatogryList() {
	const categories = useSelector(selectorGetAllCategory);
	const { navigate } = useNavigation();

	const onPushGroupTask = (
		title: string,
		categoryId?: string,
		color?: string,
		isUrgent?: boolean
	) => {
		navigate(MainStackRouterName.group, {
			title,
			categoryId,
			color: color,
			isUrgent,
		});
	};

	const renderFirstItem = ({ item, index }: any) => {
		const push = () =>
			onPushGroupTask(
				'All Today',
				undefined,
				Colors.gradient.purple_white[1]
			);
		return <CatogryItem item={item} index={index} onPress={push} />;
	};

	const renderLastItem = () => {
		const push = () => navigate(MainStackRouterName.add_category);
		return <CategoryAddItem onPress={push} />;
	};

	const renderShareItem = ({ item, index }: any) => {
		const push = () => navigate(MainStackRouterName.shareGroup);
		return <CatogryItem item={item} index={index} onPress={push} />;
	};

	const renderUrgent = ({ item, index }: any) => {
		const push = () =>
			onPushGroupTask('Urgent', undefined, item.color, true);
		return <CatogryItem item={item} index={index} onPress={push} />;
	};

	const renderItem = ({ item, index }: any) => {
		const push = () => onPushGroupTask(item.name, item.id, item.color);
		if (index === 0) {
			return renderFirstItem({ item, index });
		}

		if (index === categories.length) {
			return renderLastItem();
		}

		if (index === 1) {
			return renderUrgent({ item, index });
		}

		if (index === 2) {
			return renderShareItem({ item, index });
		}

		return <CatogryItem item={item} index={index} onPress={push} />;
	};

	return (
		<FlatList
			style={{
				width: '92%',
				height: '100%',
				marginTop: 20,
			}}
			numColumns={3}
			data={[...categories, { name: 'AddItem' }]}
			renderItem={renderItem}
			keyExtractor={(item, index) => `${item.name} _${index}`}
		/>
	);
}

function CatogryItem(props: {
	item: CategoryItem;
	index: number;
	onPress?(): void;
	onLongPress?(): void;
}) {
	const { navigate } = useNavigation();
	let gradient =
		props.index > 0 ? Colors.gradient.white : Colors.gradient.purple_white;
	props.index === 1 && (gradient = Colors.gradient.red_white);
	props.index === 2 && (gradient = Colors.gradient.cyan_white);
	const labelColor = props.index > 2 ? props.item.color : Colors.white;
	const taskColor = props.index > 2 ? Colors.stormGray : '#A8A1DB';
	const onPress = props.onPress ? props.onPress : () => {};
	let selector: any;
	props.index === 0 && (selector = selectAllTask);
	props.index === 1 && (selector = selectUrgentTask);
	props.index === 2 && (selector = selectAllShare);
	props.index > 2 && (selector = getTaskFromCategoryId(props.item.id));

	const filterNote: any = useSelector(selector);

	const [_, onDeleteCategory] = useCategoryActions(props.item.id || '');
	const alertButton: AlertButton[] = [
		{
			text: 'Cancel',
			style: 'cancel',
		},
		{
			text: 'Destroy',
			onPress: () => onDeleteCategory(),
			style: 'destructive',
		},
		{
			text: 'Edit',
			onPress: () =>
				navigate(MainStackRouterName.add_category, {
					id: props.item.id,
				}),
		},
	];

	const onLongPress =
		props.index > 2
			? () =>
					Alert.alert(
						'Do you want to use category action?',
						'',
						alertButton
					)
			: () => {};

	return (
		<View style={itemStyles.container}>
			<TouchableOpacity
				style={{ width: '100%', height: '100%' }}
				onPress={onPress}
				onLongPress={onLongPress}
				delayLongPress={1000}
				activeOpacity={0.8}
			>
				<LinearGradient
					style={{ flex: 1 }}
					colors={gradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				>
					<View style={itemStyles.topView} />
					<View style={itemStyles.content}>
						<BText
							defaultSize={Font.size.content}
							style={[
								itemStyles.labelTask,
								{ color: labelColor },
							]}
						>
							{props.item.name}
						</BText>
						<BText
							style={[
								itemStyles.totalTask,
								{ color: taskColor },
							]}
						>
							{`${filterNote.length} Task`}
						</BText>
					</View>
				</LinearGradient>
			</TouchableOpacity>
		</View>
	);
}

const CategoryAddItem = (props: { onPress(): void }) => {
	return (
		<View style={[itemStyles.container, itemStyles.AddCategory]}>
			<TouchableOpacity
				style={{
					width: '100%',
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				onPress={props.onPress}
				activeOpacity={0.8}
			>
				<MaterialIcon
					name={MaterialIconKeys.plus}
					size={48}
					color={Colors.stormGray}
				/>
			</TouchableOpacity>
		</View>
	);
};

const itemStyles = StyleSheet.create({
	container: {
		width: '30%',
		height: 160,
		margin: 4,
		borderRadius: 8,
		borderBottomRightRadius: 0,
		overflow: 'hidden',
	},
	topView: {
		flex: 1,
	},
	content: {
		height: 48,
		paddingLeft: 8,
		paddingRight: 8,
	},
	labelTask: {
		fontWeight: '700',
	},
	totalTask: {},
	AddCategory: {
		borderStyle: 'dashed',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
	},
});
