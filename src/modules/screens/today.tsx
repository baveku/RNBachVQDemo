import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export function ListTask() {
	return (
		<View style={styles.container}>
			<Text>Create Edit and Delete Task</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
