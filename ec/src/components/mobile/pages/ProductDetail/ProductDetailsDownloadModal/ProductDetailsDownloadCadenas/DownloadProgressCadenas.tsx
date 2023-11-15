import { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/mobile/ui/progress';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';

type Props = {
	initialProgress: number;
	stringTime: string;
};

const MAX_STEP = 5;

/** Candenas download progress */
export const CadenasDownloadProgress: React.VFC<Props> = ({
	initialProgress,
	stringTime,
}) => {
	const [progress, setProgress] = useState(initialProgress);
	const intervalIdRef = useRef<number>();

	useOnMounted(() => {
		// initialProgress が 100% 完了なら、setInterval しない
		if (initialProgress === MAX_STEP) {
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
				return Math.min(MAX_STEP, progress + MAX_STEP / time);
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
		if (progress >= MAX_STEP) {
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
				intervalIdRef.current = undefined;
			}
		}
	}, [progress]);

	const step = Math.round(progress);

	return <Progress step={step} maxStep={MAX_STEP} />;
};

CadenasDownloadProgress.displayName = 'CadenasDownloadProgress';
