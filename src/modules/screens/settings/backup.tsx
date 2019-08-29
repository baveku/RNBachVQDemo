import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { IRootState } from '../../../core/types';
import { useSelector } from 'react-redux';
import firebase from 'react-native-firebase';
import { FirebaseDeepLink } from '../../../core';
import { flashMessageAlert } from '../../../packages';
import Share from 'react-native-share';
import { Colors, MaterialColors, LightBlue, LIGHTBLUE } from '../../../theme';
import { BText } from '../../components';
import _ from 'lodash';
import { TouchableOpacity } from 'react-native-gesture-handler';

const useBackup = () => {
	const state = useSelector((state: IRootState) => state);
	const [loading, setLoading] = useState(false);
	const onBackup = async () => {
		setLoading(true);
		try {
            const backupURL = await FirebaseDeepLink.generateBackupLink(state);
            console.log(backupURL)
			Share.open({
				title: 'Backup APP',
				url: backupURL,
			}).then((app) => {}).catch(err => {});
		} catch (err) {
			flashMessageAlert('Backup Error', err);
		} finally {
			setLoading(false);
		}
	};

	return [state, loading, onBackup] as [IRootState, boolean, () => void];
};

export function BackupScreen() {
	const [state, loading, onBackup] = useBackup();

	const getTotalTask = () => _(state.task.items).size();
	const getTotalShare = () => _(state.task.sharedItems).size();
	const getTotalCategory = () => _(state.category.items).size();

	return (
		<View style={styles.container}>
			<View style={styles.backupCard}>
				<View style={styles.backupItem}>
					<BText>Task:</BText>
					<BText>{getTotalTask() + ' item'}</BText>
				</View>
				<View style={styles.backupItem}>
					<BText>Share:</BText>
					<BText>{getTotalShare() + ' item'}</BText>
				</View>
				<View style={styles.backupItem}>
					<BText>Category:</BText>
					<BText>{getTotalCategory() + ' Item'}</BText>
				</View>
				<View style={styles.bottomCard}>
					<TouchableOpacity
						style={styles.bottomButton}
						onPress={onBackup}
						disabled={loading}
						activeOpacity={0.7}
					>
						{!loading ? (
							<BText
								style={{
									color: 'white',
								}}
							>
								Backup Now
							</BText>
						) : (
							<ActivityIndicator color={'white'} />
						)}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.primary,
		alignItems: 'center',
	},
	backupCard: {
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: 'white',
		width: '80%',
		marginTop: 40,
	},
	backupItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 36,
		marginLeft: 16,
		marginRight: 16,
	},
	bottomCard: {
		height: 40,
	},
	bottomButton: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: LIGHTBLUE[500],
	},
});
