import React, { Children, useEffect, useState } from 'react';
import {
	StyleProp,
	Text,
	TextStyle,
	StyleSheet,
	TextProps,
    TextInputProps,
    TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { fontSelector } from '../../core/modules';

interface Props extends TextInputProps {
    defaultSize?: number;
    children?: any;
}

export function BTextInput(props: Props) {
	const fontSizeUp = useSelector(fontSelector);
	const getSize = () =>
		(props.defaultSize ? props.defaultSize : 14) + fontSizeUp;

	return (
		<TextInput
			{...props}
			style={[props.style, { fontSize: getSize() }]}
		>
			{props.children}
		</TextInput>
	);
}
