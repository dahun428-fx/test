import Link from 'next/link';
import React from 'react';
import styles from './MegaNavMenu.module.scss';
import elControlImage from '@/assets/mobile/images/icons/meganavi/el-control.png';
import elWireImage from '@/assets/mobile/images/icons/meganavi/el-wire.png';
import fsHelthImage from '@/assets/mobile/images/icons/meganavi/fs-health.png';
import fsLabImage from '@/assets/mobile/images/icons/meganavi/fs-lab.png';
import fsLogisticsImage from '@/assets/mobile/images/icons/meganavi/fs-logistics.png';
import fsMachiningImage from '@/assets/mobile/images/icons/meganavi/fs-machining.png';
import fsProcessingImage from '@/assets/mobile/images/icons/meganavi/fs-processing.png';
import injectionImage from '@/assets/mobile/images/icons/meganavi/injection.png';
import mechMaterialImage from '@/assets/mobile/images/icons/meganavi/mech-material.png';
import mechScrewImage from '@/assets/mobile/images/icons/meganavi/mech-screw.png';
import mechImage from '@/assets/mobile/images/icons/meganavi/mech.png';
import moldImage from '@/assets/mobile/images/icons/meganavi/mold.png';
import pressImage from '@/assets/mobile/images/icons/meganavi/press.png';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';

const imageMap: {
	[categoryCode: string]: string;
} = {
	mech: mechImage.src,
	mech_screw: mechScrewImage.src,
	mech_material: mechMaterialImage.src,
	el_wire: elWireImage.src,
	el_control: elControlImage.src,
	fs_machining: fsMachiningImage.src,
	fs_processing: fsProcessingImage.src,
	fs_logistics: fsLogisticsImage.src,
	fs_health: fsHelthImage.src,
	fs_lab: fsLabImage.src,
	press: pressImage.src,
	mold: moldImage.src,
	injection: injectionImage.src,
};

type Props = {
	categoryList: Category[];
};

/**
 * Mega nav menu.
 */
export const MegaNavMenu: React.FC<Props> = ({ categoryList }) => {
	return (
		<div className={styles.megaNavMenu}>
			<ul className={styles.list}>
				{categoryList?.map(category => (
					<li key={category.categoryCode} className={styles.megaNav}>
						<Link
							href={pagesPath.vona2
								._categoryCode([category.categoryCode])
								.$url()}
						>
							<a className={styles.link} data-icon={category.categoryCode}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={imageMap[category.categoryCode]}
									alt={category.categoryName}
									width={44}
									height={44}
									className={styles.categoryImage}
								/>
								<h4 className={styles.title}>{category.categoryName}</h4>
							</a>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};
MegaNavMenu.displayName = 'MegaNavMenu';
