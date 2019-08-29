import { showMessage } from 'react-native-flash-message';
import _ from 'lodash';

const onShowMessageUpdated = (message: string, description: string = '', autoHide: boolean = true, onPress?: () => void) =>
	showMessage({
		message: message,
		description: description,
		type: 'success',
		backgroundColor: 'rgba(0,0,0,0.9)', // background color
        color: 'white', // text color
        autoHide: autoHide,
        onPress: onPress
	});
export const flashMessageAlert = _.debounce(onShowMessageUpdated, 2000);
