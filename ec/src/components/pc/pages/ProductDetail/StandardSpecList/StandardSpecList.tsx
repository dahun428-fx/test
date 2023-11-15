import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStandardSpecList } from './StandardSpecList.hooks';
import styles from './StandardSpecList.module.scss';
import { Pict } from '@/components/pc/pages/ProductDetail/Pict';
import { StandardSpec } from '@/components/pc/pages/ProductDetail/StandardSpec';
import { removeDiscountFromPictList } from '@/utils/domain/pict';

type Props = {
	className?: string;
};

/**
 * Series spec list
 */
export const StandardSpecList: React.VFC<Props> = ({ className }) => {
	const [t] = useTranslation();
	const { standardSpecList, categoryCodeList, series } = useStandardSpecList();

	const pictList = useMemo(() => {
		if (!series.pictList) {
			return [];
		}

		return removeDiscountFromPictList(series.pictList);
	}, [series.pictList]);

	if (!pictList.length && !standardSpecList.length) {
		return null;
	}

	return (
		<ul className={classNames(className, styles.container)}>
			{pictList.length > 0 && (
				<li className={styles.specWrapper}>
					<dl className={styles.spec}>
						<dt className={styles.specName}>
							{t('pages.productDetail.specifications')}
						</dt>
						<dd>
							<ul>
								{pictList.map((pict, index) => (
									<li key={index} className={styles.pictValue}>
										<Pict pict={pict.pict} comment={pict.pictComment} />
									</li>
								))}
							</ul>
						</dd>
					</dl>
				</li>
			)}
			{standardSpecList.map((standardSpec, index) => (
				<li key={index} className={styles.specWrapper}>
					<dl className={styles.spec}>
						<dt
							className={styles.specName}
							dangerouslySetInnerHTML={{
								__html: `${standardSpec.specName ?? ''}`,
							}}
						/>
						<dd>
							<StandardSpec
								{...{
									specCode: standardSpec.specCode,
									specType: standardSpec.specType ?? '',
									specValue: standardSpec.specValue,
									specValueDisp: standardSpec.specValueDisp,
									categoryCodeList,
								}}
							/>
						</dd>
					</dl>
				</li>
			))}
		</ul>
	);
};
StandardSpecList.displayName = 'StandardSpecList';
