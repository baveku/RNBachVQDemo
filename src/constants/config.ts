import { Platform } from "react-native";

const iOS_CONFIG = {
		id: 'ca-app-pub-4945605129509909~1928488750',
		unitId: 'ca-app-pub-4945605129509909/1295710158',
		bannerUnit: 'ca-app-pub-4945605129509909/8117404844',
	}

const android_CONFIG = {
	id: 'ca-app-pub-4945605129509909~9064742746',
	unitId: 'ca-app-pub-4945605129509909/4157677213',
	bannerUnit: 'ca-app-pub-4945605129509909/2404067254',
};

export const AdmobConfig = Platform.OS === 'ios' ? iOS_CONFIG : android_CONFIG;