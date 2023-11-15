import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BrandList.module.scss';
import { Section } from '@/components/pc/pages/KeywordSearch/Section';
import { Link } from '@/components/pc/ui/links';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { url } from '@/utils/url';

type Props = {
	className?: string;
	keyword: string;
	brandList: Brand[];
	onClick: (
		index: number,
		brand: Pick<Brand, 'brandCode' | 'brandUrlCode'>
	) => void;
};

/**
 * Brand list
 */
export const BrandList: React.VFC<Props> = ({
	className,
	keyword,
	brandList,
	onClick,
}) => {
	const { t } = useTranslation();

	if (!brandList.length) {
		return null;
	}

	return (
		<Section
			id="brandList"
			className={className}
			title={t('pages.keywordSearch.brandList.heading')}
		>
			<ul className={styles.container}>
				{brandList.map((brand, index) => (
					<li key={brand.brandCode} className={styles.brand}>
						{/* TODO: replace href when brand page made */}
						<Link
							href={url.brand(brand).fromKeywordSearch(keyword)}
							newTab
							onClick={() => onClick(index, brand)}
						>
							{brand.brandName}
						</Link>
					</li>
				))}
			</ul>
		</Section>
	);
};
BrandList.displayName = 'BrandList';
