import { useTranslation } from 'react-i18next';
import styles from './BrandList.module.scss';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { Link } from '@/components/mobile/ui/links';
import { pagesPath } from '@/utils/$path';
import { BrandGroup } from '@/utils/domain/brand';

type Props = {
	brandGroupList: BrandGroup[];
};

/**
 * Brand list component
 */
export const BrandList: React.VFC<Props> = ({ brandGroupList }) => {
	const [t] = useTranslation();

	return (
		<div>
			<SectionHeading>
				{t('mobile.pages.sitemap.brandList.title')}
			</SectionHeading>
			{brandGroupList.map(brandGroup => (
				<div key={brandGroup.groupName}>
					<h3 className={styles.groupTitle}>{brandGroup.groupName}</h3>
					<ul>
						{brandGroup.brandList.map(brand => (
							<li key={brand.brandCode} className={styles.item}>
								<Link
									href={pagesPath.vona2.maker
										._brandCode(brand.brandUrlCode ?? brand.brandCode)
										.$url()}
									className={styles.link}
								>
									{brand.brandName}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};
BrandList.displayName = 'BrandList';
