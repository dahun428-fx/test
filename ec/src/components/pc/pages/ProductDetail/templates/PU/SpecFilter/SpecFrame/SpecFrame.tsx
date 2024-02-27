import {
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	ParametricUnitPartNumberSpec,
	ShowableSupplement,
} from '../SpecFilter.types';
import { AlterationSpec } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import { useTranslation } from 'react-i18next';
import { useBoolState } from '@/hooks/state/useBoolState';
import { getHeight } from '@/utils/dom';
import styles from './SpecFrame.module.scss';
import { getSpecName } from '@/utils/domain/spec';

type Props = {
	children: ReactNode;
	spec: ParametricUnitPartNumberSpec | AlterationSpec;
	openCloseType?: OpenCloseType;
	isGroupLayout?: boolean;
	showSupplement?: (showableSupplement: ShowableSupplement) => void;
};

export const SpecFrame: React.FC<Props> = ({
	children,
	spec,
	openCloseType = OpenCloseType.DISABLE,
	isGroupLayout,
	showSupplement,
}) => {
	const { specName, specUnit } = spec;
	const { t } = useTranslation();

	const { bool: isOpen, toggle: toggleIsOpen } = useBoolState(
		openCloseType !== OpenCloseType.CLOSE
	);

	const [height, setHeight] = useState<number>();
	const contentsRef = useRef<HTMLDivElement>(null);

	const collapsible = openCloseType !== OpenCloseType.DISABLE;
	const ariaExpanded = collapsible ? isOpen : undefined;
	const ariaHidden = collapsible ? !isOpen : undefined;

	const shouldShowSupplementOpener = useMemo(
		() => Number(spec.supplementType) > 1,
		[spec.supplementType]
	);

	const onClickSupplementOpener = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
			const offsetY =
				document.getElementById('specFilter')?.getBoundingClientRect().y ?? 0;
			spec.supplementType && showSupplement?.({ spec, y: e.clientY - offsetY });
		},
		[showSupplement, spec]
	);

	useEffect(() => {
		if (contentsRef.current && collapsible) {
			if (isOpen) {
				setHeight(getHeight(contentsRef.current));
				const observer = new ResizeObserver(([entry]) => {
					if (entry) {
						setHeight(entry.contentRect.height);
					}
				});
				observer.observe(contentsRef.current);
				return () => observer.disconnect();
			}
			setHeight(0);
		}
	}, [collapsible, isOpen]);

	return (
		<div aria-expanded={ariaExpanded} className={styles.frame}>
			<div className={styles.headerWrapper}>
				<h4
					className={isGroupLayout ? styles.groupHeader : styles.header}
					onClick={collapsible ? toggleIsOpen : undefined}
				>
					{getSpecName({ specName, specUnit })}
				</h4>
				{shouldShowSupplementOpener && (
					<a
						className={styles.supplementOpener}
						onClick={onClickSupplementOpener}
					>
						{t(
							`pages.productDetail.pu.specFilter.specFrame.supplementTypes.${spec.supplementType}`
						)}
					</a>
				)}
			</div>
			<div
				className={styles.contents}
				style={{ maxHeight: height != null ? `${height}px` : undefined }}
				aria-hidden={ariaHidden}
			>
				<div ref={contentsRef}>{children}</div>
			</div>
		</div>
	);
};

SpecFrame.displayName = 'SpecFrame';
