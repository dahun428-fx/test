import classNames from 'classnames';
import { t } from 'i18next';
import { useCallback, useEffect, useState, VFC } from 'react';
import styles from './MakerGroup.module.scss';
import { Option } from '@/components/pc/pages/maker/MakerList/MakerNavigation';
import { Link } from '@/components/pc/ui/links';
import { BrandGroup } from '@/utils/domain/brand';
import { url } from '@/utils/url';

type Props = {
	brandGroupList: BrandGroup[];
	selected: Option;
};

/** Maker group */
export const MakerGroup: VFC<Props> = ({ brandGroupList, selected }) => {
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	const handleWindowResize = useCallback(() => {
		setIsSmallScreen(window.innerWidth <= 1150);
	}, []);

	useEffect(() => {
		handleWindowResize();
		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, [handleWindowResize]);

	return (
		<div className={styles.wrapper}>
			<h2 className={styles.heading}>
				{t('pages.maker.makerGroup.searchByLetter', { letter: selected })}
			</h2>
			{brandGroupList.map(brandGroup => {
				return (
					<div key={brandGroup.groupName} id={`line_${brandGroup.groupName}`}>
						<h3 className={styles.groupName}>{brandGroup.groupName}</h3>
						<ul className={styles.brandList}>
							{brandGroup.brandList.map(brand => {
								return (
									<li
										key={brand.brandCode}
										className={classNames(styles.brandItem, {
											[String(styles.small)]: isSmallScreen,
										})}
									>
										<Link href={url.brand(brand).default}>
											{brand.brandName}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				);
			})}
		</div>
	);
};
MakerGroup.displayName = 'MakerGroup';
