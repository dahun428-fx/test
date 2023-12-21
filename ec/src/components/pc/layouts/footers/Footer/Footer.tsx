import classNames from 'classnames';
import Image from 'next/image';
import Router from 'next/router';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from './Footer.hooks';
import styles from './Footer.module.scss';
import { FooterLink } from './FooterLink';
import fpxImage from './assets/payment/fpx.png';
import ibgImage from './assets/payment/ibg.png';
import mastercardImage from './assets/payment/mastercard.png';
import visaImage from './assets/payment/visa.png';
import { NagiLinkButton } from '@/components/pc/ui/buttons';
import { NagiLink } from '@/components/pc/ui/links';
import { pagesPath } from '@/utils/$path';
import { Cookie, setCookie } from '@/utils/cookie';
import { isMobile, ViewType } from '@/utils/device';
import { url } from '@/utils/url';
import { BnrBottomFix } from '../BnrBottomFix';
import { StackBalloon } from '../StackBalloon';

/**
 * Footer
 */
export const Footer: React.VFC = () => {
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';

	const [t] = useTranslation();
	const { authenticated, isEcUser, isPurchaseLinkUser } = useAuth();
	const isDeviceMobile = isMobile();

	const handleSwitchToMobile = (event: React.MouseEvent) => {
		event.preventDefault();

		setCookie(Cookie.VIEW_TYPE, ViewType.Mobile);
		setCookie(Cookie.VIEW_TYPE_LOG, ViewType.Mobile);

		Router.reload();
	};

	return (
		<footer className={styles.footer}>
			<div className={styles.contents}>
				{/* ========================== payment method ========================== */}
				{!isPurchaseLinkUser && (
					<>
						<div className={classNames(styles.heading, styles.paymentHeading)}>
							<h2>
								{t('components.ui.layouts.footers.footer.payment.method.title')}
							</h2>
							<NagiLink href={url.wos.staticContents.paymentMethodGuide(lang)}>
								{t('components.ui.layouts.footers.footer.payment.method.more')}
							</NagiLink>
						</div>
						<ul className={styles.payment}>
							<li className={styles.paymentGroupList}>
								<div className={styles.paymentTitle}>
									{t(
										'components.ui.layouts.footers.footer.payment.method.creditCard'
									)}
								</div>
								<ul className={styles.paymentMethodList}>
									<li className={styles.paymentMethodImage}>
										<Image
											src={visaImage}
											width="50"
											height="30"
											alt={t(
												'components.ui.layouts.footers.footer.payment.visa'
											)}
										/>
									</li>
									<li className={styles.paymentMethodImage}>
										<Image
											src={mastercardImage}
											width="50"
											height="30"
											alt={t(
												'components.ui.layouts.footers.footer.payment.mastercard'
											)}
										/>
									</li>
								</ul>
							</li>
							<li className={styles.paymentGroupList}>
								<div className={styles.paymentTitle}>
									{t(
										'components.ui.layouts.footers.footer.payment.method.bank'
									)}
								</div>
								<ul className={styles.paymentMethodList}>
									<li className={styles.paymentMethodImage}>
										<Image
											src={fpxImage}
											width="50"
											height="30"
											alt={t(
												'components.ui.layouts.footers.footer.payment.fpx'
											)}
										/>
									</li>
									<li className={styles.paymentMethodImage}>
										<Image
											src={ibgImage}
											width="118"
											height="30"
											alt={t(
												'components.ui.layouts.footers.footer.payment.ibg'
											)}
										/>
									</li>
								</ul>
							</li>
						</ul>
					</>
				)}
				{/* ========================== about ========================== */}
				<div className={styles.about}>
					<div className={styles.aboutBox}>
						<h2 className={styles.aboutTitle}>
							{t('components.ui.layouts.footers.footer.about.title.misumi')}
						</h2>
						<ul>
							<li className={styles.aboutItem}>
								<FooterLink href={url.companyProfile}>
									{t(
										'components.ui.layouts.footers.footer.about.misumi.profile'
									)}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink
									href={url.codeOfConduct}
									newTab={!isPurchaseLinkUser}
								>
									{t(
										'components.ui.layouts.footers.footer.about.misumi.codeOfConduct'
									)}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink href={url.irLibrary} newTab={!isPurchaseLinkUser}>
									{t('components.ui.layouts.footers.footer.about.misumi.ir')}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink href={url.misumiGroup} newTab={!isPurchaseLinkUser}>
									{t('components.ui.layouts.footers.footer.about.misumi.group')}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink href={url.career}>
									{t(
										'components.ui.layouts.footers.footer.about.misumi.career'
									)}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink href={url.rohs}>
									{t('components.ui.layouts.footers.footer.about.misumi.rohs')}
								</FooterLink>
							</li>
						</ul>
					</div>
					<div className={styles.aboutBox}>
						<h2 className={styles.aboutTitle}>
							{t('components.ui.layouts.footers.footer.about.title.site')}
						</h2>
						<ul>
							<li className={styles.aboutItem}>
								<FooterLink href={url.terms}>
									{t('components.ui.layouts.footers.footer.about.site.terms')}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink href={url.cancelPolicy}>
									{t(
										'components.ui.layouts.footers.footer.about.site.cancelPolicy'
									)}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink href={url.privacyPolicy}>
									{t(
										'components.ui.layouts.footers.footer.about.site.privacyPolicy'
									)}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink
									href={pagesPath.vona2.sitemap.$url().pathname}
									isAnchor={false}
								>
									{t('components.ui.layouts.footers.footer.about.site.sitemap')}
								</FooterLink>
							</li>
						</ul>
					</div>
					<div className={styles.aboutBox}>
						<h2 className={styles.aboutTitle}>
							{t('components.ui.layouts.footers.footer.about.title.tools')}
						</h2>
						<ul>
							<li className={styles.aboutItem}>
								<FooterLink href={url.misumiCad}>
									{t('components.ui.layouts.footers.footer.about.tools.cad')}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink href={url.misumiTechnicalData}>
									{t('components.ui.layouts.footers.footer.about.tools.tech')}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink href={url.inCadLibrary}>
									{t('components.ui.layouts.footers.footer.about.tools.incad')}
								</FooterLink>
							</li>
						</ul>
					</div>
					<div className={styles.aboutLastBox}>
						<h2 className={styles.aboutTitle}>
							{t(
								'components.ui.layouts.footers.footer.about.title.customerService'
							)}
						</h2>
						<ul>
							{!authenticated ? (
								<li className={styles.aboutItem}>
									<FooterLink href={url.registrationGuide}>
										{t(
											'components.ui.layouts.footers.footer.about.customerService.new'
										)}
									</FooterLink>
								</li>
							) : (
								isEcUser && (
									<li className={styles.aboutItem}>
										<FooterLink href={url.wos.upgradeAccount({ lang })} newTab>
											<Trans i18nKey="components.ui.layouts.footers.footer.about.customerService.upgradeAccount">
												<div />
												<div />
											</Trans>
										</FooterLink>
									</li>
								)
							)}
							<li className={styles.aboutItem}>
								<FooterLink href={url.guide}>
									{t(
										'components.ui.layouts.footers.footer.about.customerService.howToUse'
									)}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink href={url.contactUs}>
									{t(
										'components.ui.layouts.footers.footer.about.customerService.contact'
									)}
								</FooterLink>
							</li>
							<li className={styles.aboutItem}>
								<FooterLink
									href={url.misumiRegion}
									newTab={!isPurchaseLinkUser}
								>
									{t(
										'components.ui.layouts.footers.footer.about.customerService.region'
									)}
								</FooterLink>
							</li>
						</ul>
					</div>
				</div>
				{/* ========================== sns ========================== */}
				<h2 className={styles.snsHeading}>
					{t('components.ui.layouts.footers.footer.sns.title')}
				</h2>
				<div className={styles.sns}>
					<a
						className={styles.facebook}
						href={url.facebook}
						target="_blank"
						rel="noreferrer"
						aria-label="facebook"
					/>
				</div>
				{/* ========================== contact ========================== */}
				<div className={classNames(styles.heading, styles.contactHeading)}>
					<h2>{t('components.ui.layouts.footers.footer.contact.title')}</h2>
					<div className={styles.businessHour}>
						{t('components.ui.layouts.footers.footer.contact.businessHour')}
					</div>
				</div>
				<div className={styles.contact}>
					<ul className={styles.contactBox}>
						<li className={styles.contactNumber}>
							<div className={styles.contactTitle}>
								{t('components.ui.layouts.footers.footer.contact.tel.title')}
							</div>
							<div className={styles.contactValue}>
								{t('components.ui.layouts.footers.footer.contact.tel.value')}
							</div>
						</li>
						{/* <li className={styles.contactNumber}>
							<div className={styles.contactTitle}>
								{t('components.ui.layouts.footers.footer.contact.fax.title')}
							</div>
							<div className={styles.contactValue}>
								{t('components.ui.layouts.footers.footer.contact.fax.value')}
							</div>
						</li> */}
					</ul>
					<div className={styles.contactButtonBox}>
						<NagiLinkButton
							href={url.contact}
							size="s"
							theme="tertiary"
							target={isPurchaseLinkUser ? '_self' : '_blank'}
						>
							{t('components.ui.layouts.footers.footer.contact.button')}
						</NagiLinkButton>
					</div>
				</div>
				{/* ========================== view board ========================== */}
				{isDeviceMobile && (
					<div className={styles.switchToMobile}>
						<a
							href="#"
							onClick={handleSwitchToMobile}
							className={styles.switchToMobileLink}
						>
							{t('components.ui.layouts.footers.footer.mobile')}
						</a>
					</div>
				)}
				{/* ========================== copyright ========================== */}
				<div className={styles.copyright}>
					{t('components.ui.layouts.footers.footer.copyright')}
				</div>
			</div>
			{/* ========================== bnrBottom ========================== */}
			<BnrBottomFix />
		</footer>
	);
};
Footer.displayName = 'Footer';
