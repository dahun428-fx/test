import { Progress } from '@/components/pc/ui/progress';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import { updateCadDownloadStackItem } from '@/services/localStorage/cadDownloadStack';
import { useEffect, useRef, useState } from 'react';

/** Candenas download progress */
export const CadenasDownloadProgress: React.VFC<
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
