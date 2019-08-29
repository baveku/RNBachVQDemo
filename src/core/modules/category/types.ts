import uuid from 'react-native-uuid';

export interface CategoryItem {
    id: string;
    name: string;
    color: string;
    numberOfItem: number;
}

export interface ICategoryState {
    items: {[id:string]: CategoryItem};
    numOfUrgent: number;
}

export const genCategory = (): CategoryItem => {
    const categoryId = uuid.v4()
    return {
        id: categoryId,
        name: '',
        color: 'red',
        numberOfItem: 0,
    }
}