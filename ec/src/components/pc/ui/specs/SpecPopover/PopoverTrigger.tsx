import classNames from 'classnames';
import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PopoverTrigger.module.scss';
import { SpecPopover } from './SpecPopover';
import { getPopoverTop } from '@/components/pc/ui/specs/utils/popover';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import {
	AlterationNumericSpec,
	NumericSpec,
	SpecValue,
	SpecViewType,
	SupplementType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SpecViewType as SeriesSpecViewType } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import {
	getAvailableSpecCount,
	getNotSelectedSpecCount,
	isSelectedSpec,
} from '@/utils/domain/spec';
import { NormalizedSpec } from '@/utils/domain/spec/types';

type Props = {
	spec: NormalizedSpec;
	isCategory?: boolean;
	/** SpecFrame ref */
	frameRef: RefObject<HTMLElement>;
	onClear: () => void;
	className?: string;
};

/**
 * Popover trigger
 */
export const PopoverTrigger: React.FC<Props> = ({
	spec: {
		specName,
		specUnit,
		specViewType,
		supplementType,
		specValueList = [],
		numericSpec,
		specNoticeText,
		specImageUrl,
		detailHtml,
		specDescriptionImageUrl,
		selectedFlag,
	},
	isCategory,
	frameRef,
	onClear,
	className,
	children,
}) => {
	const { t } = useTranslation();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [top, setTop] = useState(10);

	const { bool: isOpen, toggle, setFalse: closePopover } = useBoolState(false);

	useEffect(() => {
		if (isOpen && frameRef?.current && popoverRef.current) {
			setTop(
				getPopoverTop({ frame: frameRef.current, popover: popoverRef.current })
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, frameRef?.current, popoverRef?.current]);

	const showsMore = isShowMore(specViewType, specValueList, numericSpec);
	const specItemCount = getAvailableSpecCount(specValueList);
	const showsDetailLabel = isShowDetailLabel(
		supplementType,
		specImageUrl,
		detailHtml,
		specDescriptionImageUrl
	);
	const showsIllustrationLabel = isShowIllustrationLabel(
		specViewType,
		supplementType,
		specValueList
	);

	const showsZoomImageLabel = isShowZoomImageLabel(
		specViewType,
		supplementType,
		specValueList
	);

	const label = useMemo(() => {
		if (isOpen) {
			return t('components.ui.specs.specPopover.label.close');
		}

		if (showsMore) {
			if (showsDetailLabel) {
				return t(
					'components.ui.specs.specPopover.label.detailWithAllCandidates',
					{ specItemCount }
				);
			}

			if (showsIllustrationLabel) {
				return t(
					'components.ui.specs.specPopover.label.illustrationWithAllCandidates',
					{ specItemCount }
				);
			}

			if (showsZoomImageLabel) {
				return t(
					'components.ui.specs.specPopover.label.zoomImageWithAllCandidates',
					{ specItemCount }
				);
			}
			return t('components.ui.specs.specPopover.label.allCandidates', {
				specItemCount,
			});
		}

		if (showsDetailLabel) {
			return t('components.ui.specs.specPopover.label.detail');
		}

		if (showsIllustrationLabel) {
			return t('components.ui.specs.specPopover.label.illustration');
		}

		if (showsZoomImageLabel) {
			return t('components.ui.specs.specPopover.label.zoomImage');
		}
	}, [
		isOpen,
		showsDetailLabel,
		showsIllustrationLabel,
		showsMore,
		showsZoomImageLabel,
		specItemCount,
		t,
	]);

	if (
		!showsMore &&
		!showsDetailLabel &&
		!showsZoomImageLabel &&
		!showsIllustrationLabel
	) {
		return null;
	}

	return (
		<>
			<button
				className={classNames(styles.trigger, className)}
				onClick={toggle}
				aria-expanded={isOpen}
				ref={buttonRef}
			>
				{label}
			</button>
			<SpecPopover
				isOpen={isOpen}
				selected={Flag.isTrue(selectedFlag)}
				onCancel={closePopover}
				onClear={onClear}
				title={specUnit ? `${specName}(${specUnit})` : specName}
				specNoticeText={specNoticeText}
				top={top}
				triggerRef={buttonRef}
				popoverRef={popoverRef}
				className={classNames(styles.popover, {
					[String(styles.isFixedWidthLayoutPage)]: !isCategory,
				})}
				spec={{
					specName,
					detailHtml,
					supplementType,
					specImageUrl,
					specDescriptionImageUrl,
				}}
			>
				{children}
			</SpecPopover>
		</>
	);
};
PopoverTrigger.displayName = 'PopoverTrigger';

const SHOW_MORE_SPEC_VALUE_COUNT = 7;

function isShowMore(
	specViewType: SpecViewType | SeriesSpecViewType,
	specValueList: SpecValue[],
	numericSpec?: NumericSpec | AlterationNumericSpec
) {
	// SpecViewType that does not show "show more" even if the number of specs increases.
	const ignoresSpecCountViewType = Array.of<SpecViewType | SeriesSpecViewType>(
		SpecViewType.IMAGE_SINGLE_LINE,
		SpecViewType.IMAGE_DOUBLE_LINE,
		SpecViewType.IMAGE_TRIPLE_LINE,
		SpecViewType.TREE
	).includes(specViewType);

	return (
		// Spec value count is over 7
		(!ignoresSpecCountViewType &&
			getAvailableSpecCount(specValueList) > SHOW_MORE_SPEC_VALUE_COUNT) ||
		// Any spec value(s) is selected, and more selectable spec values is exists.
		(isSelectedSpec({ specValueList, numericSpec }) &&
			getNotSelectedSpecCount(specValueList) > 0)
	);
}

function isShowDetailLabel(
	supplementType?: SupplementType,
	specImageUrl?: string,
	detailHtml?: string,
	specDescriptionImageUrl?: string
) {
	return (
		!!specDescriptionImageUrl ||
		(supplementType === SupplementType.DRAWING && specImageUrl) ||
		(supplementType === SupplementType.DETAIL && detailHtml)
	);
}

function isShowIllustrationLabel(
	specViewType: SpecViewType | SeriesSpecViewType,
	supplementType?: SupplementType,
	specValueList: SpecValue[] = []
) {
	return (
		specViewType !== SpecViewType.TREE &&
		supplementType === SupplementType.ILLUSTRATION &&
		specValueList.some(value => value.specValueImageUrl)
	);
}

function isShowZoomImageLabel(
	specViewType: SpecViewType | SeriesSpecViewType,
	supplementType?: SupplementType,
	specValueList: SpecValue[] = []
) {
	const targetViewTypes = Array.of<SpecViewType | SeriesSpecViewType>(
		SpecViewType.IMAGE_SINGLE_LINE,
		SpecViewType.IMAGE_DOUBLE_LINE,
		SpecViewType.IMAGE_TRIPLE_LINE
	);

	return (
		targetViewTypes.includes(specViewType) &&
		supplementType === SupplementType.ZOOM_IMAGE &&
		specValueList.some(value => value.specValueImageUrl)
	);
}
