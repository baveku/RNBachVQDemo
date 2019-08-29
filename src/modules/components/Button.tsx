import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Colors } from '../../theme/color';
import { BText } from './BText';

interface Props {
    title: string;
    onPress?(): void;
}

export function TButton(props: Props) {
    const onPress = props.onPress ? props.onPress : () => {}
    return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
			<BText
				style={{
					color: 'white',
					fontSize: 18,
					fontWeight: '600',
				}}
			>
				{props.title}
			</BText>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		width: 120,
		height: 40,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.dodgerBlue,
		marginBottom: 20,
		marginTop: 20,
	},
});