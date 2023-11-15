import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AddToMyComponentsButton.module.scss';

type Props = {
	className?: string;
	disabled: boolean;
	addToMyComponents: () => void;
};

export const AddToMyComponentsButton: React.VFC<Props> = ({
	className,
	addToMyComponents,
	disabled,
}) => {
	const { t } = useTranslation();

	return (
		<button
			disabled={disabled}
			onClick={addToMyComponents}
			className={classNames(className, styles.button)}
		>
			{t(
				'mobile.pages.productDetail.productActions.addToMyComponentsButton.label'
			)}
		</button>
	);
};
AddToMyComponentsButton.displayName = 'AddToMyComponentsButton';
