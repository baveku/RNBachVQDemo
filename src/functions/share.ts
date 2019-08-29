import firebase from 'react-native-firebase';
import { Tasky } from '../core/modules/task';
import { FirebaseDeepLink, FirebaseDatabase } from '../services';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import { selectCategory, CategoryItem } from '../core/modules';

export async function shareCard({
    task,
    category,
	enableEditing,
}: {
        task: Tasky;
        category: CategoryItem;
	enableEditing: boolean;
    }) {
	await firebase
		.database()
		.ref(`Notes/${task.id}`)
		.set({
            ...task,
            category,
			enableEditing,
		});
	console.log('UPLOADED TO FIREBASE');
    console.log('------GENERATE LINK------');
    FirebaseDatabase.getInstance().onAddListener(task.id, 'root');
	const url = await FirebaseDeepLink.init(task).generateShareLink();
	return url;
}
