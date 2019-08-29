import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { IRootState } from '../../types';
import _ from 'lodash';
import { CategoryItem } from './types';
import { MaterialColors, GREY } from '../../../theme';
const defaultCategory: CategoryItem = {
	name: 'Default',
	color: GREY[600],
	id: 'defaultCategory_<N1',
	numberOfItem: 0,
}
export const selectCategory = (id: string = '') => (state: IRootState) => {
	if (state.category.items[id]) return state.category.items[id];
	
	const listCategory = _.map(state.category.items, (val, key) => val);
	if (listCategory.length > 0) return listCategory[0];

	return defaultCategory
}

export const selectAllCategory = (state: IRootState) => _.map(state.category.items, (val, key) => val);