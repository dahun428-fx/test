import React from 'react';
import styles from './BnrBottomFix.module.scss';
import classNames from 'classnames';
import { useCompare, useStack } from './BnrBottomFix.hooks';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@/components/pc/ui/buttons';

export const BnrBottomFix: React.FC = () => {
	const { stackShowStatus, stackItemLen, setStackShowStatus } = useStack();
	const { compareShowStatus, compareItemLen, setCompareShowStatus } =
		useCompare();
	const { showMessage } = useMessageModal();

	const [t] = useTranslation();

	const handleClickCadDownloadModal = () => {
		setStackShowStatus(!stackShowStatus);
	};

	const handleClickCompareModal = () => {
		if (compareItemLen < 1) {
			showMessage({
				message: t(
					'components.ui.layouts.footers.compareBalloon.message.notSelected'
				),
				button: (
					<Button>
						{t('components.ui.layouts.footers.compareBalloon.close')}
					</Button>
				),
			});
			return;
		}

		setCompareShowStatus(!compareShowStatus);
	};

	return (
		<>
			<div className={classNames(styles.wrap, styles.show)} id="bottomFix">
				<div className={styles.content}>
					<div className={styles.left}>
						<ul>
							<li onClick={handleClickCadDownloadModal}>
								<a>
									<span className={styles.iconCad}>
										<Trans
											i18nKey="components.ui.layouts.footers.bnrBottomFix.cad"
											count={stackItemLen}
										>
											<span className={styles.iconCadNumber} />
										</Trans>
									</span>
								</a>
							</li>
							<li onClick={handleClickCompareModal}>
								<a>
									<span className={styles.iconCompare}>
										<Trans
											i18nKey="components.ui.layouts.footers.bnrBottomFix.compare"
											count={compareItemLen}
										>
											<span className={styles.iconCadNumber} />
										</Trans>
									</span>
								</a>
							</li>
							<li>
								<a>
									<span className={styles.iconOrder}>
										{t(
											'components.ui.layouts.footers.bnrBottomFix.quoteAndOrder'
										)}
									</span>
								</a>
							</li>
							<li>
								<a>
									<span className={styles.iconItem}>
										{t(
											'components.ui.layouts.footers.bnrBottomFix.myComponents'
										)}
									</span>
								</a>
							</li>
							<li>
								<a>
									<span className={styles.iconTech}>
										{t('components.ui.layouts.footers.bnrBottomFix.techInfo')}
									</span>
								</a>
							</li>
							<li>
								<a className={styles.iconCadHistory}>
									<span className={styles.iconDesign}>
										{t(
											'components.ui.layouts.footers.bnrBottomFix.cadDesignHistory'
										)}
									</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<button type="button" className={classNames(styles.fold, styles.active)}>
				{t('components.ui.layouts.footers.bnrBottomFix.fold')}
			</button>
			<button type="button" className={styles.unfold}>
				{t('components.ui.layouts.footers.bnrBottomFix.unfold')}
			</button>
		</>
	);
};

BnrBottomFix.displayName = 'BnrBottomFix';
