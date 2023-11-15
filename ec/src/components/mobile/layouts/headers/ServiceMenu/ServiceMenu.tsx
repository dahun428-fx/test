import Link from 'next/link';
import { VFC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { OrderQuoteLink } from './OrderQuoteLink';
import { useAuth } from './ServiceMenu.hooks';
import styles from './ServiceMenu.module.scss';
import { NagiLinkButton } from '@/components/mobile/ui/buttons';
import { Anchor } from '@/components/mobile/ui/links';
import { url } from '@/utils/url';

type CustomerServiceLink = {
	label: string;
	url: string;
	target?: '_blank';
	onClick?: () => void;
};

type OrderQuoteSectionLink = {
	label: string;
	url: string;
	disabled?: boolean;
};

/**
 * Service menu
 */
export const ServiceMenu: VFC = () => {
	const [t] = useTranslation();
	const { authenticated, isEcUser, permissions } = useAuth();

	const {
		hasOrderPermission,
		hasQuotePermission,
		hasOrderHistoryPermission,
		hasQuoteHistoryPermission,
	} = permissions;

	const lang = 'ENG';

	const notLoggedInLinks: CustomerServiceLink[] = authenticated
		? []
		: [
				{
					label: t(
						'mobile.components.layouts.headers.header.serviceMenu.aboutMisumiAccountRegistration'
					),
					url: url.registrationGuide,
				},
				{
					label: t(
						'mobile.components.layouts.headers.header.serviceMenu.newUser'
					),
					url: url.wos.userRegistration({
						// TODO: These params are not necessary for MY
						lang: 'en',
						clkid: 'clkid_MemReg_oth1_sc001_20194',
					}),
				},
		  ];

	const ecUserLinks: CustomerServiceLink[] = isEcUser
		? [
				{
					label: t(
						'mobile.components.layouts.headers.header.serviceMenu.registerPaymentMethod'
					),
					url: url.wos.upgradeAccount({ lang }),
					target: '_blank',
				},
		  ]
		: [];

	const customerServiceSectionLinks: CustomerServiceLink[] = [
		...notLoggedInLinks,
		...ecUserLinks,
		{
			label: t(
				'mobile.components.layouts.headers.header.serviceMenu.userGuide'
			),
			url: url.guide,
			target: '_blank',
		},
		{
			label: t('mobile.components.layouts.headers.header.serviceMenu.faq'),
			url: url.faq,
			target: '_blank',
		},
		{
			label: t('mobile.components.layouts.headers.header.serviceMenu.inquiry'),
			url: url.contact,
			target: '_blank',
		},
		{
			label: t(
				'mobile.components.layouts.headers.header.serviceMenu.contactUs'
			),
			url: url.contactUs,
		},
	];

	const orderQuoteLinks: OrderQuoteSectionLink[] = [
		{
			label: t('mobile.common.quote.quote'),
			url: url.wos.quote.quote({ lang }),
			disabled: authenticated && !hasQuotePermission,
		},
		{
			label: t('mobile.common.order.order'),
			url: url.wos.quote.quote({ lang }),
			disabled: authenticated && !hasOrderPermission,
		},
	];

	const orderQuoteHistoryLinks: OrderQuoteSectionLink[] = [
		{
			label: t('mobile.common.quote.history'),
			url: url.wos.quote.history({ lang }),
			disabled: authenticated && !hasQuoteHistoryPermission,
		},
		{
			label: t('mobile.common.order.history'),
			url: url.wos.order.history({ lang }),
			disabled: authenticated && !hasOrderHistoryPermission,
		},
	];

	return (
		<div className={styles.serviceMenu}>
			<div className={styles.orderQuoteSection}>
				<h2 className={styles.orderQuoteSectionHeading}>
					{t(
						'mobile.components.layouts.headers.header.serviceMenu.orderQuoteSectionTitle'
					)}
				</h2>

				<ul className={styles.orderQuoteList}>
					{orderQuoteLinks.map(link => (
						<li key={link.label} className={styles.orderQuoteListItem}>
							<OrderQuoteLink {...link} />
						</li>
					))}
				</ul>

				{!isEcUser && (
					<ul className={styles.orderQuoteList}>
						{orderQuoteHistoryLinks.map(link => (
							<li key={link.label} className={styles.orderQuoteListItem}>
								<OrderQuoteLink {...link} />
							</li>
						))}
					</ul>
				)}

				{isEcUser && (
					<div>
						<div className={styles.upgradeAccount}>
							<p>
								{t(
									'mobile.components.layouts.headers.header.serviceMenu.messageForEcUser'
								)}
							</p>
						</div>
						<div className={styles.upgradeAccountButtonWrapper}>
							<NagiLinkButton
								href={url.wos.upgradeAccount({ lang })}
								theme="secondary"
								className={styles.upgradeAccountButton}
							>
								{t(
									'mobile.components.layouts.headers.header.serviceMenu.selectPaymentMethod'
								)}
							</NagiLinkButton>
						</div>
					</div>
				)}

				<div className={styles.orderBox}>
					<ul>
						{authenticated && (
							<li className={styles.orderBoxLinkListItem}>
								<Link href={url.wos.returnRequest({ lang: 'en' })}>
									<a className={styles.orderBoxLinkListLink}>
										{t(
											'mobile.components.layouts.headers.header.serviceMenu.returnRequestList'
										)}
									</a>
								</Link>
							</li>
						)}
						{!isEcUser && (
							<>
								<li
									className={
										authenticated
											? styles.orderBoxLinkListItem
											: styles.orderBoxLinkListItemWithBorder
									}
								>
									<Link href={url.wos.shipment.history({ lang })}>
										<a className={styles.orderBoxLinkListLink}>
											{t(
												'mobile.components.layouts.headers.header.serviceMenu.shipmentHistory'
											)}
										</a>
									</Link>
								</li>
								<li className={styles.orderBoxLinkListItemWithBorder}>
									<Link href={url.wos.partNumberChecker}>
										<a className={styles.orderBoxLinkListLink} target="_blank">
											{t(
												'mobile.components.layouts.headers.header.serviceMenu.partNumberChecker'
											)}
										</a>
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
			<div className={styles.customerServiceSection}>
				<h2 className={styles.customerServiceSectionTitle}>
					{t(
						'mobile.components.layouts.headers.header.serviceMenu.customerService'
					)}
				</h2>
				<ul className={styles.customerServiceLinkList}>
					{customerServiceSectionLinks.map(link => (
						<li key={link.label} className={styles.customerServiceLinkListItem}>
							<Anchor
								target={link.target}
								href={link.url}
								className={styles.orderBoxLinkListLink}
							>
								{link.label}
							</Anchor>
						</li>
					))}
				</ul>
			</div>
			<div className={styles.workingHoursSection}>
				<div className={styles.businessTel}>
					<div>
						<Trans i18nKey="mobile.components.layouts.headers.header.serviceMenu.tel">
							<a className={styles.telNumber} href="tel:60378906399" />
						</Trans>
					</div>
					{/* <div>
						<Trans i18nKey="mobile.components.layouts.headers.header.serviceMenu.fax">
							<a className={styles.telNumber} href="tel:60379607499" />
						</Trans>
					</div> */}
				</div>
				<div className={styles.businessDay}>
					{t(
						'mobile.components.layouts.headers.header.serviceMenu.contactableTimeMessage'
					)}
				</div>
			</div>
		</div>
	);
};

ServiceMenu.displayName = 'ServiceMenu';
