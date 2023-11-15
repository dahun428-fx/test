import classNames from 'classnames';
import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrandPopover } from './BrandPopover';
import styles from './BrandPopoverTrigger.module.scss';
import { DISPLAY_BORDER } from './constants';
import { getPopoverTop } from '@/components/pc/ui/specs/utils/popover';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Brand } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { someSelected, someUnselected } from '@/utils/domain/spec';

type Props = {
	/** Not hidden brand list */
	brandList: Brand[];
	/** SpecFrame ref */
	frameRef: RefObject<HTMLElement>;
	onClear: () => void;
	className?: string;
	isSearchResult?: boolean;
};

/**
 * Brand popover trigger
 */
export const BrandPopoverTrigger: React.FC<Props> = ({
	brandList,
	frameRef,
	onClear,
	className,
	isSearchResult,
	children,
}) => {
	const { t } = useTranslation();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [top, setTop] = useState(10);
	const { bool: isOpen, toggle, setFalse: closePopover } = useBoolState(false);

	const someBrandSelected = useMemo(() => someSelected(brandList), [brandList]);
	const someBrandUnselected = useMemo(
		() => someUnselected(brandList),
		[brandList]
	);
	const showsPopoverTrigger = useMemo(
		() =>
			isOpen ||
			brandList.length >= DISPLAY_BORDER ||
			(someBrandSelected && someBrandUnselected),
		[brandList.length, isOpen, someBrandSelected, someBrandUnselected]
	);

	useEffect(() => {
		if (isOpen && frameRef?.current && popoverRef.current) {
			setTop(
				getPopoverTop({ frame: frameRef.current, popover: popoverRef.current })
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, frameRef?.current, popoverRef?.current]);

	const label = useMemo(
		() =>
			isOpen
				? t('components.ui.specs.brandListSpec.hidePopover')
				: t('components.ui.specs.brandListSpec.showPopover', {
						count: brandList.length,
				  }),

		[brandList.length, isOpen, t]
	);

	if (!showsPopoverTrigger) {
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
			<BrandPopover
				isOpen={isOpen}
				selected={someBrandSelected}
				onCancel={closePopover}
				onClear={onClear}
				title={t('components.ui.specs.brandListSpec.title')}
				top={top}
				triggerRef={buttonRef}
				popoverRef={popoverRef}
				className={classNames(styles.popover, {
					[String(styles.customPopover)]: isSearchResult,
				})}
			>
				{children}
			</BrandPopover>
		</>
	);
};
BrandPopoverTrigger.displayName = 'BrandPopoverTrigger';
