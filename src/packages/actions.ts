import Share from 'react-native-share';

export const shareTask = (url: string = '') => {
	const shareOptions = {
		title: 'Tasky',
		message: 'You receive a Tasky',
		url,
	};
	Share.open(shareOptions);
};
