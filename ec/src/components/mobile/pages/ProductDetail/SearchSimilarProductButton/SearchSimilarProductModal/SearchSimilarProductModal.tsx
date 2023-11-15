import NextLink from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './SearchSimilarProductModal.module.scss';
import { addLog } from '@/api/services/addLog';
import { Button, LinkButton } from '@/components/mobile/ui/buttons';
import { Modal, ModalCloser } from '@/components/mobile/ui/modals';
import { ga } from '@/logs/analytics/google';
import { Flag } from '@/models/api/Flag';
import SimilarSearchType from '@/models/api/constants/SimilarSearchType';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import {
	PartNumberSpecValue,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse';
import { getSpecName } from '@/utils/domain/spec';
import { fromEntries, remove } from '@/utils/object';
import { normalizeUrl, url } from '@/utils/url';

export type Props = {
	categoryName?: string;
	categoryCodeList: string[];
	specList: (Spec & PartNumberSpecValue)[];

	// for send log
	partNumber: string;
	seriesCode: string;
	brandCode: string;
	innerCode?: string;
	misumiFlag: Flag;
};

/**
 * Search Similar Product Modal
 */
export const SearchSimilarProductModal: React.VFC<Props> = ({
	categoryName = '',
	categoryCodeList,
	specList,
	partNumber,
	seriesCode,
	brandCode,
}) => {
	const { t } = useTranslation();

	/**
	 * Selected specs
	 * If similarSearchType == "1", its spec is selected by default.
	 */
	const [selectedSpecs, setSelectedSpecs] = useState<
		Record<string, string | undefined>
	>(
		fromEntries(
			specList
				.filter(
					spec => spec.similarSearchType === SimilarSearchType.USE_CHECKIN
				)
				.map(spec => [spec.specCode, spec.specValue])
		)
	);

	const handleClickOption = useCallback(
		(specCode: string, specValue?: string) => {
			setSelectedSpecs(prev => {
				if (prev[specCode] !== undefined) {
					return remove(prev, specCode);
				}
				return { ...prev, [specCode]: specValue };
			});
		},
		[]
	);

	/** Search spec page URL with category spec query. */
	const searchSpecPageURL = useMemo(() => {
		const categorySpec = Object.entries(selectedSpecs)
			.map(([specCode, specValue]) => `${specCode}::${specValue}`)
			.join('\t');

		return url.category(...categoryCodeList).fromProductDetail({
			Tab: 'SERIES',
			FindSimilar: '1',
			CategorySpec: categorySpec,
		});
	}, [categoryCodeList, selectedSpecs]);

	/** OK click handler (send log) */
	const handleClickOk = useCallback(() => {
		addLog(LogType.SIMILAR, {
			url: normalizeUrl(location.href),
			partNumber,
			seriesCode,
			brandCode,
		});
		ga.events.similarProduct();
	}, [brandCode, partNumber, seriesCode]);

	return (
		<Modal
			title={t(
				'mobile.pages.productDetail.searchSimilarProductButton.searchSimilarProductModal.title'
			)}
		>
			<div className={styles.categoryTitle}>
				<Trans
					i18nKey="mobile.pages.productDetail.searchSimilarProductButton.searchSimilarProductModal.categoryName"
					values={{ categoryName }}
				>
					<span className={styles.categoryLabel} />
				</Trans>
			</div>
			<div className={styles.specListWrap}>
				<ul className={styles.specList} role="listbox">
					{specList.map(spec => (
						<li
							key={spec.specCode}
							className={styles.specItem}
							role="option"
							aria-selected={selectedSpecs[spec.specCode] !== undefined}
							onClick={() => handleClickOption(spec.specCode, spec.specValue)}
						>
							<a
								className={styles.anchor}
								href=""
								onClick={e => e.preventDefault()}
							>
								<dl className={styles.spec}>
									<dt
										className={styles.specColumnTitle}
										dangerouslySetInnerHTML={{ __html: getSpecName(spec) }}
									/>
									<dd
										className={styles.specColumn}
										dangerouslySetInnerHTML={{
											__html:
												spec.originalSpecValueDisp ?? spec.specValueDisp ?? '',
										}}
									/>
								</dl>
							</a>
						</li>
					))}
				</ul>
			</div>
			<ul className={styles.bottom}>
				<li className={styles.bottomButtonLeft}>
					<NextLink href={searchSpecPageURL} passHref>
						<LinkButton
							onClick={handleClickOk}
							theme="strong"
							icon="right-arrow"
						>
							{t(
								'mobile.pages.productDetail.searchSimilarProductButton.searchSimilarProductModal.okButton'
							)}
						</LinkButton>
					</NextLink>
				</li>
				<li className={styles.bottomButtonRight}>
					<ModalCloser className={styles.modalWidth}>
						<Button size="max">
							{t(
								'mobile.pages.productDetail.searchSimilarProductButton.searchSimilarProductModal.cancelButton'
							)}
						</Button>
					</ModalCloser>
				</li>
			</ul>
		</Modal>
	);
};
SearchSimilarProductModal.displayName = 'SearchSimilarProductModalContent';
