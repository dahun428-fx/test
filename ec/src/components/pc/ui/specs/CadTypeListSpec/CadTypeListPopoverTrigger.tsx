import classNames from 'classnames';
import React, {
	RefObject,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { CadTypeListPopover } from './CadTypeListPopover';
import styles from './CadTypeListPopoverTrigger.module.scss';
import { getPopoverTop } from '@/components/pc/ui/specs/utils/popover';
import { useBoolState } from '@/hooks/state/useBoolState';
import { CadType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { selected, someSelected } from '@/utils/domain/spec';

type Props = {
	cadTypeList: CadType[];
	frameRef: RefObject<HTMLElement>;
	className?: string;
	isCategory: boolean;
	onClear: () => void;
};

/** Cad type list popover trigger */
export const CadTypeListPopoverTrigger: React.FC<Props> = ({
	cadTypeList,
	frameRef,
	className,
	isCategory,
	children,
	onClear,
}) => {
	const [t] = useTranslation();
	const { bool: isOpen, toggle, setFalse: closePopover } = useBoolState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [top, setTop] = useState(10);
	const popoverRef = useRef<HTMLDivElement>(null);

	const someCadTypeSelected = someSelected(cadTypeList);

	const showsPopoverTrigger = isOpen || someCadTypeSelected;

	const showsPopoverButton =
		someSelected(cadTypeList) &&
		cadTypeList.filter(selected).length < cadTypeList.length;

	useLayoutEffect(() => {
		if (isOpen && frameRef.current && popoverRef.current) {
			setTop(
				getPopoverTop({ frame: frameRef.current, popover: popoverRef.current })
			);
		}
	}, [isOpen, frameRef]);

	const label = useMemo(
		() =>
			isOpen
				? t('components.ui.specs.cadTypeListSpec.hidePopover')
				: t('components.ui.specs.cadTypeListSpec.showPopover', {
						count: cadTypeList.length,
				  }),

		[cadTypeList.length, isOpen, t]
	);

	if (!showsPopoverTrigger) {
		return null;
	}

	return (
		<>
			{showsPopoverButton && (
				<button
					className={classNames(styles.trigger, className)}
					onClick={toggle}
					aria-expanded={isOpen}
					ref={buttonRef}
				>
					{label}
				</button>
			)}

			<CadTypeListPopover
				isOpen={isOpen}
				selected={someCadTypeSelected}
				onCancel={closePopover}
				onClear={onClear}
				title={t('components.ui.specs.cadTypeListSpec.title')}
				top={top}
				triggerRef={buttonRef}
				popoverRef={popoverRef}
				className={classNames(styles.popover, {
					[String(styles.customPopover)]: !isCategory,
				})}
			>
				{children}
			</CadTypeListPopover>
		</>
	);
};

CadTypeListPopoverTrigger.displayName = 'CadTypeListPopoverTrigger';
