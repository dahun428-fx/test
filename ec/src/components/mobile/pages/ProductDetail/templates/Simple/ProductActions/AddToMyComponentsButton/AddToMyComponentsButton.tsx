import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AddToMyComponentsButton.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import { OverlayLoader } from '@/components/mobile/ui/loaders';

type Props = {
	disabled: boolean;
	loading: boolean;
	addToMyComponents: () => void;
};

/** Add to my component button component */
export const AddToMyComponentsButton: React.VFC<Props> = ({
	addToMyComponents,
	disabled,
	loading,
}) => {
	const [t] = useTranslation();

	return (
		<div className={styles.container}>
			<Button
				icon="save"
				theme="default-sub"
				className={styles.button}
				disabled={disabled}
				onClick={addToMyComponents}
			>
				{t('mobile.pages.productDetail.addToMyComponents')}
			</Button>
			{loading && <OverlayLoader />}
		</div>
	);
};
AddToMyComponentsButton.displayName = 'AddToMyComponentsButton';
