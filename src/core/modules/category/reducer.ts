import { ICategoryState, CategoryItem } from './types';
import { IAction, IRootState, RootActionKeys } from '../../types';
import { CategoryAtionKeys, RemoveCategoryPayload } from './actions';
import uuid from 'react-native-uuid';
import { Colors } from '../../../theme';

const MAX_URGENT_NOW = 5;
const genDefaultCategory = (): { [id: string]: CategoryItem } => {
	const u1 = uuid.v4();
	const u2 = uuid.v4();
	const u3 = uuid.v4();
	const u4 = uuid.v4();
    const u5 = uuid.v4();
    return {
		[u1]: { id: u1, name: 'Home', color: Colors.mayaBlue, numberOfItem: 0 },
		[u2]: {
			id: u2,
			name: 'Shoping',
			color: Colors.mayaBlue,
			numberOfItem: 0,
		},
		[u3]: { id: u3, name: 'Car', color: Colors.mayaBlue, numberOfItem: 0 },
		[u4]: {
			id: u4,
			name: 'Packing',
			color: Colors.mayaBlue,
			numberOfItem: 0,
		},
		[u5]: {
			id: u5,
			name: 'General',
			color: Colors.mayaBlue,
			numberOfItem: 0,
		},
	};
};

const initalState: ICategoryState = {
	items: genDefaultCategory(),
	numOfUrgent: 0,
};

export const categoryReducer = (
	state: ICategoryState = initalState,
	action: IAction
) => {
	const { payload, type } = action;
	switch (type) {
        case CategoryAtionKeys.update:
            console.log(payload)
			return {
				...state,
				items: { ...state.items, [payload.id]: {...state.items[payload.id], ...payload} },
			};
		case CategoryAtionKeys.remove:
            const removeId = (payload as RemoveCategoryPayload).id;
            let newItems = state.items
            delete newItems[removeId]
			return {
				...state,
				items:  newItems,
			};
		case RootActionKeys.restore:
			const { category } = payload as IRootState;
			return {...state, items: {...state.items, ...category.items}, numOfUrgent: category.numOfUrgent}
		default:
			return state;
	}
};
