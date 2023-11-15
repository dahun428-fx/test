import classNames from 'classnames';
import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryPopoverTrigger.module.scss';
import { CategoryPopover } from '@/components/pc/ui/specs/CategoryPopover/CategoryPopover';
import { getPopoverTop } from '@/components/pc/ui/specs/utils/popover';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import { Category } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { notHidden, notSelected, selected } from '@/utils/domain/spec';

type Props = {
	categoryList: Category[];
	/** SpecFrame ref */
	frameRef: RefObject<HTMLElement>;
	onClear: () => void;
	className?: string;
};

/**
 * Category Popover trigger
 */
export const CategoryPopoverTrigger: React.FC<Props> = ({
	categoryList,
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

	const showsMore = isShowMore(categoryList);
	const specItemCount = categoryList.filter(notHidden).length;

	const label = useMemo(() => {
		if (isOpen) {
			return t('components.ui.specs.categoryPopover.label.close');
		}

		if (showsMore) {
			return t('components.ui.specs.categoryPopover.label.allCandidates', {
				specItemCount,
			});
		}
	}, [isOpen, showsMore, specItemCount, t]);

	if (!showsMore) {
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
			<CategoryPopover
				isOpen={isOpen}
				selected={categoryList.some(category =>
					Flag.isTrue(category.selectedFlag)
				)}
				onCancel={closePopover}
				onClear={onClear}
				title={t('components.ui.specs.categoryPopover.label.title')}
				top={top}
				triggerRef={buttonRef}
				popoverRef={popoverRef}
				className={String(styles.popover)}
			>
				{children}
			</CategoryPopover>
		</>
	);
};
CategoryPopoverTrigger.displayName = 'CategoryPopoverTrigger';

const SHOW_MORE_SPEC_VALUE_COUNT = 7;

function isShowMore(categoryList: Category[]) {
	return (
		// Spec value count is over 7
		categoryList.filter(notHidden).length > SHOW_MORE_SPEC_VALUE_COUNT ||
		// Any spec value(s) is selected, and more selectable spec values is exists.
		(categoryList.filter(selected).length > 0 &&
			categoryList.filter(notHidden).filter(notSelected).length > 0)
	);
}
