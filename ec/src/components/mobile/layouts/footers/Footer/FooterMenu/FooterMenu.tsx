import Image from 'next/image';
import React, { ReactElement, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './FooterMenu.module.scss';
import facebookLogo from './assets/images/facebook-logo.svg';
import fpxPaymentIcon from './assets/images/payment-fpx.png';
import ibgPaymentIcon from './assets/images/payment-ibg.png';
import masterCardPaymentIcon from './assets/images/payment-mastercard.png';
import visaPaymentIcon from './assets/images/payment-visa.png';
import {
	useAuth,
	useTopCategoryList,
} from '@/components/mobile/layouts/footers/Footer/Footer.hooks';
import { TopCategoryItem } from '@/components/mobile/layouts/footers/Footer/TopCategoryItem';
import { Collapsible } from '@/components/mobile/ui/collapsible';
import { Link, LinkListItem } from '@/components/mobile/ui/links';
import { pagesPath } from '@/utils/$path';
import { getUrlPath, url } from '@/utils/url';

type LinkItem = {
	label: string | ReactElement;
	url: string;
	newTab?: boolean;
	isAnchor?: boolean;
};
export const FooterMenu: React.VFC = () => {
	const { t } = useTranslation();
	const { isECUser, authenticated } = useAuth();
	const categoryList = useTopCategoryList();

	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';

	const aboutMisumiLinks = useMemo<LinkItem[]>(
		() => [
			{
				label: t('mobile.components.layouts.footers.footer.companyProfile'),
				url: url.companyProfile,
			},
			{
				label: t('mobile.components.layouts.footers.footer.codeOfConduct'),
				url: url.codeOfConduct,
				newTab: true,
			},
			{
				label: t('mobile.components.layouts.footers.footer.irLibrary'),
				url: url.irLibrary,
				newTab: true,
			},
			{
				label: t('mobile.components.layouts.footers.footer.misumiGroupInc'),
				url: url.misumiGroup,
				newTab: true,
			},
			{
				label: t('mobile.components.layouts.footers.footer.career'),
				url: url.career,
			},
			{
				label: t('mobile.components.layouts.footers.footer.rohsInformation'),
				url: url.rohs,
			},
		],
		[t]
	);

	const aboutThisWebsiteLinks = useMemo<LinkItem[]>(
		() => [
			{
				label: t('mobile.components.layouts.footers.footer.termsAndConditions'),
				url: url.terms,
			},
			{
				label: t('mobile.components.layouts.footers.footer.cancellationPolicy'),
				url: url.cancelPolicy,
			},
			{
				label: t('mobile.components.layouts.footers.footer.privacyPolicy'),
				url: url.privacyPolicy,
			},
			{
				label: t('mobile.components.layouts.footers.footer.sitemap'),
				url: getUrlPath(pagesPath.vona2.sitemap.$url()),
				isAnchor: false,
			},
		],
		[t]
	);

	const usefulToolsLinks = useMemo<LinkItem[]>(
		() => [
			{
				label: t('mobile.components.layouts.footers.footer.cadDataDownload'),
				url: url.misumiCad,
			},
			{
				label: t('mobile.components.layouts.footers.footer.technicalData'),
				url: url.misumiTechnicalData,
			},
			{
				label: t('mobile.components.layouts.footers.footer.inCadLibrary'),
				url: url.inCadLibrary,
			},
			{
				label: t('mobile.components.layouts.footers.footer.brandList'),
				url: url.brandList,
				isAnchor: false,
			},
			{
				label: t(
					'mobile.components.layouts.footers.footer.misumiBrandCategories'
				),
				url: url.brandCategoryMisumi,
				isAnchor: false,
			},
		],
		[t]
	);

	const customerServiceLinks: LinkItem[] = useMemo(() => {
		const serviceLinks: LinkItem[] = [];
		if (!authenticated) {
			serviceLinks.push({
				label: t('mobile.components.layouts.footers.footer.newUser'),
				url: url.registrationGuide,
			});
		} else if (isECUser) {
			serviceLinks.push({
				label: (
					<Trans i18nKey="mobile.components.layouts.footers.footer.upgradeAccount">
						<div />
						<div />
					</Trans>
				),
				url: url.wos.upgradeAccount({ lang }),
				newTab: true,
			});
		}

		serviceLinks.push(
			{
				label: t('mobile.components.layouts.footers.footer.howToUse'),
				url: url.guide,
				newTab: true,
			},
			{
				label: t('mobile.components.layouts.footers.footer.contactUs'),
				url: url.contactUs,
			}
		);

		return serviceLinks;
	}, [authenticated, isECUser, t]);

	return (
		<div className={styles.footerTop}>
			<Collapsible
				title={t('mobile.components.layouts.footers.footer.paymentMethod')}
				theme="secondary"
			>
				<ul className={styles.paymentMethodWrapper}>
					<li className={styles.paymentMethods}>
						<div className={styles.methodItem}>
							<div className={styles.methodName}>
								{t('mobile.components.layouts.footers.footer.creditCard')}
							</div>
							<div className={styles.methodContent}>
								<div className={styles.methodImage}>
									<Image
										src={visaPaymentIcon}
										alt={t('mobile.components.layouts.footers.footer.visa')}
										title={t('mobile.components.layouts.footers.footer.visa')}
										width={50}
										height={30}
									/>
								</div>

								<div className={styles.methodImage}>
									<Image
										src={masterCardPaymentIcon}
										alt={t(
											'mobile.components.layouts.footers.footer.mastercard'
										)}
										title={t(
											'mobile.components.layouts.footers.footer.mastercard'
										)}
										width={50}
										height={30}
										className={styles.methodImage}
									/>
								</div>
							</div>
						</div>
						<div className={styles.methodItem}>
							<div className={styles.methodName}>
								{t('mobile.components.layouts.footers.footer.bankTransfer')}
							</div>
							<div className={styles.methodContent}>
								<div className={styles.methodImage}>
									<Image
										src={fpxPaymentIcon}
										alt={t('mobile.components.layouts.footers.footer.fpx')}
										title={t('mobile.components.layouts.footers.footer.fpx')}
										width={50}
										height={30}
									/>
								</div>

								<div className={styles.methodImage}>
									<Image
										src={ibgPaymentIcon}
										alt={t('mobile.components.layouts.footers.footer.ibg')}
										title={t('mobile.components.layouts.footers.footer.ibg')}
										width={118}
										height={30}
									/>
								</div>
							</div>
						</div>
					</li>
					<LinkListItem
						href={url.wos.staticContents.paymentMethodGuide(lang)}
						newTab
					>
						{t('mobile.components.layouts.footers.footer.more')}
					</LinkListItem>
				</ul>
			</Collapsible>

			<Collapsible
				title={t('mobile.components.layouts.footers.footer.aboutMisumi')}
				theme="secondary"
			>
				<LinkList items={aboutMisumiLinks} />
			</Collapsible>

			<Collapsible
				title={t('mobile.components.layouts.footers.footer.aboutThisWebsite')}
				theme="secondary"
			>
				<LinkList items={aboutThisWebsiteLinks} />
			</Collapsible>

			<Collapsible
				title={t('mobile.components.layouts.footers.footer.usefulTool')}
				theme="secondary"
			>
				<LinkList items={usefulToolsLinks} />
			</Collapsible>

			<Collapsible
				title={t('mobile.components.layouts.footers.footer.customerService')}
				theme="secondary"
			>
				<LinkList items={customerServiceLinks} />
			</Collapsible>

			<Collapsible
				title={t('mobile.components.layouts.footers.footer.socialMedia')}
				theme="secondary"
			>
				<ul>
					<li className={styles.socialItem}>
						<Link href={url.facebook} newTab className={styles.socialLinkItem}>
							<Image
								src={facebookLogo}
								width={30}
								height={30}
								alt={t('mobile.components.layouts.footers.footer.facebook')}
							/>
						</Link>
					</li>
				</ul>
			</Collapsible>

			<Collapsible
				title={t('mobile.components.layouts.footers.footer.misumiContact')}
				theme="secondary"
			>
				<ul className={styles.contact}>
					<li className={styles.contactItem}>
						{t('mobile.components.layouts.footers.footer.workTimes')}
					</li>
					<li className={styles.contactItem}>
						<Trans i18nKey="mobile.components.layouts.footers.footer.tel">
							Tel:
							<a className={styles.highlightNumber} href="tel:60378906399">
								(60) 3 7890 6399
							</a>
						</Trans>
					</li>
					{/* <li className={styles.contactItem}>
						<Trans i18nKey="mobile.components.layouts.footers.footer.fax">
							Fax:
							<span className={styles.highlightNumber}>(60) 3 7960 7499</span>
						</Trans>
					</li> */}
					<LinkListItem href={url.contact} newTab>
						{t('mobile.components.layouts.footers.footer.inquiry')}
					</LinkListItem>
				</ul>
			</Collapsible>
			<Collapsible
				title={t('mobile.components.layouts.footers.footer.searchByCategory')}
				theme="secondary"
			>
				<ul>
					{categoryList?.map(category => (
						<TopCategoryItem key={category.categoryCode} category={category} />
					))}
				</ul>
			</Collapsible>
		</div>
	);
};
FooterMenu.displayName = 'FooterMenu';

const LinkList: React.VFC<{ items: LinkItem[] }> = ({ items }) => {
	return (
		<ul className={styles.linkList}>
			{items.map((item, index) => (
				<LinkListItem
					key={`${item.label}-${index}`}
					href={item.url}
					newTab={item.newTab}
					isAnchor={item.isAnchor}
				>
					{item.label}
				</LinkListItem>
			))}
		</ul>
	);
};
LinkList.displayName = 'LinkList';
