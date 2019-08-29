import { IRootState } from '../../types';
import _ from 'lodash';
import { string } from 'prop-types';
import { Tasky } from '.';

export const getTaskFromCategoryId = (id: string) => (state: IRootState) =>
	_.filter(state.task.items, (val, key) => {
		return val.categoryId === id;
	}).map(item => item.id);

export const selectNote = (id: string) => (state: IRootState) =>
	state.task.items[id];

export const selectTaskForSearch = (state: IRootState) =>
	_.map(state.task.items, (val, key) => ({ name: val.title, id: val.id }));
export const selectAllTask = (state: IRootState) =>
	_.map(state.task.items, (val, key) => key);
export const selectUrgentTask = (state: IRootState) =>
	_.filter(state.task.items, (val, key) => val.isUrgent).map(item => item.id);

export const selectAllShare = (state: IRootState) =>
	sortTask(state.task.sharedItems)
export const selectShare = (id: string) => (state: IRootState) =>
    state.task.sharedItems[id];
    
const sortTask = (object: { [id: string]: Tasky }) =>
	_.orderBy(
		_.map(object, (val, key) => val),
		'date',
		'asc'
	).map(item => item.id);
