import React, { useState, useMemo } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	FlatList,
	SafeAreaView,
} from 'react-native';
import { TaskItem, BTextInput } from '../components';
import { Colors } from '../../theme';
import { useSelector } from 'react-redux';
import { getTaskFromCategoryId, selectTaskForSearch } from '../../core/modules';
import _ from 'lodash';
import { useNavigation } from 'react-navigation-hooks';
import { EmptyTaskView } from '../components/EmptyTask';

export function SearchScreen(props: {onSelectedItem: () => void}) {
    const filterSelector = useSelector(selectTaskForSearch);
    console.log(filterSelector)
    const [ids, setIds] = useState(filterSelector)
	const onPressItem = () => {
		props.onSelectedItem()
	}

	const renderItem = ({ item, index }: { item: any; index: number }) => {
		return <TaskItem noteId={item.id} index={index} onPress={onPressItem} />;
    };
    
    const onSearchChangeText = (str: string) => {
        const fil = filterSelector.filter(item => item.name.includes(str))
        console.log('FIL', fil)
        fil.length > 0 ? setIds(fil) : setIds(filterSelector);
    }

    const _debounce = _.debounce(onSearchChangeText, 500)

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<BTextInput style={styles.searchInput} placeholder={'Search'} onChangeText={_debounce} autoFocus />
			{ids.length > 0 ? <FlatList
				style={styles.flatlist}
				data={ids}
				renderItem={renderItem}
				keyExtractor={item => item.id}
			/> : <EmptyTaskView />}
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
