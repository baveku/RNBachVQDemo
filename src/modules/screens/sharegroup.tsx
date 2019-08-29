import React, { useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	FlatList,
	SafeAreaView,
	TouchableOpacity,
	StatusBar,
} from 'react-native';
import { Colors, Font } from '../../theme';
import { useNavigation, useNavigationState } from 'react-navigation-hooks';
import { MainStackRouterName } from '../../navigator';
import {
	Tasky,
	getTaskFromCategoryId,
	selectCategory,
	selectAllTask,
	selectUrgentTask,
	CategoryItem,
	selectAllShare,
	selectShare,
} from '../../core/modules';
import { useSelector } from 'react-redux';

interface Props {
	categoryId?: string;
	isUrgent?: boolean;
}

export function ShareGroupScreen() {
	const { navigate, setParams } = useNavigation();
	const { params } = useNavigationState();
	const shareIds = useSelector(selectAllShare);

	useEffect(() => {
		setParams({ ...params, color: Colors.gradient.cyan_white[1] });
	}, []);

	const renderItem = ({ item, index }: { item: string; index: number }) => {
		const onPress = () =>
			navigate(MainStackRouterName.shareTaskInfo, { id: item });
		return <ShareTaskItem noteId={item} index={index} onPress={onPress} />;
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle={'light-content'} />
			{shareIds.length > 0 ? <FlatList
				style={styles.flatlist}
				data={shareIds}
				renderItem={renderItem}
				keyExtractor={(item, index) => `${item}_${index}`}
			/> : <EmptyTaskView color={Colors.gradient.cyan_white[1]} desc={`Not Found.`} />}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	flatlist: {
		flex: 1,
		backgroundColor: Colors.primary,
	},
	searchInput: {
		height: 40,
		margin: 8,
		marginLeft: 16,
		marginRight: 16,
		borderBottomWidth: 2,
		borderBottomColor: Colors.purple,
	},
});

import moment from 'moment';
import { Checkbox } from '../../packages';
import { Spacer, BText } from '../components';
import { EmptyTaskView } from '../components/EmptyTask';

interface Props {
	noteId: string;
	index: number;
	onPress(id: string): void;
}

function ShareTaskItem(props: Props) {
	const { navigate } = useNavigation();
	const item = useSelector(selectShare(props.noteId));
	const color = item.category ? item.category.color : Colors.gradient.cyan_white[1];

	const [currentItem, setItem] = useState(() => item);

	const onPress = () => {
		navigate(MainStackRouterName.shareTaskInfo, {
			id: item.id,
		});
	};

	useEffect(() => {
		setItem(item);
	}, [item]);

	const getNoneChecked = currentItem.content.filter(item => !item.isChecked);
	const getCountChecked = currentItem.content.filter(item => item.isChecked);
	const getTotalTask = currentItem.content.length;

	const getUpdateStr = () => moment(currentItem.updatedAt).fromNow();
	const getDateStr = () =>
		moment(currentItem.alertOptions.date).format('HH:mm dddd, MMM DD');

	return (
		<TouchableOpacity
			style={[itemStyles.container, { borderLeftColor: color }]}
			onPress={onPress}
		>
			<View style={[itemStyles.detailView]}>
				<BText defaultSize={Font.size.content} style={itemStyles.taskTitle}>{item.title}</BText>
				<BText style={itemStyles.description} numberOfLines={10} >
					{getNoneChecked.map((i, index) => (
						<Text key={index}>
							<Checkbox
								isSelected={false}
								size={16}
								color={color}
							/>
							{`  ${i.text}\n`}
						</Text>
					))}
					{getCountChecked.length > 0 && ` --------------------- \n+ ${getCountChecked.length} checked item`}
				</BText>
				<View style={itemStyles.dateView}>
					<Text style={itemStyles.updateAt}>
						{`${getUpdateStr()}`}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const itemStyles = StyleSheet.create({
	container: {
		margin: 8,
		marginTop: 8,
		flexDirection: 'row',
		backgroundColor: 'white',
		borderRadius: 8,
		borderLeftWidth: 4,
	},
	timeView: {
		margin: 8,
		marginTop: 12,
		alignItems: 'center',
		width: 60,
	},
	taskTitle: {
		fontSize: Font.size.content,
		fontWeight: Font.weight.bold,
	},
	taskType: {
		marginTop: 4,
		color: 'white',
	},
	taskTypeView: {
		justifyContent: 'center',
		alignItems: 'flex-start',
		margin: 4,
		width: 60,
		borderRadius: 4,
		height: 24,
	},
	description: {
        marginTop: 8,
        lineHeight: 20,
	},
	startTime: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.stormGray,
		textAlign: 'center',
	},
	end: {
		fontSize: 16,
		color: Colors.stormGray,
		textAlign: 'center',
	},
	detailView: {
		margin: 16,
		marginLeft: 0,
		paddingLeft: 16,
		flex: 1,
	},
	dateView: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	updateAt: {
		color: Colors.stormGray,
	},
});
