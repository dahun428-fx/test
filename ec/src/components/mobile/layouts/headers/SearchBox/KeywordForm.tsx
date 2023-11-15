import React, { ComponentProps, forwardRef, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SearchBox.module.scss';

type Props = Pick<
	ComponentProps<'input'>,
	'value' | 'onChange' | 'onFocus' | 'className'
> &
	Pick<ComponentProps<'form'>, 'onSubmit'> & {
		onClickClear?: () => void;
		disabled?: boolean;
		children?: ReactNode;
	};

export const KeywordForm = forwardRef<HTMLDivElement, Props>(
	({ onSubmit, disabled, children, onClickClear, ...inputProps }, ref) => {
		const { t } = useTranslation();

		return (
			<div className={styles.container} ref={ref}>
				<form onSubmit={onSubmit} className={styles.form}>
					<input
						{...inputProps}
						disabled={disabled}
						className={styles.input}
						placeholder={t(
							'mobile.components.layouts.headers.header.searchBox.inputPlaceholder'
						)}
					/>

					{inputProps.value && (
						<div className={styles.clear} onClick={onClickClear} />
					)}

					<button type="submit" className={styles.button} disabled={disabled}>
						{t(
							'mobile.components.layouts.headers.header.searchBox.buttonSearch'
						)}
					</button>
				</form>

				{children}
			</div>
		);
	}
);
KeywordForm.displayName = 'KeywordForm';
