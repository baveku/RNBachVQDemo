import { CategoryItem } from './types';
import { string } from 'prop-types';

export const CategoryAtionKeys = {
	update: 'UPDATE_CAT',
	remove: 'REMOVE_CAT',
};

export interface UpdateCategoryPayload extends CategoryItem {}
export interface RemoveCategoryPayload {
	id: string;
}
