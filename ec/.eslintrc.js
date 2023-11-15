const defaultRestrictedImportPatterns = ['*../**'];

module.exports = {
	root: true,
	plugins: ['unused-imports', 'sort-keys-fix'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'next/core-web-vitals',
		'plugin:storybook/recommended',
		'plugin:storybook/recommended',
	],
	settings: {
		'import/resolver': 'webpack',
	},
	rules: {
		//=========================================================================
		// basic rules
		curly: 'error',
		'lines-between-class-members': ['error', 'always'],
		// Suppress to conflict to @typescript-eslint/explicit-member-accessibility
		'member-access': 'off',
		'no-console': 'error',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-dupe-keys': 'error',
		'no-eval': 'error',
		'no-restricted-imports': [
			'error',
			{
				patterns: defaultRestrictedImportPatterns,
			},
		],
		'no-restricted-syntax': ['error', 'TSEnumDeclaration'],
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: 'function',
				next: 'function',
			},
			{
				blankLine: 'always',
				prev: 'block-like',
				next: 'block-like',
			},
		],
		'spaced-comment': [
			'error',
			'always',
			{
				line: {
					exceptions: ['-', '='],
				},
				block: {
					balanced: true,
				},
				markers: ['/'], // Suppress errors when use Triple-slash directives
			},
		],
		'react/display-name': 'off',

		//=========================================================================
		// react hooks
		'react-hooks/exhaustive-deps': [
			'warn',
			{
				enableDangerousAutofixThisMayCauseInfiniteLoops: true,
			},
		],
		//=========================================================================
		// import
		'import/no-duplicates': ['error'],
		'import/no-namespace': ['error'],
		'import/order': [
			'error',
			{
				alphabetize: {
					order: 'asc',
				},
				'newlines-between': 'never',
			},
		],
		//=========================================================================
		// unused-imports
		'unused-imports/no-unused-imports': 'error',
	},
	overrides: [
		{
			// Rules for TypeScript only
			files: ['**/*.ts?(x)'],
			rules: {
				//=====================================================================
				// basic rules
				// Suppress to conflict to @typescript-eslint/no-explicit-any
				'no-any': 'off',
				// For overload
				'no-dupe-class-members': 'off',
				//=====================================================================
				// @typescript-eslint
				'@typescript-eslint/explicit-member-accessibility': [
					'error',
					{
						accessibility: 'no-public',
					},
				],
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/no-empty-interface': 0,
				'@typescript-eslint/no-explicit-any': 'error',
			},
		},
		{
			// Rules for i18n translation dictionaries
			files: ['src/i18n/*/resources/*/translation/**/*.ts'],
			rules: {
				//=====================================================================
				// sort-keys-fix
				'sort-keys-fix/sort-keys-fix': 'error',
			},
		},
		{
			// Rules for pc
			files: ['src/**/pc/**/*.ts?(x)'],
			rules: {
				// pc から mobile の参照を禁ずる
				'no-restricted-imports': [
					'error',
					{
						patterns: defaultRestrictedImportPatterns.concat('**/mobile/**'),
					},
				],
			},
		},
		{
			// Rules for mobile
			files: ['src/**/mobile/**/*.ts?(x)'],
			rules: {
				// mobile から pc の参照を禁ずる
				'no-restricted-imports': [
					'error',
					{
						patterns: defaultRestrictedImportPatterns.concat('**/pc/**'),
					},
				],
			},
		},
		{
			// Rules for i18n files
			files: ['src/**/*.i18n.*.ts'],
			rules: {
				'no-restricted-imports': [
					'error',
					{
						// NG: import { customerServicePanel } from '@/components/pc/ui/panels/CustomerServicePanel/i18n.en';
						// OK: import { Translation } from '@/i18n/types';
						patterns: defaultRestrictedImportPatterns.concat('@/**/*i18n.*'),
					},
				],
			},
		},
		{
			// Rules for i18n translation index.ts
			files: ['src/i18n/*/resources/*/translation/index.ts'],
			rules: {
				// translation の index.ts のみ、親方向への相対パス参照を許可する。
				// https://github.com/misumi-org/order-web-id/issues/469
				'no-restricted-imports': [
					'error',
					{
						// ただし、やはり @ を使った i18n 定義ファイルの参照を許さない
						// NG: import { customerServicePanel } from '@/components/pc/ui/panels/CustomerServicePanel/i18n.en';
						// OK: import { Translation } from '@/i18n/types';
						patterns: ['@/**/*i18n.*'],
					},
				],
			},
		},
	],
};
