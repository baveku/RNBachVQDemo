import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Image,
	ScrollView,
} from 'react-native';
import { Images } from '../../assets';
import { BText } from '.';
import { Colors } from '../../theme';

export function EmptyTaskView(props: {
	color?: string;
	onPressAdd?: () => void;
	desc?: string;
}) {
	const backgroundColorAddButton = props.color
		? props.color
		: Colors.texasRose;
	const onPress = props.onPressAdd ? props.onPressAdd : () => {};
	const desc = props.desc
		? props.desc
		: `Category is empty.\nLet's create a new task now`;
	return (
		// <ScrollView>
		<View style={styles.container}>
			<View style={styles.iconView}>
				<Image
					source={Images.test}
					resizeMode={'contain'}
					style={{ width: '100%', height: '100%' }}
				/>
			</View>
			<BText style={styles.desc}>{desc}</BText>
			{ props.onPressAdd &&
				<TouchableOpacity
					style={[
						styles.addBtn,
						{ backgroundColor: backgroundColorAddButton },
					]}
					onPress={onPress}
				>
					<BText style={styles.titleBtn}> Add Task</BText>
				</TouchableOpacity>
			}
		</View>
		// </ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 40,
		// justifyContent: 'center',
		alignItems: 'center',
	},
	iconView: { width: '40%', aspectRatio: 1 },
	addBtn: {
		marginTop: 20,
		width: 120,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.texasRose,
		borderRadius: 8,
	},
	titleBtn: {
		color: Colors.white,
		fontWeight: 'bold',
	},
	desc: {
		textAlign: 'center',
		marginTop: 4,
		fontSize: 16,
		color: Colors.stormGray,
		fontWeight: 'bold',
	},
});
