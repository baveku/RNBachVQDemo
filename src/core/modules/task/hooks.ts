import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../../types';
import { TaskActionKeys } from './actions';
import { Tasky, defaultTasky } from './types';
import { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import _ from 'lodash';
import { flashMessageAlert } from '../../../packages';
import firebase from 'react-native-firebase';
import { selectShare, selectNote } from './selector';
import { LocalNotification, FirebaseDatabase } from '../../../services';
import { useNavigation } from 'react-navigation-hooks';
import { soundSelector, alertRepeatSelector } from '../setting';

export const useActionTask = (id: string) => {
	const dispatch = useDispatch();
	const soundSelect = useSelector(soundSelector)
	const { goBack } = useNavigation();
	const task = useSelector(selectNote(id));

	const updateTask = useCallback(
		(newVal: any) => {
			const updatedAt = moment.now();
			FirebaseDatabase.getInstance().checkTaskHasShared({
				...task,
				...newVal,
				updatedAt,
			});
			dispatch({
				type: TaskActionKeys.update,
				payload: { id, updatedAt, ...newVal },
			});
            if (newVal.enalbelAlert) {
                LocalNotification.firebaseNotification({
					id: id,
					date: newVal.date,
					repeat: newVal.alertOptions.repeat,
					title: newVal.title,
					sound: soundSelect
				});
            } else {
                LocalNotification.cancelNotification(id)
            }
		},
		[dispatch]
	);
    const deleteTask = useCallback(() => {
		FirebaseDatabase.getInstance().removeShareTask(id);
        goBack();
		dispatch({
			type: TaskActionKeys.remove,
			payload: { id },
        });
		flashMessageAlert(`Task Completed`);
	}, [dispatch]);

	return [updateTask, deleteTask] as [(newVal: any) => void, () => void];
};

export const useActionFirebaseTask = (id: string) => {
	const item = useSelector(selectShare(id));
	const update = (id: string, data: any) => {
		firebase
			.database()
			.ref('Notes')
			.child(id)
			.set(
				{
					...item,
					...data,
				},
				() => {}
			);
	};
};
