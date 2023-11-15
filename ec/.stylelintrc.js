module.exports = {
	customSyntax: 'postcss-scss',
	plugins: [
		'stylelint-order',
		'stylelint-scss',
		'stylelint-rational-order-plugin',
	],
	extends: [
		'stylelint-config-standard',
		'stylelint-config-css-modules',
		// prettier と競合するルールを打ち消すため、'stylelint-config-prettier' を最後に記載する必要があります
		'stylelint-config-prettier',
	],
	rules: {
		indentation: 'tab',
		'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
		'at-rule-no-unknown': null,
		'scss/at-rule-no-unknown': true,
		'order/order': [
			[
				{
					type: 'at-rule',
				},
				{
					type: 'at-rule',
					hasBlock: true,
				},
				{
					type: 'at-rule',
					name: 'include',
				},
				{
					type: 'at-rule',
					name: 'include',
					hasBlock: true,
				},
				'dollar-variables',
				'custom-properties',
				'declarations',
				'rules',
			],
		],
		'plugin/rational-order': [
			true,
			{
				'border-in-box-model': false,
				'empty-line-between-groups': false,
			},
		],
		'length-zero-no-unit': true,
		'color-named': 'never',
		'color-hex-length': 'short',
		'shorthand-property-no-redundant-values': true,
		'no-invalid-double-slash-comments': true,
		'alpha-value-notation': 'number',
		'function-url-quotes': 'never',
	},
	overrides: [
		{
			// rules for legacy css (EC V5 css)
			files: ['src/styles/*/legacy/**/*.scss'],
			rules: {
				'declaration-block-no-duplicate-properties': null,
				'font-family-no-duplicate-names': null,
				'function-url-quotes': null,
				'keyframes-name-pattern': null,
				'media-feature-name-no-unknown': null,
				'selector-class-pattern': '^[a-zA-Z0-9_-]+$',
				'selector-id-pattern': null,
				'selector-no-vendor-prefix': null,
				'selector-pseudo-class-no-unknown': null,
				'selector-pseudo-element-no-unknown': null,
				'selector-type-no-unknown': null,
				'no-descending-specificity': null,
				'no-duplicate-selectors': null,
				'value-no-vendor-prefix': null,
			},
		},
	],
};
