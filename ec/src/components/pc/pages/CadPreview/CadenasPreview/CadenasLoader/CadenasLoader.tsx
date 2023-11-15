import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CadenasLoader.module.scss';
import { Progress } from '@/components/pc/ui/progress';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';

/** progress bar animation sleep time */
const delay = 1000;

export type Props = {
	cadGenerationTime: string;
};

/** Clear interval timer */
function clear(ref: React.MutableRefObject<number | undefined>) {
	if (ref.current) {
		clearInterval(ref.current);
		ref.current = undefined;
	}
}

/**
 * CADENAS loader
 */
export const CadenasLoader: React.VFC<Props> = ({ cadGenerationTime }) => {
	const { t } = useTranslation();
	const [step, setStep] = useState(1);
	const intervalIdRef = useRef<number>();
	const maxStep = useMemo(() => Number(cadGenerationTime), [cadGenerationTime]);

	useOnMounted(() => {
		if (step >= maxStep) {
			return;
		}

		const time = parseInt(cadGenerationTime);
		if (Number.isNaN(time)) {
			// Usually it's impossible to reach here.
			return;
		}

		intervalIdRef.current = window.setInterval(
			() => setStep(step => step + delay / 1000),
			delay
		);

		// on unmounted
		return () => clear(intervalIdRef);
	});

	useEffect(() => {
		if (step >= maxStep) {
			clear(intervalIdRef);
		}
	}, [step, maxStep]);

	return (
		<div className={styles.container}>
			<div className={styles.progress}>
				<Progress step={step} maxStep={maxStep} />
			</div>
			<div className={styles.heading}>
				{t('pages.cadPreview.cadenasPreview.cadenasLoader.headword')}
			</div>
			<div className={styles.note}>
				{t('pages.cadPreview.cadenasPreview.cadenasLoader.note', {
					estimatedTime: cadGenerationTime,
				})}
			</div>
		</div>
	);
};
CadenasLoader.displayName = 'CadenasLoader';
