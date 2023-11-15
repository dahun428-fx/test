import classNames from 'classnames';
import { Fragment, useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
	usePartNumberSpecList,
	SPEC_VALUE_FALLBACK,
} from './PartNumberSpecList.hooks';
import styles from './PartNumberSpecList.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { chunk } from '@/utils/collection';
import { getSpecName } from '@/utils/domain/spec';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

const INITIAL_ROW_COUNT = 30;

/** Part number spec list */
export const PartNumberSpecList = () => {
	const [t] = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);
	const { specList, isPartNumberComplete } = usePartNumberSpecList();

	const specListPairs = chunk(specList, 2);

	const onClickRohs = (event: MouseEvent) => {
		event.preventDefault();
		openSubWindow(url.rohs, 'rohs', {
			width: 990,
			height: 800,
		});
	};

	if (!isPartNumberComplete && specList.length === 0) {
		return null;
	}

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>
				{t('pages.productDetail.partNumberSpecList.title')}
			</h3>
			<div className={styles.table}>
				{specListPairs
					.slice(0, isExpanded ? undefined : INITIAL_ROW_COUNT)
					.map((pairs, index) => (
						<div key={index} className={styles.row}>
							{pairs.map((spec, index) => {
								return (
									<Fragment key={index}>
										<div
											className={classNames(styles.cell, styles.headingCell)}
										>
											{spec.specType === 'spec' ||
											spec.specType === 'regulation' ||
											spec.specType === 'alteration' ? (
												<span
													dangerouslySetInnerHTML={{
														__html: getSpecName(spec),
													}}
												/>
											) : spec.specType === 'rohs' ? (
												<>
													{t('pages.productDetail.partNumberSpecList.rohs')}
													<span className={styles.rohsLink}>
														<a
															target="_blank"
															href={url.rohs}
															onClick={onClickRohs}
															rel="noreferrer"
														>
															<span className={styles.rohsQuestion}>?</span>
														</a>
													</span>
												</>
											) : null}
										</div>
										<div className={classNames(styles.cell, styles.valueCell)}>
											<span
												dangerouslySetInnerHTML={{
													__html: spec.specValueDisp,
												}}
											/>
										</div>
									</Fragment>
								);
							})}
							{pairs.length === 1 && (
								<>
									<div className={classNames(styles.cell, styles.headingCell)}>
										{SPEC_VALUE_FALLBACK}
									</div>
									<div className={classNames(styles.cell, styles.valueCell)}>
										{SPEC_VALUE_FALLBACK}
									</div>
								</>
							)}
						</div>
					))}
			</div>
			{specListPairs.length > INITIAL_ROW_COUNT && (
				<div className={styles.buttonWrapper}>
					<div className={styles.expandButton}>
						<Button
							theme="default-sub"
							icon={isExpanded ? 'minus' : 'plus'}
							onClick={() => setIsExpanded(prev => !prev)}
						>
							{isExpanded
								? t('pages.productDetail.partNumberSpecList.showLess')
								: t('pages.productDetail.partNumberSpecList.showMore')}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

PartNumberSpecList.displayName = 'PartNumberSpecList';
