import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { IRootState } from './types';
import _ from 'lodash';
export * from './modules/category/selector';
export * from './modules/task/selector';
export * from './modules/setting/selector';

export const makeGetTaskWithCategory = (categoryId: string) =>
	createSelector(
		[
			(state: IRootState) =>
				_.filter(state.category.items, (val, key) => key === categoryId),
			(state: IRootState) =>
				_.filter(state.task.items, (val, key) => val.categoryId === categoryId),
		],
		(category, tasks) => ({
			...category,
			tasks,
		})
    );

export const selectorGetAllCategory = createSelector(
			[
				(state: IRootState) =>
					_.map(state.category.items, (val, key) => val),
				(state: IRootState) =>
					_.filter(
						state.task.items,
						(val, key) => val.isUrgent
					),
				(state: IRootState) => state.task.totalTask,
                (state: IRootState) => _.map(state.task.sharedItems, (val, key) => key).length
			],
			(categories, urgent, totalTask, sharedNumber) => {
				return [
					{
						name: 'All Note',
						numberOfItem: totalTask,
					},
					{
						name: 'Urgent',
						numberOfItem: urgent.length,
						color: '#dd2c00',
                    },
                    {
                        name: 'Shared',
                        numberOfItem: sharedNumber,
                        color: '#1b5e20',
                    },
					...categories,
				];
			}
		);
