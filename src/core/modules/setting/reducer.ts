import { ISettingState } from './types';
import { IAction, IRootState, RootActionKeys } from '../../types';
import {
	SettingActionKeys,
	ChangeRepeatPayload,
	UpdateSoundPayload,
} from './actions';

const initalState: ISettingState = {
	sound: 'dontthinkso.mp3',
	fontSizeUp: 0,
	alertRepeat: 'day',
};

export const settingReducer = (
	state: ISettingState = initalState,
	action: IAction
): ISettingState => {
	const payload = action.payload;
	switch (action.type) {
		case SettingActionKeys.alert.CHANGE_REPEAT:
			const { type } = payload as ChangeRepeatPayload;
			return { ...state, alertRepeat: type };
		case SettingActionKeys.font.UP_FONT_SIZE:
			return { ...state, fontSizeUp: state.fontSizeUp + 1 };
		case SettingActionKeys.font.DOWN_FONT_SIZE:
			return { ...state, fontSizeUp: state.fontSizeUp - 1 };
		case SettingActionKeys.sound.CHANGE_SOUND:
			const { newSound } = payload as UpdateSoundPayload;
			return { ...state, sound: newSound };
		case RootActionKeys.restore:
			const { setting } = payload as IRootState;
			return {
				...setting,
			};
		default:
			return state;
	}
};
