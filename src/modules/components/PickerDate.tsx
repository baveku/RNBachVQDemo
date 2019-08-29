import React, { useState, useEffect } from 'react';
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Text,
	Switch,
	SafeAreaView,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment, { max } from 'moment';

interface Props {
	isVisible: boolean;
	time: number;
	onUpdateTime(timezon: number): void;
	onSetVisible(val: boolean): void;
}

export function PickerDate(props: Props) {
	const _onCancel = () => {
		const cancel = false;
		props.onSetVisible(cancel);
	};

	const _handleSelectDate = (date: Date) => {
		props.onUpdateTime(date.getTime());
		_onCancel();
	};

	const getDate = () => Math.max(Date.now(), props.time);

	return (
		<DateTimePicker
			isVisible={props.isVisible}
			onConfirm={_handleSelectDate}
			onCancel={_onCancel}
			date={new Date(getDate())}
            minimumDate={new Date(Date.now())}
			mode="datetime"
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	dateView: {},
	timeView: {},
	repeatView: {},
});
