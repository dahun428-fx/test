import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AlterationSpecList.module.scss';
import { NumericSpec } from '@/components/mobile/domain/specs/NumericSpec';
import { TextListSpec } from '@/components/mobile/domain/specs/TextListSpec';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { AlertMessage } from '@/components/mobile/ui/messages/AlertMessage';
import {
	AlterationSpec,
	SpecViewType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { notHidden } from '@/utils/domain/spec';
import { notEmpty } from '@/utils/predicate';

type Props = {
	alterationNoticeText?: string;
	alterationSpecList: AlterationSpec[];
	onChange: (payload: ChangePayload) => void;
	className?: string;
};

/**
 * alteration spec list
 */
export const AlterationSpecList: React.VFC<Props> = ({
	alterationNoticeText,
	alterationSpecList,
	onChange,
	className,
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
		<div className={className}>
			<h3 className={styles.heading}>
				{t(
					'mobile.pages.productDetail.templates.complex.specPanel.alterationSpecList.specifyAlterations'
				)}
			</h3>
			{alterationNoticeText && (
				<AlertMessage className={styles.noticeWrap}>
					{alterationNoticeText}
				</AlertMessage>
			)}
			<ul className={styles.specList}>
				{specList.map(spec => {
					switch (spec.specViewType) {
						case SpecViewType.NUMERIC:
							return (
								<li key={spec.specCode} className={styles.specItem}>
									<NumericSpec spec={spec} onChange={onChange} />
								</li>
							);
						case SpecViewType.TEXT_SINGLE_LINE:
						case SpecViewType.TEXT_DOUBLE_LINE:
						case SpecViewType.TEXT_TRIPLE_LINE:
						case SpecViewType.LIST:
							return (
								<li key={spec.specCode} className={styles.specItem}>
									<TextListSpec spec={spec} onChange={onChange} />
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
