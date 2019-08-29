import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../../../core/types';
import Sound from 'react-native-sound';
import { Colors } from '../../../theme';
import { BText } from '../../components';
import Icon from 'react-native-vector-icons/Ionicons';
import { SettingActionKeys } from '../../../core/modules';
Sound.setCategory('Playback')

export function SoundScreen() {
	const ListSound = [{ name: ' Tick OOps', source: 'dontthinkso.mp3' }];
    const soundSelect = useSelector(
		(state: IRootState) => state.setting.sound
    );
    
    const dispatch = useDispatch()

    const onPlaySound = (source: string) => {
		console.log('PLAY SOUND');
		const player = new Sound(
			source,
			Sound.MAIN_BUNDLE,
			err => {
				if (err) {
					console.log('failed to load the sound', err);
					return;
				}
				// loaded successfully
				console.log(
					'duration in seconds: ' +
						player.getDuration() +
						'number of channels: ' +
						player.getNumberOfChannels()
				);

				// Play the sound with an onEnd callback
				player.play(success => {
					if (success) {
						console.log('successfully finished playing');
						player.release();
					} else {
						console.log(
							'playback failed due to audio decoding errors'
						);
					}
				});
			}
		);
	};

	const renderItem = ({ item, index }: any) => {
		const isSelected = soundSelect === item.source;
        const onPress = () => {
            dispatch({type: SettingActionKeys.sound.CHANGE_SOUND, payload: {newSound: item.source}})
            onPlaySound(item.source);
        };
		return (
			<TouchableOpacity onPress={onPress} style={styles.item}>
				<View style={styles.checkView}>
					{isSelected && <Icon name={'ios-checkmark'} color={'blue'} size={32} />}
				</View>
				<BText>{item.name}</BText>
			</TouchableOpacity>
		);
	};

	const ListHeaderComponent = () => {
		return (
			<View style={styles.flatlistHeader}>
				<BText>Alert Rington</BText>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={ListSound}
				renderItem={renderItem}
				ListHeaderComponent={ListHeaderComponent}
				keyExtractor={(item, index) => `${item.source}_${index}`}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.primary,
	},
	item: {
		flexDirection: 'row',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 8,
        margin: 8,
        paddingLeft: 8,
        paddingRight: 8,
        alignItems: 'center'
	},
	flatlistHeader: {
		marginLeft: 20,
		marginTop: 20,
	},
	checkView: {
		marginLeft: 8,
		aspectRatio: 1,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
