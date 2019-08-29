import React, { useState, useCallback, useEffect } from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fontSelector, SettingActionKeys } from '../../../core/modules';
import { Colors } from '../../../theme';
import { BText } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const useTheme = () => {
	const fontSizeSelect = useSelector(fontSelector);
	const dispatch = useDispatch();

	const upSize = useCallback(() => {
		dispatch({
			type: SettingActionKeys.font.UP_FONT_SIZE,
		});
	}, [dispatch]);

	const downSize = useCallback(() => {
		dispatch({
			type: SettingActionKeys.font.DOWN_FONT_SIZE,
		});
	}, [dispatch]);

	return [fontSizeSelect, upSize, downSize] as [
		number,
		() => void,
		() => void
	];
};
export function ThemeScreen() {
	const [size, onUpSize, onDownSize] = useTheme();

	return (
		<KeyboardAwareScrollView style={styles.container}>
			<View style={styles.fontView}>
				<BText>Font Size</BText>
				<View style={styles.upDownView}>
					<Icon.Button
						name={'minuscircleo'}
						color={Colors.stormGray}
						onPress={onDownSize}
						iconStyle={{ marginRight: 0 }}
						backgroundColor={'transparent'}
						activeOpacity={0.2}
					/>
					<View style={styles.fontCenterView}>
						<BText
							defaultSize={16}
							style={[styles.fontTextExample]}
						>
							{size}
						</BText>
					</View>
					<Icon.Button
						name={'pluscircleo'}
						color={Colors.stormGray}
						onPress={onUpSize}
						iconStyle={{ marginRight: 0 }}
						activeOpacity={0.2}
						backgroundColor={'transparent'}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.primary,
	},
	fontView: {
		minHeight: 48,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		margin: 8,
		borderRadius: 8,
		paddingLeft: 8,
		paddingRight: 8,
		marginTop: 40,
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonTitle: {
		fontSize: 20,
	},
	fontCenterView: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	fontTextExample: {
		fontWeight: '700',
	},
	upDownView: {
		flexDirection: 'row',
		width: '40%',
	},
});
