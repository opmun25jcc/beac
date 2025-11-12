import * as React from 'react';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';
interface BsPrefixOptions<As extends React.ElementType = 'div'> {
    displayName?: string;
    Component?: As;
    defaultProps?: Partial<React.ComponentProps<As>>;
    propTypes?: any;
}
export default function createWithBsPrefix<P extends BsPrefixProps, As extends React.ElementType = 'div'>(prefix: string, { displayName, Component, defaultProps, propTypes }?: BsPrefixOptions<As>): BsPrefixRefForwardingComponent<As, P>;
export {};
