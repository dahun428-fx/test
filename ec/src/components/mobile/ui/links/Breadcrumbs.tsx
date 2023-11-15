import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { UrlObject } from 'url';
import styles from './Breadcrumbs.module.scss';
import { Link } from '@/components/mobile/ui/links';
import { BreadcrumbsLinkedData } from '@/components/shared/seo/BreadcrumbsLinkedData';
import { pagesPath } from '@/utils/$path';

export type Breadcrumb = {
	/** text */
	text: string;
	/** link href */
	href?: string | UrlObject;
	/** link target */
	target?: `_blank` | `_self`;
};

/** props */
export type Props = {
	breadcrumbList: Breadcrumb[];
	/** true にすると text を html としてそのまま表示します */
	dangerouslyHtml?: boolean;
};

/**
 * Breadcrumbs component
 */
export const Breadcrumbs: VFC<Props> = ({
	breadcrumbList,
	dangerouslyHtml,
}) => {
	const { t } = useTranslation();
	//===========================================================================
	return (
		<>
			<div className={styles.breadcrumbArea}>
				<ul className={styles.breadcrumbList}>
					<li className={styles.breadcrumb}>
						<Link href={pagesPath.$url()}>
							{t('mobile.components.ui.links.breadcrumbs.home')}
						</Link>
					</li>
					{breadcrumbList.map((breadcrumb, index) => {
						const isLast = index === breadcrumbList.length - 1;

						return (
							<li className={styles.breadcrumb} key={index}>
								{breadcrumb.href ? (
									// Use Link if href is defined
									<Link
										href={breadcrumb.href}
										{...(!dangerouslyHtml
											? { children: breadcrumb.text }
											: {
													dangerouslySetInnerHTML: {
														__html: breadcrumb.text ?? '',
													},
											  })}
									/>
								) : isLast ? (
									// Use span if href is not defined
									<strong
										{...(!dangerouslyHtml
											? { children: breadcrumb.text }
											: {
													dangerouslySetInnerHTML: {
														__html: breadcrumb.text ?? '',
													},
											  })}
									/>
								) : (
									<span
										{...(!dangerouslyHtml
											? { children: breadcrumb.text }
											: {
													dangerouslySetInnerHTML: {
														__html: breadcrumb.text ?? '',
													},
											  })}
									/>
								)}
							</li>
						);
					})}
				</ul>
			</div>
			<BreadcrumbsLinkedData breadcrumbList={breadcrumbList} />
		</>
	);
};

Breadcrumbs.displayName = 'Breadcrumbs';
