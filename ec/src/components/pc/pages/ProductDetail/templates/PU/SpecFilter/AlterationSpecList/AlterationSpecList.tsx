import {
	AlterationSpec,
	AlterationSpecGroup,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import {
	SpecCode,
	SpecValues,
} from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import {
	PUSpecViewType,
	ParametricUnitPartNumberSpec,
	ShowableSupplement,
} from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { useCallback, useMemo, useState } from 'react';
import { notHidden } from '@/utils/domain/spec';
import { notEmpty, notNull } from '@/utils/predicate';
import { SpecFrame } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFrame';
import { ImageListSpec } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/specs/ImageListSpec';
import { NumericSpec } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/specs/NumericSpec';
import { RadioButtonSpec } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/specs/RadioButtonSpec';
import { TreeSpec } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/specs/TreeSpec';
import classNames from 'classnames';
import styles from './AlterationSpecList.module.scss';
import { Flag } from '@/models/api/Flag';

type Props = {
	alterationNoticeText?: string;
	alterationSpecList: AlterationSpec[];
	alterationSpecGroupList: AlterationSpecGroup[];
	onChange: (spec: Record<SpecCode, SpecValues>) => void;
	sendLog: (payload: SendLogPayload) => void;
	showSupplement?: (showableSupplement: ShowableSupplement) => void;
};
type ValueOf<T> = T[keyof T];

/**
 * alteration spec list
 */
export const AlterationSpecList: React.VFC<Props> = ({
	alterationNoticeText,
	alterationSpecList,
	alterationSpecGroupList,
	onChange,
	sendLog,
	showSupplement,
}) => {
	const [hidenGroupList, setHidenGroupList] = useState<number[]>([]);

	const notHiddenSpec = alterationSpecList.filter(notHidden);

	const specList = useMemo(
		() =>
			notHiddenSpec.filter(
				spec =>
					!alterationSpecGroupList.some(group =>
						group.specCodeList?.includes(spec.specName)
					)
			),
		[alterationSpecGroupList, notHiddenSpec]
	);

	const params = useMemo(() => ({ onChange, sendLog }), [onChange, sendLog]);

	type SpecBox = {
		spec: ParametricUnitPartNumberSpec | AlterationSpec;
		type: 'image' | 'numeric' | 'radio' | 'text' | 'tree';
		isGroupLayout?: boolean;
	};

	const SpecBox = useCallback(
		({ spec, type, isGroupLayout }: SpecBox) => {
			if (
				!spec.specValueList.length &&
				!(notNull(spec.numericSpec) && notHidden(spec.numericSpec))
			) {
				return null;
			}

			return (
				<li
					className={classNames(styles.spec, {
						[String(styles.groupItem)]: isGroupLayout,
					})}
				>
					<SpecFrame
						spec={spec}
						isGroupLayout={isGroupLayout}
						showSupplement={showSupplement}
					>
						{type === 'image' && <ImageListSpec {...params} spec={spec} />}
						{type === 'numeric' && <NumericSpec {...params} spec={spec} />}
						{type === 'radio' && <RadioButtonSpec {...params} spec={spec} />}
						{type === 'tree' && <TreeSpec {...params} spec={spec} />}
					</SpecFrame>
				</li>
			);
		},
		[params, showSupplement]
	);

	const groupList = useMemo(
		() =>
			alterationSpecGroupList
				.map(group => {
					const groupSpec = group.specCodeList
						?.map(specCode =>
							notHiddenSpec.find(spec => spec.specName === specCode)
						)
						.filter(notNull);
					if (groupSpec) {
						return {
							groupSpec,
							...group,
						};
					}
				})
				.filter(notNull)
				.filter(group => group.groupSpec.length > 0),
		[alterationSpecGroupList, notHiddenSpec]
	);

	if (!notEmpty(specList) && !notEmpty(groupList)) {
		return null;
	}

	const handleHiderGroupList = (key: number) => {
		if (hidenGroupList.includes(key)) {
			setHidenGroupList(prev => prev.filter(data => data !== key));
		} else {
			setHidenGroupList(prev => [...prev, key]);
		}
	};

	return (
		<div>
			{alterationNoticeText && (
				<div className={styles.noticeWrap}>
					<p className={styles.notice}>{alterationNoticeText}</p>
				</div>
			)}
			<ul className={styles.specList}>
				{specList.map(spec => {
					switch (spec.specViewType as ValueOf<typeof PUSpecViewType>) {
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
				{groupList.map((group, key) => {
					const showGroupList = !hidenGroupList.includes(key);
					return (
						<li key={key} className={styles.specItem}>
							<div className={styles.groupNameWrapper}>
								<span
									className={classNames(styles.groupName, {
										[String(styles.arrowUp)]: showGroupList,
										[String(styles.arrowDown)]: !showGroupList,
									})}
									onClick={() => handleHiderGroupList(key)}
								>
									{group.groupName}{' '}
								</span>
							</div>

							<div
								className={classNames(styles.optionBox, {
									[String(styles.hiddenGroupList)]: !showGroupList,
								})}
							>
								<div className={styles.groupImageWrapper}>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										className={styles.image}
										src={group.groupDescriptionImageUrl}
										alt="이미지"
									/>
								</div>
								<ul className={styles.groupTable}>
									{group.groupSpec.map(spec => {
										switch (
											spec.specViewType as ValueOf<typeof PUSpecViewType>
										) {
											case PUSpecViewType.PU_IMAGE_BUTTON_LINE_1:
											case PUSpecViewType.PU_IMAGE_BUTTON_LINE_2:
											case PUSpecViewType.PU_IMAGE_BUTTON_LINE_3:
												return (
													<SpecBox
														spec={spec}
														type="image"
														isGroupLayout={true}
														key={spec.specCode}
													/>
												);
											case PUSpecViewType.PU_TEXT_SELECT_LINE_1:
											case PUSpecViewType.PU_TEXT_SELECT_LINE_2:
											case PUSpecViewType.PU_TEXT_SELECT_LINE_3:
											case PUSpecViewType.PU_LIST_SELECT:
												return (
													<SpecBox
														spec={spec}
														type="radio"
														isGroupLayout={true}
														key={spec.specCode}
													/>
												);
											case PUSpecViewType.PU_LIST_TREE:
												return (
													<SpecBox
														spec={spec}
														type="tree"
														isGroupLayout={true}
														key={spec.specCode}
													/>
												);
											case PUSpecViewType.PU_NUMBER_INPUT:
												if (
													spec.numericSpec &&
													Flag.isFalse(spec.numericSpec.hiddenFlag)
												) {
													return (
														<SpecBox
															spec={spec}
															type="numeric"
															isGroupLayout={true}
															key={spec.specCode}
														/>
													);
												}
											default:
												return null;
										}
									})}
								</ul>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

AlterationSpecList.displayName = 'AlterationSpecList';
