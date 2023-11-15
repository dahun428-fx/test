import JSON5 from 'json5';
import React, { useCallback, useState } from 'react';
import styles from './Home.module.scss';
import { RulesEditor, initialRules } from './RulesEditor';
import { ArrayRewriteMethod, Rule, Rules } from './RulesEditor/types';
import { TextArea } from '@/components/ui/input';
import { rewrite } from '@/utils/domain/rewrite';

export const Home: React.VFC = () => {
	const [actualResponse, setActualResponse] = useState('');
	const [rewrittenResponse, setRewrittenResponse] = useState('');
	const [output, setOutput] = useState('');
	const [rules, setRules] = useState<Rules>(initialRules);
	const [actualResponseError, setActualResponseError] = useState('');

	const clearErrors = useCallback(() => {
		setActualResponseError('');
	}, []);

	/** Update rules */
	const updateRules = useCallback((rules: Rules, rule: Rule) => {
		setRules({
			...rules,
			ruleList: rules.ruleList.map(item => (item.id === rule.id ? rule : item)),
		});
	}, []);

	/** Validate actual response */
	const validateActualResponse = useCallback((actualResponse: string) => {
		if (!actualResponse) {
			setOutput('');
			setRewrittenResponse('');
			setActualResponseError('Empty');
			return;
		}

		let actual: Record<string, unknown> | undefined;
		try {
			actual = JSON.parse(actualResponse);
		} catch {
			setOutput('');
			setActualResponseError('JSON parse error');
			return;
		}

		return actual;
	}, []);

	/** Validate rules */
	const validateRules = useCallback(
		(rules: Rules) => {
			const paramsList: {
				response: Record<string, unknown>;
				options: { array: ArrayRewriteMethod };
			}[] = [];

			for (const rule of rules.ruleList) {
				if (!rule.response) {
					updateRules(rules, { ...rule, errorMessage: 'Empty' });
					return;
				}

				let response: Record<string, unknown> | undefined;
				try {
					response = JSON5.parse(rule.response);
				} catch {
					updateRules(rules, { ...rule, errorMessage: 'JSON5 parse error' });
					return;
				}
				updateRules(rules, { ...rule, errorMessage: '' });

				if (!response) {
					updateRules(rules, { ...rule, errorMessage: 'Unknown error' });
					return;
				}
				paramsList.push({
					response,
					options: { array: rule.arrayRewriteMethod },
				});
			}

			return paramsList;
		},

		[updateRules]
	);

	const generateRewrittenResponse = useCallback(
		(payload: { actualResponse: string; rules: Rules }) => {
			const { actualResponse, rules } = payload;

			clearErrors();
			const actual = validateActualResponse(actualResponse);
			const paramsList = validateRules(rules);
			if (actual && paramsList) {
				const rewritten = rewrite({ actual, paramsList });
				setRewrittenResponse(JSON5.stringify(rewritten, null, 2));
				setOutput(
					paramsList
						.map(
							params =>
								`dev:api=${encodeURIComponent(
									JSON5.stringify({ ...params, path: rules.path })
								)}`
						)
						.join('&')
				);
			}
		},
		[clearErrors, validateActualResponse, validateRules]
	);

	const handleChangeRules = useCallback(
		rules => {
			setRules(rules);
			generateRewrittenResponse({ actualResponse, rules });
		},
		[actualResponse, generateRewrittenResponse]
	);

	const handleChangeActualResponse = useCallback(
		(actualResponse: string) => {
			setActualResponse(actualResponse);
			generateRewrittenResponse({ actualResponse, rules });
		},
		[generateRewrittenResponse, rules]
	);

	return (
		<div>
			<h1 className={styles.pageTitle}>dev:api PARAMETER GENERATOR</h1>
			<div className={styles.main}>
				<div>
					<div>
						<h2 className={styles.title}>
							<div>Actual response (JSON)</div>
							<div className={styles.error}>{actualResponseError}</div>
						</h2>
						<TextArea
							{...{
								defaultValue: actualResponse,
								placeholder: 'Paste here',
								wrap: 'off',
								onChange: handleChangeActualResponse,
								className: styles.actualTextArea,
							}}
						/>
						<div className={styles.ruleTileListContainer}>
							<h2>Rewrite rules</h2>
							<RulesEditor {...{ rules, onChange: handleChangeRules }} />
						</div>
					</div>
				</div>
				<div className={styles.arrowContainer}>
					<div>➡︎</div>
					<div>➡︎</div>
					<div>➡︎</div>
					<div>➡︎</div>
					<div>➡︎</div>
				</div>
				<div>
					<div>
						<h2>Rewritten response preview</h2>
						<TextArea
							{...{
								defaultValue: rewrittenResponse,
								readOnly: true,
								wrap: 'off',
								onChange: setRewrittenResponse,
								className: styles.rewrittenTextArea,
							}}
						/>
					</div>
					<div className={styles.outputContainer}>
						<h2>dev:api</h2>
						<TextArea
							{...{
								defaultValue: output,
								readOnly: true,
								wrap: 'soft',
								selectAllOnFocus: true,
								className: styles.outputTextArea,
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
Home.displayName = 'Home';
