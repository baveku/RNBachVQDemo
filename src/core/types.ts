import { ITaskyState, ISettingState } from "./modules";
import { ICategoryState } from "./modules/category";

export interface IAction {
    type: string;
    payload: any;
}

export interface IRootState {
    task: ITaskyState;
    category: ICategoryState;
    setting: ISettingState;
}

export const RootActionKeys = {
    restore: 'RESTORE',
}