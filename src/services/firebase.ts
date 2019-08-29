import firebase, { RNFirebase } from 'react-native-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { Tasky, useActionTask, TaskActionKeys } from '../core/modules';
import { showMessage } from 'react-native-flash-message';
import { Task, Platform, Linking } from 'react-native';
import { IRootState } from '../core/types';
import _ from 'lodash';
import { useEffect } from 'react';
import { URLSetup } from '../constants';
import { flashMessageAlert } from '../packages';
import { any } from 'prop-types';

export class FirebaseDeepLink {
	constructor(public tasky: Tasky) {}

	static init(tasky: Tasky) {
		return new FirebaseDeepLink(tasky);
	}

	private generateLink() {
		const uri = encodeURI(URLSetup.deeplink(this.tasky.id));
		return new firebase.links.DynamicLink(uri, 'https://taskyv2.page.link');
	}

	static async generateBackupLink(state: IRootState) {
		const restoreKey = await firebase.database().ref('Restore').push(state).key;
		if (!restoreKey) throw new Error('Cannot Backup Now,');
		const uri = encodeURI(URLSetup.restoreLink(restoreKey));
		const dynamicLink = new firebase.links.DynamicLink(
			uri,
			'https://taskyv2.page.link'
		);

		const restoreLink = await firebase.links().createShortDynamicLink(dynamicLink, 'UNGUESSABLE');
		return restoreLink
	}

	async uploadToTask() {
		return await firebase
			.database()
			.ref(`Notes`)
			.child(this.tasky.id)
			.set(
				{
					...this.tasky,
				},
				err => {
					if (err) {
						console.log(err);
					}
					console.log('UPLOAD COMPLETE');
				}
			);
	}

	public async generateShareLink() {
		const links = firebase.links();
		console.log(links);
		const result = await links.createShortDynamicLink(
			this.generateLink(),
			'SHORT'
		);
		console.log(result);
		return result;
	}
}

interface DispatchRef {
	shareDispatch: { update: any; remove: any };
	rootDispatch: { update: any; remove: any };
	appDispatch: {
		restore: any,
	};
}

export class FirebaseDatabase {
	private listener: {
        rootCard: { [id: string]: RNFirebase.database.Reference; },
        shareCard: {[id: string]: RNFirebase.database.Reference;},
	} = {rootCard: {}, shareCard: {}};
	private dispatchRef: DispatchRef = {
		shareDispatch: {
			update: () => {},
			remove: () => {},
		},
		rootDispatch: {
			update: () => {},
			remove: () => {},
		},
		appDispatch: {
			restore: () => {}
		}
	};
	private unsubscribeLink: any;
	private static instance: FirebaseDatabase;
	private constructor() {}
	public static getInstance(): FirebaseDatabase {
		if (!FirebaseDatabase.instance) {
			FirebaseDatabase.instance = new FirebaseDatabase();
		}

		return FirebaseDatabase.instance;
	}

	public onStartApp(
		shareIds: string[],
		rootIds: string[],
		dispatch: DispatchRef
	) {
		firebase.database().goOnline();
		this.dispatchRef = dispatch;

        this.onGetLink();
        this.onLink();

		shareIds.forEach(id =>
			this.onAddListener(id, 'share')
        );
        
        rootIds.forEach(id => this.onAddListener(id, 'root'))
		console.log('done');
	}

	public onAddListener(noteId: string, type: 'share' | 'root') {
		const ref = firebase
			.database()
			.ref('Notes')
            .child(noteId);
        const listener =
			type === 'share'
				? this.listener.shareCard
                : this.listener.rootCard;
        const dispatch =
			type === 'share'
				? this.dispatchRef.shareDispatch.update
				: this.dispatchRef.rootDispatch.update;
		listener[noteId] = ref;
		ref.on('value', snapshot => {
			snapshot.exists() &&
				dispatch(snapshot.val()) &&
				showMessage({
					message: 'Shared success',
					description: `Card ${snapshot.val().title} is Updated`,
					type: 'success',
					backgroundColor: 'rgba(0,0,0,0.7)', // background color
					color: 'white', // text color
				});
			!snapshot.exists() && this.offListener(noteId, listener);
		});

		ref.on('child_removed', snapshot => {
			!snapshot.exists() && this.offListener(noteId, listener);
		});
	}

	public offListener(noteId: string, listenerRef: any = this.listener.shareCard) {
		if (!!listenerRef[noteId]) {
			listenerRef[noteId].off('value');
			delete listenerRef[noteId];
		}
        this.dispatchRef.shareDispatch.remove(noteId);
	}

	public onLink() {
		this.unsubscribeLink = firebase.links().onLink((url) => this.handleDeeplink(url));
	}

	public handleDeeplink(url: string) {
		const regex = /page.link\/shared\/(.*)/;
		const result = url.match(regex);
		if (result && result.length > 1) {
			console.log(result[1]);
			this.onAddListener(
                result[1],
                'share'
			);
		}
	}

	onGetLink() {
		firebase.links().getInitialLink()
			.then(url => {
				console.log(url);
				if (url) {
					this.handleDeeplink(url);
					this.handleDeeplinkRestore(url)
				}
			})
            .catch(err => console.error('An error occurred', err));
	}

	checkTaskHasShared(task: Tasky) {
		const ref = firebase.database().ref(`Notes/${task.id}`);
		ref.once('value', snapshot => {
			snapshot.exists() && ref.set(task);
		});
	}

	removeShareTask(id: string) {
		const ref = firebase.database().ref(`Notes/${id}`);
		ref.once('value', snapshot => {
			snapshot.exists() && snapshot.ref.remove();
		});
	}

	public handleDeeplinkRestore(url: string) {
		const regex = /page.link\/restore\/(.*)/;
		console.log(url)
		const result = url.match(regex);
		if (result && result.length > 1) {
			console.log(result[1]);
			const ref = firebase
				.database()
				.ref('Restore')
				.child(result[1]);
			ref.once('value', snapshot => {
				console.log(snapshot.val())
				snapshot.val() && this.dispatchRef.appDispatch.restore(snapshot.val())
			});	
		}
	}
}
