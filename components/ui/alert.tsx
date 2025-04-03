import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from './text';

interface AlertProps {
  style?: ViewStyle;
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

interface AlertDescriptionProps {
  style?: TextStyle;
  children: React.ReactNode;
}

export function Alert({ style, children, variant = 'default' }: AlertProps) {
  return (
    <View style={[
      styles.alert,
      variant === 'destructive' && styles.destructive,
      style
    ]}>
      {children}
    </View>
  );
}

export function AlertDescription({ style, children }: AlertDescriptionProps) {
  return (
    <Text style={[styles.description, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  alert: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E6F4EA',
  },
  destructive: {
    backgroundColor: '#FEE2E2',
  },
  description: {
    fontSize: 14,
    color: '#000',
  },
}); 