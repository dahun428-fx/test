import classNames from 'classnames';
import React, { RefObject, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import styles from './Section.module.scss';

type Props = {
	aside?: React.ReactNode;
	className?: string;
	totalCount: number;
	stickyBottomSelector: string;
	headerBarRef: RefObject<HTMLDivElement>;
};

/** Section component for category */
export const Section: React.FC<Props> = ({
	aside,
	children,
	className,
	totalCount,
	stickyBottomSelector,
	headerBarRef,
}) => {
	const [t] = useTranslation();
	const [stickyStatus, setStickyStatus] = useState<Sticky.StatusCode>(
		Sticky.STATUS_ORIGINAL
	);

	return (
		<div className={className}>
			<Sticky
				bottomBoundary={stickyBottomSelector}
				innerActiveClass={styles.sticky}
				onStateChange={value => setStickyStatus(value.status)}
			>
				<div
					ref={headerBarRef}
					className={classNames(styles.panel, {
						[String(styles.panelFixed)]:
							stickyStatus === Sticky.STATUS_FIXED ||
							stickyStatus === Sticky.STATUS_RELEASED,
					})}
				>
					{!totalCount ? (
						<div className={styles.productNotFound}>
							{t('components.domain.category.section.productNotfound')}
						</div>
					) : (
						<>
							<div className={styles.totalItem}>
								<Trans
									i18nKey="components.domain.category.section.items"
									values={{ totalCount }}
								>
									<span className={styles.totalCount} />
								</Trans>
							</div>
							<div className={styles.tabList}>{aside}</div>
						</>
					)}
				</div>
			</Sticky>

			<div className={styles.contentsContainer}>{children}</div>
		</div>
	);
};
Section.displayName = 'Section';
