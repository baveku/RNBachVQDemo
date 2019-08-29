import React, { useState, useEffect } from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Alert } from 'react-native';

export const IconKeys = {
	share: 'share-apple',
	checkbox_marked: 'checkbox-marked',
	checkbox_blank: 'checkbox-blank-outline',
};

export const MaterialIconKeys = {
	delete_outline: 'close',
	note_plus_outline: 'note-plus-outline',
	plus: 'plus',
	radiobox_blank: 'radiobox-blank',
	radiobox_marked: 'radiobox-marked',
};

export const Icon = EvilIcons;
export const MaterialIcon = MaterialIcons;
export const EntypoIcon = Entypo;
export const Checkbox = (props: {
	isSelected: boolean;
	onPress?(): void;
	color?: string;
	size?: number;
}) => {
	const [isSelected, setSelected] = useState(props.isSelected);
	const [name, setName] = useState(
		isSelected ? IconKeys.checkbox_marked : IconKeys.checkbox_blank
	);
	const toggle = () => {
		props.onPress && props.onPress();
	};

	const size = props.size ? props.size : 24;

	useEffect(() => {
		// props.onPress && props.onPress()
		setName(
			isSelected ? IconKeys.checkbox_marked : IconKeys.checkbox_blank
		);
	}, [isSelected, props.color]);

	useEffect(() => {
		setSelected(props.isSelected);
	}, [props.isSelected]);

	return (
		<MaterialIcon
			name={name}
			color={props.color}
			size={size}
			style={{ textAlignVertical: 'center' }}
			onPress={toggle}
		/>
	);
};
