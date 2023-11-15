import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SortSelect.module.scss';
import { useBoolState } from '@/hooks/state/useBoolState';
import useOuterClick from '@/hooks/ui/useOuterClick';

export type Option<T> = {
	value: T;
	label: string;
};

type Props<T> = {
	value: T | null;
	options: Option<T>[];
	onChange: (value: T | null) => void;
};

/**
 * Sort key select
 */
export function SortSelect<T extends string = string>({
	value,
	options,
	onChange,
}: Props<T>) {
	const [t] = useTranslation();

	const [isOpen, open, close, toggle] = useBoolState(false);
	const [cursor, setCursor] = useState(-1);
	const boxRef = useRef<HTMLDivElement>(null);

	const handleClickOption = (selectedValue: T | null) => {
		setCursor(-1);
		close();
		onChange(value === selectedValue ? null : selectedValue);
	};

	const handleKeydown = (event: React.KeyboardEvent) => {
		const size = options.length + 1;
		switch (event.key) {
			case 'Down':
			case 'ArrowDown':
				open();
				setCursor(p => (p < size - 1 ? p + 1 : 0));
				return;
			case 'Up':
			case 'ArrowUp':
				setCursor(p => (p > 0 ? p - 1 : size - 1));
				return;
			case 'Enter':
				if (!isOpen) {
					return open();
				}

				if (cursor < 0) {
					return;
				}

				if (cursor < options.length) {
					return handleClickOption(options[cursor]?.value ?? null);
				}
				return handleClickOption(null);
			case 'Escape':
			case 'Tab':
				close();
				setCursor(-1);
				return;
		}
	};

	useOuterClick(boxRef, close);

	return (
		<div className={styles.selectBoxWrapper} ref={boxRef}>
			<button
				className={styles.buttonSort}
				tabIndex={0}
				data-selected={value != null}
				data-expanded={isOpen}
				onClick={toggle}
				onKeyDown={handleKeydown}
				onBlur={() => setCursor(-1)}
			>
				{t('pages.productDetail.partNumberList.sortSelect.sortOrder')}
			</button>
			{isOpen && (
				<div className={styles.sortBox}>
					<ul className={styles.sortList}>
						{options.map((option, index) => (
							<li
								className={classNames(
									styles.sortListItem,
									option.value === value ? styles.on : undefined
								)}
								key={option.value}
								data-focused={index === cursor}
								onClick={() => handleClickOption(option.value)}
							>
								{option.label}
							</li>
						))}
						<li
							key="clear"
							className={styles.sortClear}
							data-focused={options.length === cursor}
							onClick={() => handleClickOption(null)}
						>
							{t('pages.productDetail.partNumberList.clear')}
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
SortSelect.displayName = 'SortSelect';
