import React from 'react';
import { LegacyStyledHtml } from '@/components/mobile/domain/LegacyStyledHtml';
import { TabType } from '@/models/api/msm/ect/series/shared';
import styles from '@/styles/mobile/legacy/wysiwyg.module.scss';

type Props = {
	tabType: TabType;
	eleWysiwygDescriptionHtml?: string;
};

const electoricalTabTypeSet = new Set<TabType>([TabType.ELE_A, TabType.ELE_B]);

/**
 * wysiwyg for Ele
 */
export const EleWysiwyg: React.VFC<Props> = ({
	tabType,
	eleWysiwygDescriptionHtml,
}) => {
	if (!electoricalTabTypeSet.has(tabType) || !eleWysiwygDescriptionHtml) {
		return null;
	}
	return (
		<LegacyStyledHtml
			html={eleWysiwygDescriptionHtml}
			parentClassName={styles.wysiwyg}
			childClassName="wysiwyg_area"
		/>
	);
};
EleWysiwyg.displayName = 'EleWysiwyg';
