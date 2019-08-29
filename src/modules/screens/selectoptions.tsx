import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Colors } from '../../theme';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import _ from 'lodash';
import { BText } from '../components';

interface Props {
	data?: any[];
	onSelected?(index: number): void;
}
export function SelectOptionsScreen() {
    const { params } = useNavigation().state;
    const { goBack } = useNavigation();
    const props = params as Props;
    const keyExtractor = (item: any, index: number) => (`${item.label} _${index}`); 

	const renderItem = ({ item, index }: any) => {
        const onPress = () => {
            props.onSelected ? props.onSelected(index) : () => { };
            goBack();
        }

        const color = item.color

        return (
			<TouchableOpacity onPress={onPress} style={styles.item}>
				<BText style={{ color: color, fontWeight: '700' }}>
					{_.startCase(item.label)}
				</BText>
			</TouchableOpacity>
		);
	};
	return (
		<FlatList
			data={props.data || []}
			renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.container}
		/>
	);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
	item: {
		height: 48,
		justifyContent: 'center',
		alignItems: 'flex-start',
        backgroundColor: Colors.white,

        margin: 8,
        marginTop: 4,
        paddingLeft: 8,
        borderRadius: 8,
	},
});
