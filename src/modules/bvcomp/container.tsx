import React from 'react';
import { View, StyleSheet, StyleProp, ViewProps } from 'react-native';

interface Props {
    children: any;
    style?: StyleProp<ViewProps>;
}

export function Container(props: Props) {
    return (
        <View style={[styles.main, props.style]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    }
})