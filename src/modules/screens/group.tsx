import React, { useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	FlatList,
	SafeAreaView,
	StatusBar,
} from 'react-native';
import { TaskItem } from '../components';
import { Colors } from '../../theme';
import { useNavigation, useNavigationState } from 'react-navigation-hooks';
import { MainStackRouterName } from '../../navigator';
import { Tasky, getTaskFromCategoryId, selectCategory, selectAllTask, selectUrgentTask, CategoryItem } from '../../core/modules';
import { useSelector } from 'react-redux';
import { EmptyTaskView } from '../components/EmptyTask';

interface Props {
    categoryId?: string;
    isUrgent?: boolean;
}

export function TaskGroupScreen() {
    const { navigate, setParams } = useNavigation()
    const { params } = useNavigationState();
    const props = params as Props;
    let filterSelector: any;
    props && props.categoryId && (filterSelector = useSelector(getTaskFromCategoryId(props.categoryId)))
    props && !props.categoryId && props.isUrgent && (filterSelector = useSelector(selectUrgentTask));
    props &&
		!props.categoryId &&
		!props.isUrgent &&
		(filterSelector = useSelector(selectAllTask));
    const category = useSelector(selectCategory(props.categoryId || ''))
    console.log(filterSelector)
    const gotoInfo = (id: string) => { 
        navigate(MainStackRouterName.info, {noteId: id, categoryId: category.id, color: category.color, title: category.name});
	};
	
	const goToNewTask = () => {
		navigate(MainStackRouterName.task,  {categoryId: category.id, color: category.color})
	}

    useEffect(() => {
        setParams({...params, categoryId: props.categoryId})
	}, [])

    const renderItem = ({ item, index }: { item: string; index: number }) => {
        const onPress = () => gotoInfo(item);
		return <TaskItem noteId={item} index={index} onPress={onPress} />;
    };

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle={'light-content'} />
			{filterSelector.length > 0 ? (
				<FlatList
					style={styles.flatlist}
					data={filterSelector}
					renderItem={renderItem}
					keyExtractor={(item, index) => `${item}_${index}`}
				/>
			) : (
				<EmptyTaskView
						color={category.color}
					onPressAdd={!!props.categoryId ? goToNewTask : undefined}
				/>
			)}
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
