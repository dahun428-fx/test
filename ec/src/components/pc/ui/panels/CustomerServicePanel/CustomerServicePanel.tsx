import classNames from 'classnames';
import { VFC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from './CustomerServicePanel.hooks';
import styles from './CustomerServicePanel.module.scss';
import { NagiLink } from '@/components/pc/ui/links';
import { url } from '@/utils/url';

type Props = {
	useTitle?: boolean;
	className?: string;
};

export const CustomerServicePanel: VFC<Props> = ({ useTitle, className }) => {
	const [t] = useTranslation();

	const lang = 'en';

	const { authenticated, isEcUser } = useAuth();

	const basicLinkList = [
		{
			label: t('components.ui.panels.customerServicePanel.userGuide'),
			url: url.guide,
		},
		{
			label: t('components.ui.panels.customerServicePanel.faq'),
			url: url.faq,
		},
		{
			label: t('components.ui.panels.customerServicePanel.inquiry'),
			url: url.contact,
		},
		{
			label: t('components.ui.panels.customerServicePanel.contactUs'),
			url: url.contactUs,
		},
	];

	const unauthenticatedLinkList = [
		{
			label: t('components.ui.panels.customerServicePanel.registrationGuide'),
			url: url.registrationGuide,
		},
		{
			label: t('components.ui.panels.customerServicePanel.newUser'),
			url: url.wos.userRegistration({
				lang: 'en',
				clkid: 'clkid_MemReg_oth1_sc001_20194',
			}),
		},
	];

	const ecUserLinkList = [
		{
			label: t(
				'components.ui.panels.customerServicePanel.paymentMethodRegistration'
			),
			url: url.wos.staticContents.paymentMethodGuide(lang),
		},
	];

	const linkList = !authenticated
		? [...unauthenticatedLinkList, ...basicLinkList]
		: isEcUser
		? [...ecUserLinkList, ...basicLinkList]
		: [...basicLinkList];

	return (
		<div className={classNames(styles.panel, className)}>
			{useTitle && (
				<h3 className={styles.title}>
					{t('components.ui.panels.customerServicePanel.title')}
				</h3>
			)}
			<ul className={styles.paragraph}>
				{linkList.map(link => (
					<li key={link.label} className={styles.link}>
						<NagiLink href={link.url} newTab>
							{link.label}
						</NagiLink>
					</li>
				))}
			</ul>
			<ul className={classNames(styles.paragraph, styles.list, styles.bold)}>
				<Trans i18nKey="components.ui.panels.customerServicePanel.contact">
					<li />
					<li />
				</Trans>
			</ul>
			<div className={styles.paragraph}>
				<div>
					{t(
						'components.ui.panels.customerServicePanel.contactableTimeMessage'
					)}
				</div>
			</div>
		</div>
	);
};
CustomerServicePanel.displayName = 'CustomerServicePanel';
