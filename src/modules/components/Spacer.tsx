import React from 'react';
import { View } from "react-native";

interface Props {
    space: number
}

export function Spacer(props: Props) {
    return <View style={{width: props.space}} />
}