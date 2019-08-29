import { IAction } from '../../types';
import { Tasky } from './types';

export const TaskActionKeys = {
	new: 'NEW_NOTE',
	update: 'UPDATE_NOTE',
	remove: 'REMOVE_NOTE',
	addShareId: 'ADD_SHARE_ID',
    updateShareTask: 'UPDATE_SHARE_TASK',
    removeShareTask: 'REMOVE_SHARE_TASK'
};

export interface UpdatePayload extends Tasky {}
export interface RemovePayload {
	id: string;
}
