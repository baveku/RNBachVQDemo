import moment from 'moment';
import uuid from 'react-native-uuid';
import { CategoryItem } from '../category';
import { RepeatType } from 'react-native-push-notification';

export interface IContentItem {
	text: string;
	isChecked: boolean;
}

export interface Alarm {
	date: string;
	time: string;
}

export interface Tasky {
	id: string;
	title: string;
	content: IContentItem[];
    categoryId: string;
    enableAlert: boolean;
    alertOptions: {
        date: number;
        repeat: RepeatType | undefined;
    };
    isUrgent: boolean;
    updatedAt: number;
}

export interface TaskyShare extends Tasky {
    options: {
        canEdit: boolean,
    },
    category: CategoryItem
}

export interface ITaskyState {
    items: { [id: string]: Tasky };
    totalTask: number;
    numberOfUrgent: number;
    sharedItems: {[id: string]: TaskyShare};
}

export const defaultTasky = (categoryId: string = ''): Tasky => {
    const id = uuid.v4();
    return {
        id: id,
        content: [{ text: '', isChecked: false }],
        title: '',
        categoryId,
        isUrgent: false,
        updatedAt: moment.now(),
        enableAlert: false,
        alertOptions: {
            date: moment.now(),
            repeat: undefined
        }
    }
};
