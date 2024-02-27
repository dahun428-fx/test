import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { ShowableSupplement } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { SpecValue } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse';
import {
	AlterationSpecValue,
	SupplementType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import {
	MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SupplementBalloon.module.scss';
import { Checkbox } from '@/components/pc/ui/controls/checkboxes';
import useOuterClick from '@/hooks/ui/useOuterClick';
import classNames from 'classnames';

type Props = {
	showableSupplement: ShowableSupplement;
	onClickOutside: () => void;
	onChange?: (
		specs: Partial<SearchPartNumberRequest>,
		isHiddenSpec?: boolean
	) => void;
	specFilterRef?: MutableRefObject<HTMLDivElement | null>;
};

export const SupplementBalloon: React.FC<Props> = ({
	showableSupplement,
	specFilterRef,
	onClickOutside,
	onChange,
}) => {
	const { spec, y } = showableSupplement;
	const {
		detailHtml,
		specCode,
		specDescriptionImageUrl,
		specImageUrl,
		specName,
		specValueList,
		supplementType,
	} = spec;

	const ref = useRef<HTMLDivElement | null>(null);
	const { t } = useTranslation();

	const isSelectorType =
		supplementType === SupplementType.ZOOM_IMAGE ||
		supplementType === SupplementType.ILLUSTRATION;

	const onSelect = useCallback(
		({ specValue, hiddenFlag }: SpecValue | AlterationSpecValue) => {
			const isHidden = Flag.isTrue(hiddenFlag);
			onChange?.({ [specCode]: isHidden ? specValue : [specValue] }, isHidden);
			onClickOutside();
		},
		[onChange, onClickOutside, specCode]
	);

	const content = useMemo(() => {
		if (supplementType === SupplementType.DETAIL && detailHtml) {
			return <LegacyStyledHtml html={detailHtml} />;
		}

		if (supplementType === SupplementType.DRAWING && specImageUrl) {
			return <img src={specImageUrl} alt={specName} />;
		}

		if (specDescriptionImageUrl) {
			return <img src={specDescriptionImageUrl} alt={specName} />;
		}

		if (isSelectorType) {
			return (
				<ul className={styles.selector}>
					{specValueList.map(value => (
						<li
							key={value.specValue}
							className={styles.listItem}
							onClick={() => onSelect(value)}
						>
							<Checkbox
								checked={!!Number(value.selectedFlag)}
								onChange={checked => checked && onSelect(value)}
							/>
							<img src={value.specValueImageUrl} alt={value.specValueDisp} />
							<p>{value.specValueDisp}</p>
						</li>
					))}
				</ul>
			);
		}

		return null;
	}, [
		detailHtml,
		isSelectorType,
		onSelect,
		specDescriptionImageUrl,
		specImageUrl,
		specName,
		specValueList,
		supplementType,
	]);

	useOuterClick(ref, onClickOutside);

	useEffect(() => {
		if (specFilterRef?.current && ref.current && showableSupplement) {
			ref.current.style.transform = `translate(100%,  calc(${y}px - 10%))`;
			ref.current.style.maxHeight = ``;
			ref.current.style.top = ``;
			ref.current.style.overflow = ``;

			const specFilterRect = specFilterRef?.current?.getBoundingClientRect();
			const supplementRect = ref.current.getBoundingClientRect();
			const vh = Math.max(
				document.documentElement.clientHeight || 0,
				window.innerHeight || 0
			);
			const maxHeight = Number(vh * 0.5);

			const tabFixedMargin = 75;
			const topFixedMargin =
				document.getElementById('actionsPanel')?.getBoundingClientRect()
					.bottom ?? 0;
			const bottomFixedMargin =
				document.getElementById('bottomFix')?.getBoundingClientRect().height ??
				0;

			const specBottom = specFilterRect.bottom;
			const specHeight = specFilterRect.bottom - topFixedMargin;
			const supplyBottom = supplementRect.bottom;
			const supplyHeight = supplementRect.height;

			if (supplyBottom > specBottom) {
				if (supplyHeight > specHeight) {
					const value = specBottom - tabFixedMargin;
					const height = specBottom - topFixedMargin - bottomFixedMargin;
					const adjustHeight = height > maxHeight ? maxHeight : height;
					ref.current.style.transform = `translate(100%, calc( 100vh - ${value}px ))`;
					ref.current.style.maxHeight = `${adjustHeight}px`;
					ref.current.style.overflow = 'auto';
				} else {
					const height =
						maxHeight > specBottom - topFixedMargin
							? specBottom - topFixedMargin
							: maxHeight;
					ref.current.style.transform = `translate(100%,  calc(${y}px - 10%))`;
					ref.current.style.top = `-${Number(
						supplyBottom - specBottom + bottomFixedMargin
					)}px`;
					ref.current.style.maxHeight = `${height}px`;
					ref.current.style.overflow = 'auto';
				}
			}
		}
	}, [spec, showableSupplement, onChange, onClickOutside, specFilterRef, ref]);

	return (
		<div className={classNames(styles.container)} ref={ref}>
			<h2 className={styles.m3}>{spec.specName}</h2>
			{isSelectorType && (
				<h3 className={styles.header}>
					{t('pages.productDetail.pu.specFilter.supplementBalloon.title')}
				</h3>
			)}
			<div className={styles.content}>{content}</div>
		</div>
	);
};

SupplementBalloon.displayName = 'SupplementBalloon';
