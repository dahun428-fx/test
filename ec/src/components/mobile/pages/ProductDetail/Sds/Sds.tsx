import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Sds.module.scss';
import { ButtonBase } from '@/components/mobile/ui/buttons/ButtonBase';
import { Msds } from '@/models/api/msm/ect/series/shared';

type Props = {
	msdsList: Msds[];
};

/** SDS PDF button and SDS PDF download links balloon */
export const Sds: React.VFC<Props> = ({ msdsList }) => {
	const [t] = useTranslation();
	const [showsLinkList, setShowsLinkList] = useState(false);

	const toggleLinkList = () => {
		setShowsLinkList(prev => !prev);
	};

	return (
		<div className={styles.container}>
			<ButtonBase className={styles.sdsButton} onClick={toggleLinkList}>
				{t('mobile.pages.productDetail.sdsPdfDownloadButton.label')}
			</ButtonBase>
			{showsLinkList && (
				<div className={styles.balloonBox}>
					<ul className={styles.linkList}>
						{msdsList.map((item, index) => {
							return (
								<li className={styles.linkListItem} key={index}>
									<a
										className={styles.linkListItemLink}
										href={item.url}
										target="_blank"
										rel="noreferrer"
										dangerouslySetInnerHTML={{ __html: item.productCode ?? '' }}
									/>
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</div>
	);
};
Sds.displayName = 'Sds';
