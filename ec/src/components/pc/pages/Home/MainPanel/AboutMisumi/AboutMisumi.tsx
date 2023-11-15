import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styles from './AboutMisumi.module.scss';
import easyAccessImage from './assets/images/easy-access.png';
import easyQuoteOrderImage from './assets/images/easy-quote-order.png';
import freeCadDataImage from './assets/images/free-cad-data.png';
import freeCatalogImage from './assets/images/free-catalog.png';
import freeShippingImage from './assets/images/free-shipping.png';
import oneStopSolutionProviderImage from './assets/images/one-stop-solution-provider.png';
import { LinkButton } from '@/components/pc/ui/buttons';
import { selectAuthenticated } from '@/store/modules/auth';
import { url } from '@/utils/url';

/**
 * Why MISUMI
 */
export const AboutMisumi: React.VFC = () => {
	const [t] = useTranslation();

	// TODO: containerへ移動
	const authenticated = useSelector(selectAuthenticated);

	return (
		<div className={styles.wrapper}>
			<h2 className={styles.title}>Why MISUMI?</h2>
			<div>
				<ul className={styles.imageBox}>
					<li className={styles.image}>
						<Image
							src={freeCadDataImage}
							alt={t('pages.home.aboutMisumi.alt.freeCadData')}
							width="170"
							height="145"
						/>
					</li>
					<li className={styles.image}>
						<Image
							src={freeShippingImage}
							alt={t('pages.home.aboutMisumi.alt.freeShipping')}
							width="170"
							height="145"
						/>
					</li>
					<li className={styles.image}>
						<Image
							src={freeCatalogImage}
							alt={t('pages.home.aboutMisumi.alt.freeCatalog')}
							width="170"
							height="145"
						/>
					</li>
					<li className={styles.image}>
						<Image
							src={oneStopSolutionProviderImage}
							alt={t('pages.home.aboutMisumi.alt.oneStopSolutionProvide')}
							width="170"
							height="145"
						/>
					</li>
					<li className={styles.image}>
						<Image
							src={easyAccessImage}
							alt={t('pages.home.aboutMisumi.alt.easyAccess')}
							width="170"
							height="145"
						/>
					</li>
					<li className={styles.image}>
						<Image
							src={easyQuoteOrderImage}
							alt={t('pages.home.aboutMisumi.alt.easyQuoteOrder')}
							width="170"
							height="145"
						/>
					</li>
				</ul>
				{!authenticated && (
					<div className={styles.noticeBox}>
						<p className={styles.text}>{t('pages.home.aboutMisumi.notice')}</p>
						<div className={styles.buttonBox}>
							<LinkButton
								theme="conversion"
								className={styles.button}
								href={url.registrationGuide}
							>
								{t('pages.home.aboutMisumi.registration')}
							</LinkButton>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
AboutMisumi.displayName = 'AboutMisumi';
