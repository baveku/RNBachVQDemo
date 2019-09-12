import React, { useState, useEffect } from 'react';
import { InteractionManager, View, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import { Platform } from 'react-native';
import { AdmobConfig } from '../../constants';
const { Banner, AdRequest } = (firebase as any).admob;

const keyword = [
	'Insurance',
	'Loans',
	'Mortgage',
	'Attorney',
	'Credit',
	'Lawyer',
	'Donate',
	'Degree',
	'Hosting',
	'Claim',
	'Trading',
	'Software',
	'Recovery',
	'Transfer',
	'Classes',
	'Rehab',
	'Treatment',
	'Cord',
	'Blood',
];

export function BannerAds(props: { width: number; height: number }) {

	const bannerUnit = __DEV__
		? 'ca-app-pub-3940256099942544/6300978111'
		: AdmobConfig.bannerUnit;
	const getNewRequest = () => {
		// (firebase as any).admob().initialize(AdmobConfig.id);
		const request = new AdRequest();
		keyword.forEach(item => request.addKeyword(item))
		return request;
	};

	return (
		<Banner
			size={`${Math.floor(props.width)}x${props.height}`}
			request={getNewRequest().build()}
			unitId={bannerUnit}
			onAdLoaded={() => {
				console.log('Advert loaded');
			}}
			onAdFailedToLoad={(err: any) => {
				Alert.alert(`Admobs Trouble with id ${AdmobConfig.bannerUnit} `, JSON.stringify(err))
			}}
		/>
	);
}
