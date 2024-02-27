import classNames from 'classnames';
import React, { RefObject, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CatalogDownload.module.scss';
import { Button } from '@/components/pc/ui/buttons';

type Props = {
	isGenerating: boolean;
	resolveIFrameName: string;
	generateIFrameName: string;
	resolveRef: RefObject<HTMLIFrameElement>;
	generateRef: RefObject<HTMLIFrameElement>;
	onLoadResolve: () => void;
	onGenerate: () => void;
	onCatalogDownload: () => void;
};

/** Catalog download component */
export const CatalogDownload: VFC<Props> = ({
	isGenerating,
	resolveRef,
	generateRef,
	resolveIFrameName,
	generateIFrameName,
	onLoadResolve,
	onGenerate,
	onCatalogDownload,
}) => {
	const [t] = useTranslation();

	return (
		<>
			<Button
				theme="strong"
				className={classNames({
					[String(styles.downloading)]: isGenerating,
				})}
				disabled={isGenerating}
				onClick={onCatalogDownload}
			>
				{t('pages.productDetail.catalogDownload.button')}
			</Button>
			<iframe
				ref={generateRef}
				name={generateIFrameName}
				className={styles.hiddenIframe}
				onLoad={onGenerate}
				allowFullScreen
			/>
			<iframe
				ref={resolveRef}
				name={resolveIFrameName}
				className={styles.hiddenIframe}
				onLoad={onLoadResolve}
				allowFullScreen
			/>
		</>
	);
};
CatalogDownload.displayName = 'CatalogDownload';
