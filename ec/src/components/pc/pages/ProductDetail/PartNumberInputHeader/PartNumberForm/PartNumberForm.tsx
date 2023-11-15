import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberForm.module.scss';

type Props = {
	partNumber?: string;
	onSubmit: (partNumber: string) => void;
};

export const PartNumberForm: React.VFC<Props> = ({
	partNumber: initialPartNumber = '',
	onSubmit,
}) => {
	const [partNumber, setPartNumber] = useState(initialPartNumber);
	const { t } = useTranslation();

	const handleSubmitPartNumber = useCallback(() => {
		onSubmit(partNumber.toUpperCase().trim());
	}, [onSubmit, partNumber]);

	return (
		<form
			className={styles.form}
			onSubmit={event => {
				event.preventDefault();
				handleSubmitPartNumber();
			}}
		>
			<label>
				{t('pages.productDetail.partNumberInputHeader.partNumberForm.label')}
				<input
					className={styles.field}
					type="text"
					value={partNumber}
					placeholder={t(
						'pages.productDetail.partNumberInputHeader.partNumberForm.placeholder'
					)}
					onChange={event => setPartNumber(event.currentTarget.value)}
					onBlur={() => handleSubmitPartNumber()}
					spellCheck={false}
				/>
			</label>
		</form>
	);
};
PartNumberForm.displayName = 'PartNumberForm';
