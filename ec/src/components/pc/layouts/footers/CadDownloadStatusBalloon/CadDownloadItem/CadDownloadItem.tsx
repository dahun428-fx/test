import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCadDownloadStatus } from './CadDownloadItem.hooks';
import styles from './CadDownloadItem.module.scss';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { Progress } from '@/components/pc/ui/progress';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack_origin';
import { updateCadDownloadStackItem } from '@/services/localStorage/cadDownloadStack';
type Props = {
	item: CadDownloadStackItem;
};

/**
 * CAD Download Item
 */
export const CadDownloadItem: React.VFC<Props> = ({ item }) => {
	const { cadDownload } = useCadDownloadStatus();

	const handleCadDownload = (event: MouseEvent) => {
		event.preventDefault();
		cadDownload(item);
	};

	return (
		<>
			<div>
				<Message {...item} />
			</div>
			{item.status === 'done' ? (
				<div>
					<a
						href="#"
						className={styles.downloadFileLink}
						onClick={handleCadDownload}
					>
						<strong
							dangerouslySetInnerHTML={{
								// NOTE: Adding zero-width characters to make line breaks when line is long
								__html: `${item.fileName.replace(/_/g, '_&#8203;')}.zip`,
							}}
						/>
					</a>
				</div>
			) : item.type === 'sinus' && item.status === 'pending' ? (
				<BlockLoader hideLoadingText />
			) : item.status === 'pending' ? (
				<CadenasDownloadProgress {...item} />
			) : null}
		</>
	);
};

CadDownloadItem.displayName = 'CadDownloadItem';

/** 生成対象と状況を説明するメッセージ */
const Message: React.VFC<
	Pick<
		CadDownloadStackItem,
		'partNumber' | 'label' | 'status' | 'time' | 'type'
	>
> = ({ partNumber, label, status, time, type }) => {
	const [t] = useTranslation();

	const message = useMemo(() => {
		switch (status) {
			case CadDownloadStatus.Done:
				return t(
					'components.ui.layouts.footers.cadDownloadStatusBalloon.cadDownloadItem.message.done'
				);
			case CadDownloadStatus.Timeout:
				// SINUS にしかない status
				return t(
					'components.ui.layouts.footers.cadDownloadStatusBalloon.cadDownloadItem.message.timeout'
				);
			default:
				return type === 'sinus'
					? t(
							'components.ui.layouts.footers.cadDownloadStatusBalloon.cadDownloadItem.message.pending.sinus'
					  )
					: t(
							'components.ui.layouts.footers.cadDownloadStatusBalloon.cadDownloadItem.message.pending.cadenas',
							{ time }
					  );
		}
	}, [status, t, time, type]);

	return (
		<>
			<Trans i18nKey="components.ui.layouts.footers.cadDownloadStatusBalloon.cadDownloadItem.target">
				<strong>{{ partNumber }}</strong>
				{{ label }}
			</Trans>
			{/* CADENAS 生成中の場合は改行あり、それ以外はなし */}
			{type !== 'sinus' && status === CadDownloadStatus.Pending ? (
				<div>{message}</div>
			) : (
				<>&nbsp;{message}</>
			)}
		</>
	);
};

Message.displayName = 'Message';

/** Candenas download progress */
const CadenasDownloadProgress: React.VFC<
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
			updateCadDownloadStackItem({ id, progress });
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

	return <Progress step={step} maxStep={5} />;
};

CadenasDownloadProgress.displayName = 'CadenasDownloadProgress';
