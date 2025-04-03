import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';

interface TextProps {
  style?: TextStyle;
  children: React.ReactNode;
}

export function Text({ style, children }: TextProps) {
  return (
    <RNText style={[styles.text, style]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000',
  },
}); 