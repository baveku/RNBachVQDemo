export const SettingActionKeys = {
	theme: {
		EDIT: 'EDIT_THEME',
	},
	sound: {
		GET: 'GET_SOUND',
		CHANGE_SOUND: 'CHANGE_SOUND',
	},
	font: {
		UP_FONT_SIZE: 'UP_FONT_SIZE',
		DOWN_FONT_SIZE: 'DOWN_FONT_SIZE',
	},
	alert: {
		CHANGE_REPEAT: 'UPDATE_REPEAT',
	},
};

export interface SetThemePayload {}

export interface UpdateSoundPayload {
	newSound: string;
}

export interface ChangeRepeatPayload {
	type: 'day' | 'minute' | 'hour';
}
