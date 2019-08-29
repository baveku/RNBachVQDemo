import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { CategoryItem } from './types';
import { CategoryAtionKeys } from './actions';

export const useCategoryActions = (id: string = '') => {
	const dispatch = useDispatch();
	const updateCategory = useCallback(
		(newVal: {color: string, name: string, numberOfItem: number}) =>
			dispatch({ type: CategoryAtionKeys.update, payload: {id, ...newVal} }),
		[dispatch]
	);
	const deleteCategory = useCallback(
		() => dispatch({ type: CategoryAtionKeys.remove, payload: { id } }),
		[dispatch]
	);

	return [updateCategory, deleteCategory] as [
		(newVal: {
			color: string;
			name: string;
			numberOfItem: number;
		}) => void,
		() => void
	];
};
