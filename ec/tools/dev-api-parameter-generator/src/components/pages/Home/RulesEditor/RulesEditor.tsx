import React, { useCallback } from 'react';
import { RuleTile } from './RuleTile';
import styles from './RulesEditor.module.scss';
import { pathList } from './constants';
import { Rule, Rules } from './types';
import { Option, Select } from '@/components/ui/select';
import { createRule } from '@/utils/domain/rule';

export const initialRules: Rules = {
	path: pathList[0],
	ruleList: [createRule()],
};

const optionList: Option[] = pathList.map(path => ({
	value: path,
	label: path,
}));

type Props = {
	rules: Rules;
	onChange: (rules: Rules) => void;
};

export const RulesEditor: React.VFC<Props> = ({ rules, onChange }) => {
	const handleChangePath = useCallback(
		(path: string) => {
			onChange({ ...rules, path });
		},
		[onChange, rules]
	);

	const handleAddRule = useCallback(() => {
		onChange({ ...rules, ruleList: [...rules.ruleList, createRule()] });
	}, [onChange, rules]);

	const handleChangeRule = useCallback(
		(rule: Rule) => {
			onChange({
				...rules,
				ruleList: rules.ruleList.map(item =>
					item.id === rule.id ? rule : item
				),
			});
		},
		[onChange, rules]
	);

	return (
		<div className={styles.container}>
			<div className={styles.pathContainer}>
				<div>API path :</div>
				<div className={styles.pathSelectContainer}>
					<Select
						{...{
							value: rules.path,
							optionList,
							onChange: handleChangePath,
						}}
					/>
				</div>
			</div>
			<div>
				<div>
					{rules.ruleList.map(rule => (
						<RuleTile
							key={rule.id}
							{...{
								className: styles.ruleTile,
								rule,
								onChange: handleChangeRule,
							}}
						/>
					))}
				</div>
				<div>
					<div className={styles.addRuleButton} onClick={handleAddRule}>
						＋　Add a rule
					</div>
				</div>
			</div>
		</div>
	);
};
RulesEditor.displayName = 'RulesEditor';
