import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import {
	PUSpecViewType,
	ParametricUnitPartNumberSpec,
	ShowableSupplement,
} from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import styles from './SpecFilter.module.scss';
import { SendLogPayload } from '@/utils/domain/spec/types';
import {
	AlterationSpec,
	AlterationSpecGroup,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { notNull } from '@/utils/predicate';
import { notHidden } from '@/utils/domain/spec';
import { SpecFrame } from './SpecFrame';
import { ImageListSpec } from './specs/ImageListSpec';
import { NumericSpec } from './specs/NumericSpec';
import { RadioButtonSpec } from './specs/RadioButtonSpec';
import { TreeSpec } from './specs/TreeSpec';
import { SelectSpec } from './specs/SelectSpec';
import classNames from 'classnames';
import { Flag } from '@/models/api/Flag';
import { AlterationSpecList } from './AlterationSpecList/AlterationSpecList';
import { SupplementBalloon } from './SupplementBalloon';

type Props = {
	specList: ParametricUnitPartNumberSpec[];
	onChange: (
		specs: Partial<SearchPartNumberRequest>,
		isHiddenSpec?: boolean
	) => void;
	sendLog: (payload: SendLogPayload) => void;
	className?: string;
	alterationNoticeText?: string;
	alterationSpecList: AlterationSpec[];
	alterationSpecGroupList: AlterationSpecGroup[];
};

export const SpecFilter: React.VFC<Props> = ({
	specList,
	onChange,
	sendLog,
	className,
	alterationNoticeText,
	alterationSpecList,
	alterationSpecGroupList,
}) => {
	const { t } = useTranslation();
	const [offsetY, setOffsetY] = useState(0);
	const [showableSupplement, setShowableSupplement] =
		useState<ShowableSupplement | null>(null);
	const specFilterRef = useRef<HTMLDivElement | null>(null);

	const showSupplement = useCallback(showableSupplement => {
		setShowableSupplement(showableSupplement);
	}, []);

	const closeSupplement = useCallback(() => setShowableSupplement(null), []);

	const params = useMemo(() => ({ onChange, sendLog }), [onChange, sendLog]);

	type SpecBox = {
		spec: ParametricUnitPartNumberSpec;
		type: 'image' | 'numeric' | 'radio' | 'text' | 'tree' | 'select';
	};

	const SpecBox = useCallback(
		({ spec, type }: SpecBox) => {
			if (
				!spec.specValueList.length &&
				!(notNull(spec.numericSpec) && notHidden(spec.numericSpec))
			) {
				return null;
			}

			return (
				<li className={styles.spec}>
					<SpecFrame spec={spec} showSupplement={showSupplement}>
						{type === 'image' && <ImageListSpec {...params} spec={spec} />}
						{type === 'numeric' && <NumericSpec {...params} spec={spec} />}
						{type === 'radio' && <RadioButtonSpec {...params} spec={spec} />}
						{type === 'tree' && <TreeSpec {...params} spec={spec} />}
						{type === 'select' && <SelectSpec {...params} spec={spec} />}
					</SpecFrame>
				</li>
			);
		},
		[params, showSupplement]
	);

	const onScroll = useCallback(() => {
		const y =
			document.getElementById('actionsPanel')?.getBoundingClientRect().bottom ??
			0;
		setOffsetY(y + 32); // margin32px
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	return (
		<div
			className={classNames(className, styles.container)}
			id="specFilter"
			style={{
				top: `${offsetY}px`,
				maxHeight: `calc(100vh - ${offsetY}px)`,
			}}
		>
			<h2 className={styles.title}>
				{t('pages.productDetail.pu.specFilter.title')}
			</h2>
			<div className={styles.content} ref={specFilterRef}>
				<ul className={styles.list}>
					{specList.map(spec => {
						switch (spec.specViewType) {
							case PUSpecViewType.PU_PULL_DOWN:
								return (
									<SpecBox spec={spec} type="select" key={spec.specCode} />
								);
							case PUSpecViewType.PU_IMAGE_BUTTON_LINE_1:
							case PUSpecViewType.PU_IMAGE_BUTTON_LINE_2:
							case PUSpecViewType.PU_IMAGE_BUTTON_LINE_3:
								return <SpecBox spec={spec} type="image" key={spec.specCode} />;
							case PUSpecViewType.PU_TEXT_SELECT_LINE_1:
							case PUSpecViewType.PU_TEXT_SELECT_LINE_2:
							case PUSpecViewType.PU_TEXT_SELECT_LINE_3:
							case PUSpecViewType.PU_LIST_SELECT:
								return <SpecBox spec={spec} type="radio" key={spec.specCode} />;
							case PUSpecViewType.PU_LIST_TREE:
								return <SpecBox spec={spec} type="tree" key={spec.specCode} />;
							case PUSpecViewType.PU_NUMBER_INPUT:
								if (
									spec.numericSpec &&
									Flag.isFalse(spec.numericSpec.hiddenFlag)
								) {
									return (
										<SpecBox spec={spec} type="numeric" key={spec.specCode} />
									);
								}
						}
					})}
				</ul>
				<AlterationSpecList
					alterationNoticeText={alterationNoticeText}
					alterationSpecList={alterationSpecList}
					alterationSpecGroupList={alterationSpecGroupList}
					onChange={onChange}
					sendLog={sendLog}
					showSupplement={showSupplement}
				/>
				{showableSupplement && (
					<SupplementBalloon
						showableSupplement={showableSupplement}
						onChange={onChange}
						onClickOutside={closeSupplement}
						specFilterRef={specFilterRef}
					/>
				)}
			</div>
		</div>
	);
};

SpecFilter.displayName = 'SpecFilter';
