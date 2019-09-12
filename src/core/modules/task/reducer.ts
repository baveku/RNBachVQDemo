import { ITaskyState, defaultTasky } from './types';
import { IAction, IRootState, RootActionKeys,  } from '../../types';
import { TaskActionKeys, UpdatePayload } from './actions';

const initalState: ITaskyState = {
	items: {},
	totalTask: 0,
    numberOfUrgent: 0,
    sharedItems: {},
};

export const taskReducer = (
	state: ITaskyState = initalState,
	action: IAction
): ITaskyState => {
	const payload = action.payload;
	switch (action.type) {
		case TaskActionKeys.remove:
			let copyItem = { ...state.items };
			if (!!copyItem[payload.id]) delete copyItem[payload.id];
			return {
				...state,
				items: copyItem,
			};
		case TaskActionKeys.update:
			console.log(payload.id, payload);
			return {
				...state,
				items: {
					...state.items,
					[payload.id]: {
						...state.items[payload.id],
						...payload,
					},
				},
			};
		case TaskActionKeys.updateShareTask:
			if (!!state.items[payload.id]) return state;
			return {
				...state,
				sharedItems: {
					...state.sharedItems,
					[payload.id]: {
						...state.sharedItems[payload.id],
						...payload,
					},
				},
			};
		case TaskActionKeys.removeShareTask:
			let copyShareItem = { ...state.sharedItems };
			if (!!copyShareItem[payload.id])
				delete copyShareItem[payload.id];
			return { ...state, sharedItems: copyShareItem };
		case RootActionKeys.restore:
			const { task } = payload as IRootState;
			return {
				...state,
				items: { ...state.items, ...task.items },
				sharedItems: { ...state.sharedItems, ...task.sharedItems },
			};
		case 'RESET_APP':
			return initalState;
		default:
			return state;
	}
};
