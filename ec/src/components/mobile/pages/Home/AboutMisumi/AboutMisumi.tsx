import Image from 'next/image';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AboutMisumi.module.scss';
import easyAccessImage from './assets/images/easy-access.png';
import easyQuoteOrderImage from './assets/images/easy-quote-order.png';
import freeCadDataImage from './assets/images/free-cad-data.png';
import freeCatalogImage from './assets/images/free-catalog.png';
import freeShippingImage from './assets/images/free-shipping.png';
import membershipRewardsImage from './assets/images/membership-rewards.png';
import moreProductsStockedImage from './assets/images/more-products-stocked.png';
import { NagiLinkButton } from '@/components/mobile/ui/buttons';
import { url } from '@/utils/url';

/**
 * About Misumi component
 */
export const AboutMisumi: React.VFC = () => {
	const [t] = useTranslation();

	const data = useMemo(
		() => [
			{
				image: freeCadDataImage,
				altText: t('mobile.pages.home.aboutMisumi.altTexts.freeCadData'),
				caption: t('mobile.pages.home.aboutMisumi.titles.freeCadData'),
				description: t(
					'mobile.pages.home.aboutMisumi.explainTexts.freeCadData'
				),
			},
			{
				image: freeShippingImage,
				altText: t('mobile.pages.home.aboutMisumi.altTexts.freeShipping'),
				caption: t('mobile.pages.home.aboutMisumi.titles.freeShipping'),
				description: t(
					'mobile.pages.home.aboutMisumi.explainTexts.freeShipping'
				),
			},
			{
				image: freeCatalogImage,
				altText: t('mobile.pages.home.aboutMisumi.altTexts.freeCatalog'),
				caption: t('mobile.pages.home.aboutMisumi.titles.freeCatalog'),
				description: t(
					'mobile.pages.home.aboutMisumi.explainTexts.freeCatalog'
				),
			},
			{
				image: moreProductsStockedImage,
				altText: t(
					'mobile.pages.home.aboutMisumi.altTexts.moreProductsStocked'
				),
				caption: t('mobile.pages.home.aboutMisumi.titles.moreProductsStocked'),
				description: t(
					'mobile.pages.home.aboutMisumi.explainTexts.moreProductsStocked'
				),
			},
			{
				image: easyAccessImage,
				altText: t('mobile.pages.home.aboutMisumi.altTexts.easyAccess'),
				caption: t('mobile.pages.home.aboutMisumi.titles.easyAccess'),
				description: t('mobile.pages.home.aboutMisumi.explainTexts.easyAccess'),
			},
			{
				image: easyQuoteOrderImage,
				altText: t('mobile.pages.home.aboutMisumi.altTexts.easyQuoteOrder'),
				caption: t('mobile.pages.home.aboutMisumi.titles.easyQuoteOrder'),
				description: t(
					'mobile.pages.home.aboutMisumi.explainTexts.easyQuoteOrder'
				),
			},
		],
		[t]
	);

	return (
		<div className={styles.container}>
			<h2 className={styles.noticeBoxTitle}>
				{t('mobile.pages.home.aboutMisumi.whyMisumi')}
			</h2>
			<div className={styles.noticeBoxMain}>
				<ul className={styles.noticeBoxImageBox}>
					{data.map((item, index) => (
						<li className={styles.noticeBoxImage} key={index}>
							<div className={styles.imageBox}>
								<Image
									src={item.image}
									alt={item.description}
									width={63}
									height={76}
								/>
							</div>
							<p className={styles.noticeBoxImageCaption}>{item.caption}</p>
							<p className={styles.noticeBoxImageDescription}>
								{item.description}
							</p>
						</li>
					))}
				</ul>
				<div className={styles.membershipRewardsBox}>
					<div className={styles.membershipRewardsImage}>
						<Image
							src={membershipRewardsImage}
							alt={t(
								'mobile.pages.home.aboutMisumi.altTexts.membershipRewards'
							)}
							width={63}
							height={76}
						/>
					</div>
					<div className={styles.membershipRewardsText}>
						<p className={styles.noticeBoxImageCaption}>
							{t('mobile.pages.home.aboutMisumi.titles.membershipRewards')}
						</p>
						<p className={styles.noticeBoxImageDescription}>
							{t(
								'mobile.pages.home.aboutMisumi.explainTexts.membershipRewards'
							)}
						</p>
					</div>
				</div>
				<div className={styles.noticeBoxButtonBox}>
					<NagiLinkButton href={url.registrationGuide} theme="secondary">
						{t('mobile.pages.home.aboutMisumi.registration')}
					</NagiLinkButton>
				</div>
			</div>
		</div>
	);
};
AboutMisumi.displayName = 'AboutMisumi';
