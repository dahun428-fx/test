import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import type { Props } from './LegacyStyledHtml';

const RawComponent = dynamic<Props>(
	import('./LegacyStyledHtml').then(modules => modules.LegacyStyledHtml),
	{ ssr: false }
);

export const LegacyStyledHtml = forwardRef<HTMLElement, Props>((props, ref) => {
	return <RawComponent {...props} htmlRef={ref} />;
});
LegacyStyledHtml.displayName = 'LegacyStyledHtml';
