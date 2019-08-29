import React from 'react';
import { View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OctIcon from 'react-native-vector-icons/Octicons';
import { NavigationScreenOptions, MainStackRouterName } from '../../navigator';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { IconKeys } from '../../constants';
import { Colors, Font, GREY } from '../../theme';

export const MainNavOptions: NavigationScreenOptions = {
	title: 'Tasky',
	headerLeft: <MainHeader position={'LEFT'} />,
	headerRight: <MainHeader position={'RIGHT'} />,
	headerTitleStyle: {
		color: GREY[900],
		fontSize: Font.size.title,
		fontWeight: Font.weight.bold,
		alignSelf: 'center',
		textAlign: 'center',
		flex: 1,
	},
	headerStyle: {
		backgroundColor: 'white',
	},
	// headerTintColor: 'white',
};

function MainHeader(props: { position: 'LEFT' | 'RIGHT' }) {
	const { navigate } = useNavigation();
	const onPressSearch = useNavigationParam('onPressSearch');
	const pushToSearch = () => {
		navigate(MainStackRouterName.search);
	};

	const pushToAdd = () => {
		navigate(MainStackRouterName.task);
	};

	const pushToSetting = () => {
		navigate(MainStackRouterName.setting);
	};

	const Left = () => {
		return (
			<View style={{ flexDirection: 'row', marginLeft: 4 }}>
				{/* <Icon.Button
					size={32}
					onPress={pushToAdd}
					name={IconKeys.add}
					color={Colors.stormGray}
					backgroundColor={'transparent'}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}
				/> */}
				<Icon
					size={32}
					onPress={onPressSearch}
					name={IconKeys.search}
					color={GREY[900]}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginLeft: 16,
					}}
				/>
			</View>
		);
	};

	const Right = () => {
		return (
			<View style={{ marginRight: 4 }}>
				<OctIcon
					size={32}
					onPress={pushToSetting}
					name={'settings'}
					color={GREY[900]}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginRight: 16,
					}}
				/>
			</View>
		);
	};

	return <View>{props.position === 'LEFT' ? <Left /> : <Right />}</View>;
}
