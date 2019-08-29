import { IRootState } from "../../types";

export const fontSelector = (state: IRootState) => state.setting.fontSizeUp;
export const soundSelector = (state: IRootState) => state.setting.sound;
export const alertRepeatSelector = (state: IRootState) => state.setting.alertRepeat;