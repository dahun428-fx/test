import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PageForm.module.scss';
import { formatPageDisp } from '@/utils/domain/catalog';

type Props = {
	value?: string;
	onSubmit: (value: string) => void;
};

export const PageForm: React.VFC<Props> = ({ value, onSubmit }) => {
	const { t } = useTranslation();
	const [page, setPage] = useState(value ?? '');
	const handleSubmit = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			onSubmit(page);
		},
		[onSubmit, page]
	);

	const handleChange = useCallback((event: FormEvent<HTMLInputElement>) => {
		setPage(event.currentTarget.value);
	}, []);

	useEffect(() => {
		setPage(formatPageDisp(value ?? ''));
	}, [value]);

	return (
		<form onSubmit={handleSubmit} className={styles.container}>
			<input
				type="text"
				value={page}
				spellCheck={false}
				onChange={handleChange}
				className={styles.field}
			/>
			<button type="submit" className={styles.submitButton}>
				{t('pages.productDetail.catalog.open')}
			</button>
		</form>
	);
};
PageForm.displayName = 'PageForm';
