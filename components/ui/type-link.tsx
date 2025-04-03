import { Link as ExpoLink } from 'expo-router';
import { ComponentProps, ReactNode } from 'react';

type AppRoute = 
  | '/'
  | '/index'
  | '/inventory'
  | '/orders'
  | '/stock'
  | '/adjustments'
  | '/transfers'
  | '/reports'
  | '/invoices'
  | '/customers'
  | '/settings'
  | '/help'
  | '/(tabs)'
  | '/(tabs)/index'
  | '/(tabs)/inventory'
  | '/(tabs)/orders'
  | '/(tabs)/stock'
  | '/(tabs)/adjustments'
  | '/(tabs)/transfers'
  | '/(tabs)/reports'
  | '/(tabs)/invoices'
  | '/(tabs)/customers'
  | '/(tabs)/settings'
  | '/(tabs)/help';

type LinkProps = Omit<ComponentProps<typeof ExpoLink>, 'href'> & {
  href: AppRoute;
  children: ReactNode;
};

export function Link({ href, ...props }: LinkProps) {
  return <ExpoLink href={href as any} {...props} />;
}
