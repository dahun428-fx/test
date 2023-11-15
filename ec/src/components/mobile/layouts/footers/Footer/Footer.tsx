import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.scss';
import { Link } from '@/components/mobile/ui/links';
import { Cookie, setCookie } from '@/utils/cookie';
import { ViewType } from '@/utils/device';
import { url } from '@/utils/url';

// eslint-disable-next-line @typescript-eslint/ban-types
const FooterMenu = dynamic<{}>(
	import('./FooterMenu').then(modules => modules.FooterMenu),
	{ ssr: false }
);

type Props = {
	className?: string;
};

/** Footer component */
export const Footer: React.VFC<Props> = ({ className }) => {
	/** translator */
	const { t } = useTranslation();

	const handleSwitchToPC = useCallback((event: React.MouseEvent) => {
		event.preventDefault();

		setCookie(Cookie.VIEW_TYPE, ViewType.PC);
		setCookie(Cookie.VIEW_TYPE_LOG, ViewType.PC);

		Router.reload();
	}, []);

	return (
		<footer className={classNames(styles.footerWrapper, className)}>
			<FooterMenu />

			<div className={styles.footerBottom}>
				<div className={styles.globalListWrapper}>
					<div className={styles.globalList}>
						<div className={styles.worldWideWrapper}>
							<Link target="_blank" href={url.misumiRegion} theme="secondary">
								{t(
									'mobile.components.layouts.footers.footer.countryRegionLanguage'
								)}
							</Link>
						</div>
					</div>

					<div className={styles.switchToPC}>
						{t('mobile.components.layouts.footers.footer.viewMode')} :{' '}
						{t('mobile.components.layouts.footers.footer.mobile')} |{' '}
						<a
							href="#"
							onClick={handleSwitchToPC}
							className={styles.switchToPCLink}
						>
							{t('mobile.components.layouts.footers.footer.pc')}
						</a>
					</div>
				</div>
				<div id="breadcrumbs" />
				<p className={styles.copyright}>
					{t('mobile.components.layouts.footers.footer.copyright')}
				</p>
			</div>
		</footer>
	);
};

Footer.displayName = 'Footer';
