import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, InteractionManager } from 'react-native';
import { Colors, Font } from '../../theme';
import { Spacer } from '.';
import { Tasky, selectCategory, selectNote } from '../../core/modules';
import { useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import { MainStackRouterName } from '../../navigator';
import moment from 'moment';
import { Checkbox } from '../../packages';
import { BText } from './BText';

interface Props {
	noteId: string;
    index: number;
    onPress(id: string): void;
}

export function TaskItem(props: Props) {
    const { navigate } = useNavigation();
    const item = useSelector(selectNote(props.noteId));
    const category = useSelector(selectCategory(item.categoryId))
    
	const onPress = () => {
		props.onPress('')
		InteractionManager.runAfterInteractions(() => {
			navigate(MainStackRouterName.info, {
				noteId: item.id,
				color: category.color,
				categoryId: category.id,
				title: category.name,
			});
		})
    }

    const getNoneChecked = item.content.filter(item => !item.isChecked);
    const getCountChecked = item.content.filter(item => item.isChecked);

    const getUpdateStr = () => moment(item.updatedAt).fromNow()

	return (
		<TouchableOpacity
			style={[styles.container, { borderLeftColor: category.color }]}
			onPress={onPress}
		>
			<View style={[styles.detailView]}>
				<BText style={[styles.taskType, { color: category.color }]}>
					{category.name}
				</BText>
				<Spacer space={8} />
				<BText
					style={styles.taskTitle}
					defaultSize={Font.size.content}
				>
					{item.title}
				</BText>
				<BText style={styles.description} numberOfLines={10}>
					{getNoneChecked.map((i, index) => (
						<Text key={index}>
							<Checkbox
								isSelected={false}
								size={16}
								color={category.color}
							/>
							{`  ${i.text}\n`}
						</Text>
					))}
					{getCountChecked.length > 0 &&
						` --------------------- \n+ ${
							getCountChecked.length
						} checked item`}
				</BText>
				<View style={styles.dateView}>
					<BText style={styles.updateAt}>
						{`${getUpdateStr()}`}
					</BText>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
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
		fontWeight: '700',
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
		// borderLeftWidth: 2,
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
