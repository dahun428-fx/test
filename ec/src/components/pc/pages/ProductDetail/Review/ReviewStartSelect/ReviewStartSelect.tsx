import React, { useCallback, useMemo, useState } from 'react';
import styles from './ReviewStartSelect.module.scss';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { REVIEW_START_SIZE } from '@/utils/domain/review';
import { check } from 'prettier';

type Props = {
	score: number;
	setScore: (score: number) => void;
};

const starSize = REVIEW_START_SIZE;

export const ReviewStartSelect: React.VFC<Props> = ({ score, setScore }) => {
	const [checked, setChecked] = useState<boolean[]>(
		new Array<boolean>(starSize).fill(false)
	);
	const [starActive, setStarActive] = useState<boolean[]>(
		new Array<boolean>(starSize).fill(false)
	);

	const handleCheck = (index: number) => {
		const chk = [...checked];
		let max = 0;
		for (let i = 0; i < index; i++) {
			chk[i] = true;
			if (max < i + 1) {
				max = Math.max(max, i + 1);
			}
		}
		for (let i = starSize - 1; i >= index; i--) {
			chk[i] = false;
		}
		setChecked(chk);
		setStarActive(chk);
		setScore(max);
	};

	const onMouseEnterHandler = useCallback(
		(index: number) => {
			const checkedIndex = score - 1;

			const array = [...starActive];
			if (checkedIndex <= index) {
				for (let i = 0; i <= index; i++) {
					array[i] = true;
				}
				for (let i = index + 1; i < starSize; i++) {
					array[i] = false;
				}
				setStarActive(array);
			}
		},
		[starActive, score]
	);

	const starHTML = useMemo(() => {
		let html = [];
		const starShowStyle = { backgroundPosition: '0 -50px' };
		const starNoneStyle = { backgroundPosition: '0 0' };

		for (let index = 0; index < starSize; index++) {
			html.push(
				<label
					key={index}
					className={styles.chk}
					onMouseEnter={() => onMouseEnterHandler(index)}
				>
					<input
						type="checkbox"
						name="star"
						checked={checked[index]}
						onChange={() => handleCheck(index + 1)}
					/>
					<i style={starActive[index] ? starShowStyle : starNoneStyle}></i>
				</label>
			);
		}
		return html;
	}, [checked, starActive]);

	useOnMounted(() => {
		if (score > 0) {
			let array = new Array<boolean>(starSize);
			for (let i = 0; i < score; i++) {
				array[i] = true;
			}
			for (let i = score; i < starSize; i++) {
				array[i] = false;
			}
			setChecked(array);
			setStarActive(array);
		}
	});

	return (
		<>
			<span
				className={styles.starSet}
				onMouseLeave={() => {
					setStarActive(checked);
				}}
			>
				{starHTML}
			</span>
			<span className={styles.score}>
				<strong>{score}</strong> / <span>{starSize}</span>
			</span>
		</>
	);
};

ReviewStartSelect.displayName = 'ReviewStartSelect';
