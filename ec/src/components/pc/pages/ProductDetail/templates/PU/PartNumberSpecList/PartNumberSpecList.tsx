import classNames from 'classnames';
import { Fragment, useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
	usePartNumberSpecList,
	SPEC_VALUE_FALLBACK,
} from './PartNumberSpecList.hooks';
import styles from './PartNumberSpecList.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { OverlayLoader } from '@/components/pc/ui/loaders';
import { selectPartNumberListLoading } from '@/store/modules/pages/productDetail';
import { chunk } from '@/utils/collection';
import { getSpecName } from '@/utils/domain/spec';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

const INITIAL_ROW_COUNT = 6;

type Props = {
	showStandardSpec?: boolean;
};

/** Part number spec list */
export const PartNumberSpecList: React.FC<Props> = ({ showStandardSpec }) => {
	const [t] = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);
	const { specList, isPartNumberComplete } =
		usePartNumberSpecList(showStandardSpec);
	const isPartNumberListLoading = useSelector(selectPartNumberListLoading);

	const specListPairs = chunk(specList, showStandardSpec ? 3 : 2);

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
			<h2 className={styles.title}>
				{showStandardSpec
					? t('pages.productDetail.pu.partNumberSpecList.standardSpecTitle')
					: t('pages.productDetail.pu.partNumberSpecList.title')}
			</h2>
			<div className={styles.table}>
				{specListPairs
					.slice(0, isExpanded ? undefined : INITIAL_ROW_COUNT)
					.map((pairs, index) => (
						<div key={index} className={styles.row}>
							{pairs.map((spec, index) => {
								return (
									<Fragment key={index}>
										<div
											className={classNames(styles.cell, styles.headingCell, {
												[String(styles.standardHeadingCell)]: showStandardSpec,
											})}
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
													{t('pages.productDetail.pu.partNumberSpecList.rohs')}
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
										<div
											className={classNames(styles.cell, styles.valueCell, {
												[String(styles.standardValueCell)]: showStandardSpec,
											})}
										>
											<span
												dangerouslySetInnerHTML={{
													__html: spec.specValueDisp,
												}}
											/>
										</div>
									</Fragment>
								);
							})}
							{pairs.length === 1 && !showStandardSpec && (
								<>
									<div className={classNames(styles.cell, styles.styles)}>
										{SPEC_VALUE_FALLBACK}
									</div>
									<div className={classNames(styles.cell, styles.valueCell)}>
										{SPEC_VALUE_FALLBACK}
									</div>
								</>
							)}

							{pairs.length < 3 && showStandardSpec && (
								<>
									<div className={classNames(styles.noBorder)}></div>
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
								? t('pages.productDetail.pu.partNumberSpecList.showLess')
								: t('pages.productDetail.pu.partNumberSpecList.showMore')}
						</Button>
					</div>
				</div>
			)}
			<OverlayLoader show={isPartNumberListLoading} noFocusChange />
		</div>
	);
};

PartNumberSpecList.displayName = 'PartNumberSpecList';
