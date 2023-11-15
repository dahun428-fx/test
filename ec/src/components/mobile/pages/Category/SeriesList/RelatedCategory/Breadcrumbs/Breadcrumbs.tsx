import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { UrlObject } from 'url';
import styles from './Breadcrumbs.module.scss';
import { Link } from '@/components/mobile/ui/links';
import { pagesPath } from '@/utils/$path';

export type Breadcrumb = {
	/** text */
	text: string;
	/** link href */
	href?: string | UrlObject;
};

/** props */
export type Props = {
	breadcrumbList: Breadcrumb[];
};

/**
 * Breadcrumbs component
 */
export const Breadcrumbs: VFC<Props> = ({ breadcrumbList }) => {
	const { t } = useTranslation();

	return (
		<ul className={styles.linkListContainer}>
			<li className={styles.item}>
				<Link href={pagesPath.$url()}>
					{t('mobile.components.ui.links.breadcrumbs.home')}
				</Link>
			</li>
			{breadcrumbList.map(
				(breadcrumb, key) =>
					// Use Link if href is defined
					breadcrumb.href && (
						<li key={key} className={styles.item}>
							<Link
								href={breadcrumb.href}
								className={styles.link}
								dangerouslySetInnerHTML={{
									__html: breadcrumb.text ?? '',
								}}
							/>
						</li>
					)
			)}
		</ul>
	);
};
Breadcrumbs.displayName = 'Breadcrumbs';
