import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AlterationSpecList.module.scss';
import {
	SpecCode,
	SpecValues,
} from '@/components/pc/pages/ProductDetail/templates/Complex/SpecPanel/types';
import { NumericSpec } from '@/components/pc/ui/specs/NumericSpec';
import { TextListSpec } from '@/components/pc/ui/specs/TextListSpec';
import { MIN_SPEC_VALUE_COUNT_TO_SHOW_TEXT_FILTER } from '@/components/pc/ui/specs/TextListSpec/constants';
import {
	AlterationSpec,
	SpecViewType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { getAvailableSpecCount, notHidden } from '@/utils/domain/spec';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { notEmpty } from '@/utils/predicate';

type Props = {
	alterationNoticeText?: string;
	alterationSpecList: AlterationSpec[];
	onChange: (spec: Record<SpecCode, SpecValues>) => void;
	sendLog: (payload: SendLogPayload) => void;
};

/**
 * alteration spec list
 */
export const AlterationSpecList: React.VFC<Props> = ({
	alterationNoticeText,
	alterationSpecList,
	onChange,
	sendLog,
}) => {
	const { t } = useTranslation();

	const specList = useMemo(
		() => alterationSpecList.filter(notHidden),
		[alterationSpecList]
	);

	if (!notEmpty(specList)) {
		return null;
	}

	return (
		<div className={styles.container}>
			<h3 className={styles.heading}>
				{t('pages.productDetail.complex.specPanel.specifyAlterations')}
			</h3>
			{alterationNoticeText && (
				<div className={styles.noticeWrap}>
					<p className={styles.notice}>{alterationNoticeText}</p>
				</div>
			)}
			<ul>
				{specList.map(spec => {
					switch (spec.specViewType) {
						case SpecViewType.NUMERIC:
							return (
								<li key={spec.specCode} className={styles.specItem}>
									<NumericSpec
										spec={spec}
										onChange={onChange}
										sendLog={sendLog}
									/>
								</li>
							);
						case SpecViewType.TEXT_SINGLE_LINE:
						case SpecViewType.TEXT_DOUBLE_LINE:
						case SpecViewType.TEXT_TRIPLE_LINE:
						case SpecViewType.LIST:
							const availableSpecCount = getAvailableSpecCount(
								spec.specValueList
							);
							return (
								<li key={spec.specCode} className={styles.specItem}>
									<TextListSpec
										spec={spec}
										onChange={onChange}
										hidePopoverTextFilter={
											availableSpecCount <
											MIN_SPEC_VALUE_COUNT_TO_SHOW_TEXT_FILTER
										}
										sendLog={sendLog}
									/>
								</li>
							);
						default:
							return null;
					}
				})}
			</ul>
		</div>
	);
};
AlterationSpecList.displayName = 'AlterationSpecList';
