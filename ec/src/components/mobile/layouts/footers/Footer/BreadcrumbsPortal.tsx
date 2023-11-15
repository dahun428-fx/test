import React, { ComponentProps, VFC } from 'react';
import { Breadcrumbs } from '@/components/mobile/ui/links/Breadcrumbs';
import { Portal } from '@/components/mobile/ui/portal';

/**
 * BreadcrumbsPortal component
 */
export const BreadcrumbsPortal: VFC<
	ComponentProps<typeof Breadcrumbs>
> = props => {
	return (
		<Portal id="breadcrumbs">
			<Breadcrumbs {...props} />
		</Portal>
	);
};

BreadcrumbsPortal.displayName = 'BreadcrumbsPortal';
