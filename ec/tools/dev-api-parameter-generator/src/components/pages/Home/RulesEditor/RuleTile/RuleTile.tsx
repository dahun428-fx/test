import classNames from 'classnames';
import React, { useCallback } from 'react';
import styles from './RuleTile.module.scss';
import { arrayRewriteMethodList } from '@/components/pages/Home/RulesEditor/constants';
import {
	ArrayRewriteMethod,
	Rule,
} from '@/components/pages/Home/RulesEditor/types';
import { TextArea } from '@/components/ui/input';
import { Select, Option } from '@/components/ui/select';

const optionList: Option[] = arrayRewriteMethodList.map(method => ({
	value: method,
	label:
		method === ArrayRewriteMethod.OVERWRITE
			? `${method} (recommended)`
			: method,
}));

type Props = Partial<Pick<HTMLElement, 'className'>> & {
	rule: Rule;
	onChange: (rule: Rule) => void;
};

export const RuleTile: React.VFC<Props> = ({ className, rule, onChange }) => {
	const handleChangeArrayRewriteMethod = useCallback(
		value => {
			onChange({ ...rule, arrayRewriteMethod: value });
		},
		[onChange, rule]
	);

	const handleChangeResponseRewriteRule = useCallback(
		value => {
			if (!value) {
				onChange({ ...rule, response: '' });
				return;
			}
			onChange({ ...rule, response: value });
		},
		[onChange, rule]
	);

	return (
		<div className={classNames(styles.container, className)}>
			<div className={styles.methodContainer}>
				<div>Array rewrite method :</div>
				<div>
					<Select
						{...{
							value: rule.arrayRewriteMethod,
							optionList,
							onChange: handleChangeArrayRewriteMethod,
							className: styles.methodSelectContainer,
						}}
					/>
				</div>
			</div>
			<div className={styles.responseContainer}>
				<div className={styles.title}>
					<div>Response rewrite rule (JSON5)</div>
					<div className={styles.error}>{rule.errorMessage}</div>
				</div>
				<TextArea
					{...{
						defaultValue: rule.response,
						onChange: handleChangeResponseRewriteRule,
						className: styles.responseTextArea,
					}}
				/>
			</div>
		</div>
	);
};
RuleTile.displayName = 'RuleTile';
