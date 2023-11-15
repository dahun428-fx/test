import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from '@/components/mobile/ui/links/Breadcrumbs';
import { config } from '@/config';
import { convertToURLString } from '@/utils/url';

/** props */
export type Props = {
	breadcrumbList: Breadcrumb[];
};

export const BreadcrumbsLinkedData: React.VFC<Props> = ({ breadcrumbList }) => {
	const { t } = useTranslation();
	const structuredData = useMemo(
		() => ({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: t('mobile.components.ui.links.breadcrumbs.home'),
					item: `${config.web.ec.origin}/`,
				},
				...breadcrumbList
					.filter((breadcrumb: Breadcrumb) => breadcrumb?.href != null) // NOTE: 現行仕様に従い、表示しているページはjson-ldに含めない
					.map((breadCrumb: Breadcrumb, i: number) => ({
						'@type': 'ListItem',
						position: i + 2,
						name: breadCrumb.text,
						item: breadCrumb.href
							? typeof breadCrumb.href === 'string'
								? breadCrumb.href
								: convertToURLString(breadCrumb.href)
							: undefined,
					})),
			],
		}),
		[breadcrumbList, t]
	);

	return (
		<script type="application/ld+json">{JSON.stringify(structuredData)}</script>
	);
};

BreadcrumbsLinkedData.displayName = 'BreadcrumbsLinkedData';
