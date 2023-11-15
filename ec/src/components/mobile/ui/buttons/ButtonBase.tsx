import classNames from 'classnames';
import React, { forwardRef } from 'react';
import styles from './Button.module.scss';
import { useHandleClick } from '@/components/mobile/ui/buttons/Button.hooks';
import { Merge } from '@/utils/type';

export type Size = 'xs' | 's' | 'm' | 'l' | 'xl' | 'max';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

type BaseProps = {
	/**
	 * 非活性か
	 * anchor の場合は、aria-disabled="true" が設定されます。
	 */
	disabled?: boolean;
	/**
	 * ボタンのサイズ
	 */
	size?: Size;
};

export type ButtonBaseProps = Merge<BaseProps, ButtonProps>;
export type LinkButtonBaseProps = Merge<BaseProps, LinkProps>;

/**
 * Button Component Base.
 * ボタンのベースコンポーネントです。
 */
export const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
	(
		{ onClick, type = 'button', size = 'max', className, disabled, ...props },
		ref
	) => {
		const handleClick = useHandleClick(onClick, disabled);
		return (
			<button
				ref={ref}
				className={classNames(styles[`size-${size}`], className)}
				type={type}
				disabled={disabled}
				onClick={handleClick}
				{...props}
			/>
		);
	}
);

/**
 * Link Component Base.
 * リンクボタンのベースコンポーネントです。
 */
export const LinkButtonBase = forwardRef<
	HTMLAnchorElement,
	LinkButtonBaseProps
>(({ size = 'max', className, disabled, onClick, ...props }, ref) => {
	/** NOTE: disabled の場合に、anchor のクリック時の挙動が動かないようにしています。 */
	const handleClick = useHandleClick(onClick, disabled);
	return (
		<a
			ref={ref}
			role="button"
			onClick={handleClick}
			className={classNames(styles[`size-${size}`], className)}
			aria-disabled={disabled}
			{...props}
		/>
	);
});
