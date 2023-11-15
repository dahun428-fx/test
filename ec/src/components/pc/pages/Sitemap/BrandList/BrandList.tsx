import { useTranslation } from 'react-i18next';
import styles from './BrandList.module.scss';
import { Link } from '@/components/pc/ui/links';
import { BrandGroup } from '@/utils/domain/brand';
import { url } from '@/utils/url';

type Props = {
	brandGroupList: BrandGroup[];
};

export const BrandList: React.VFC<Props> = ({ brandGroupList }) => {
	const [t] = useTranslation();

	return (
		<div>
			<h2 className={styles.title}>{t('pages.sitemap.brandList.title')}</h2>
			{brandGroupList.map(brandGroup => (
				<div key={brandGroup.groupName}>
					<h3 className={styles.groupTitle}>{brandGroup.groupName}</h3>
					<ul>
						{brandGroup.brandList.map(brand => (
							<li key={brand.brandCode} className={styles.item}>
								<Link href={url.brand(brand).default}>{brand.brandName}</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};
BrandList.displayName = 'BrandList';
