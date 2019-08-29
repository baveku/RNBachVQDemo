import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Container } from '../bvcomp';

export function CalendarScreen() {
	const [state, setState] = useState({items: {}} as any);

	const loadItems = (day: any) => {
        setTimeout(() => {
            let items: any = state.items ? state.items: {};
			for (let i = -15; i < 85; i++) {
				const time = day.timestamp + i * 24 * 60 * 60 * 1000;
				const strTime = timeToString(time);
                if (!items[strTime]) {
                    items[strTime] = []
					const numItems = Math.floor(Math.random() * 5);
					for (let j = 0; j < numItems; j++) {
						items[strTime].push({
							name: 'Item for ' + strTime,
							height: Math.max(
								50,
								Math.floor(Math.random() * 150)
							),
						});
					}
				}
			}
			//console.log(this.state.items);
			let newItems: any = {};
			Object.keys(items).forEach(key => {
				newItems[key] = items[key];
			});
			setState({
				items: newItems,
			});
		}, 1000);
		// console.log(`Load Items for ${day.year}-${day.month}`);
	};

	const renderItem = (item: any) => {
		return (
			<View style={[styles.item, { height: item.height }]}>
				<Text>{item.name}</Text>
			</View>
		);
	};

	const renderEmptyDate = () => {
		return (
			<View style={styles.emptyDate}>
				<Text>This is empty date!</Text>
			</View>
		);
	};

	const rowHasChanged = (r1: any, r2: any) => {
		return r1.name !== r2.name;
	};

	const timeToString = (time: string) => {
		const date = new Date(time);
		return date.toISOString().split('T')[0];
	};

	return (
        <Agenda
            style={{width: '100%', height: '100%'}}
			items={state.items}
			loadItemsForMonth={loadItems}
			selected={'2019-08-02'}
			renderItem={renderItem}
			renderEmptyDate={renderEmptyDate}
			rowHasChanged={rowHasChanged}

		/>
	);
}

const styles = StyleSheet.create({
    item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
