import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadDownloadStatus } from './CadenasDownloadProgress.hooks';
import styles from './CadenasDownloadProgress.module.scss';
import { Progress } from '@/components/mobile/ui/progress';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';

type Props = {
	item: CadDownloadStackItem;
};

/**
 * Cadenas CAD Download Progress
 */
export const CadenasDownloadProgress: React.VFC<Props> = ({ item }) => {
	const { t } = useTranslation();
	const { cadDownload } = useCadDownloadStatus();

	const handleCadDownload = (event: MouseEvent) => {
		event.preventDefault();
		cadDownload(item);
	};

	return (
		<>
			<h4 className={styles.progressTitle}>
				{item.status === 'done'
					? t(
							'mobile.pages.productDetail.cadDownload.cadDownloadDataCadenas.cadenasDownloadProgress.title.generated'
					  )
					: t(
							'mobile.pages.productDetail.cadDownload.cadDownloadDataCadenas.cadenasDownloadProgress.title.generating'
					  )}
			</h4>
			<div>
				<Message {...item} />
			</div>
			{item.status === 'done' ? (
				<div className={styles.downloadFileContainer}>
					<a
						href="#"
						className={styles.downloadFileLink}
						onClick={handleCadDownload}
					>
						<span
							dangerouslySetInnerHTML={{
								// NOTE: Adding zero-width characters to make line breaks when line is long
								__html: `${item.fileName.replace(/_/g, '_&#8203;')}.zip`,
							}}
						/>
					</a>
				</div>
			) : item.status === 'pending' ? (
				<CadenasDownloadProgressBar {...item} />
			) : null}
		</>
	);
};

CadenasDownloadProgress.displayName = 'CadenasDownloadProgress';

/** 生成対象と状況を説明するメッセージ */
const Message: React.VFC<
	Pick<
		CadDownloadStackItem,
		'partNumber' | 'label' | 'status' | 'time' | 'type'
	>
> = ({ partNumber, status, time }) => {
	const [t] = useTranslation();

	const message = useMemo(() => {
		switch (status) {
			case CadDownloadStatus.Done:
				return t(
					'mobile.pages.productDetail.cadDownload.cadDownloadDataCadenas.cadenasDownloadProgress.message.generated'
				);
			default:
				return t(
					'mobile.pages.productDetail.cadDownload.cadDownloadDataCadenas.cadenasDownloadProgress.message.generating',
					{ time }
				);
		}
	}, [status, t, time]);

	return (
		<>
			{status === CadDownloadStatus.Done && (
				<p className={styles.target}>
					{t(
						'mobile.pages.productDetail.cadDownload.cadDownloadDataCadenas.cadenasDownloadProgress.target',
						{ partNumber }
					)}
				</p>
			)}
			<div>{message}</div>
		</>
	);
};

Message.displayName = 'Message';

/** Candenas download progress bar */
const CadenasDownloadProgressBar: React.VFC<
	Pick<CadDownloadStackItem, 'id' | 'progress' | 'time' | 'status'>
> = ({ id, progress: initialProgress, time: stringTime, status }) => {
	const [progress, setProgress] = useState(initialProgress);
	const intervalIdRef = useRef<number>();

	useOnMounted(() => {
		// initialProgress が 100% 完了なら、setInterval しない
		if (initialProgress === 5) {
			return;
		}

		if (!stringTime) {
			return; // まずあり得ないので丁寧なケアはしない
		}

		const time = parseInt(stringTime);
		if (Number.isNaN(time)) {
			return; // まずあり得ないので丁寧なケアはしない
		}

		intervalIdRef.current = window.setInterval(() => {
			setProgress(progress => {
				return Math.min(5, progress + 5 / time);
			});
		}, 1000);

		return () => {
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
				intervalIdRef.current = undefined;
			}
		};
	});

	useEffect(() => {
		// ここではタイマーのクリアのみで、LocalStorage の status: 'done' 反映は行わない。
		// CADENAS の progress 表示はただの演出で、実際のCAD生成処理の進捗とは関係ががない。そういう仕様。
		if (progress >= 5) {
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
				intervalIdRef.current = undefined;
			}
		}
	}, [id, progress]);

	useEffect(() => {
		if (status === CadDownloadStatus.Done) {
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
				intervalIdRef.current = undefined;
			}
		}
	}, [status]);

	const step = Math.round(progress);

	return (
		<div className={styles.progressWrapper}>
			<Progress step={step} maxStep={5} />
		</div>
	);
};

CadenasDownloadProgressBar.displayName = 'CadenasDownloadProgressBar';
