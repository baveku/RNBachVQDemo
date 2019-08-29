import React, { Children, useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle, StyleSheet, TextProps } from "react-native";
import { useSelector } from 'react-redux';
import {fontSelector} from '../../core/modules';

interface Props extends TextProps {
    defaultSize?: number;
    children?: any;
}

export function BText(props: Props) {
    const fontSizeUp = useSelector(fontSelector);
    const getSize = () => (props.defaultSize ? props.defaultSize : 14) + fontSizeUp;

    return <Text style={[props.style, { fontSize: getSize() }]}>{props.children}</Text>
}