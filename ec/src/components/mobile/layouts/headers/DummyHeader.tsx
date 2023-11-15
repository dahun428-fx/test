import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.scss';
import { KeywordForm } from '@/components/mobile/layouts/headers/SearchBox/KeywordForm';

type Props = {
	showsSearchBox?: boolean;
};

export const DummyHeader: React.VFC<Props> = ({ showsSearchBox = true }) => {
	const { t } = useTranslation();

	return (
		<header className={styles.container}>
			<div className={styles.header}>
				<div className={styles.logoWrap}>
					<h1
						className={styles.logoImage}
						aria-label={t(
							'mobile.components.layouts.headers.header.misumiHeaderTitle'
						)}
					/>
				</div>
			</div>
			{showsSearchBox && <KeywordForm disabled />}
		</header>
	);
};
DummyHeader.displayName = '';
