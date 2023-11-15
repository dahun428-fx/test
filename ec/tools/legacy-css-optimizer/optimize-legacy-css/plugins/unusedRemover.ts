import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

export function unusedRemover(
	usedClassNames: string[]
): postcss.AcceptedPlugin {
	return {
		postcssPlugin: 'unused-remover',
		AtRule(atRule) {
			atRule.remove();
		},
		Root(root) {
			root.walkRules(rule => {
				const optimized = rule.selectors
					.map(selector =>
						selectorParser(selectors =>
							selectorProcessor(selectors, usedClassNames)
						).processSync(selector)
					)
					.filter(s => s.trim() !== '');

				if (optimized.length === 0) {
					rule.remove();
				} else {
					rule.selectors = optimized;
				}
			});
		},
	};
}

function selectorProcessor(
	selectors: selectorParser.Root,
	usedClassNames: string[]
) {
	for (const node of selectors.nodes) {
		switch (node.first.type) {
			case 'class':
				if (!usedClassNames.includes(node.first.value)) {
					node.remove();
				}
				break;
			case 'id':
				// TODO: extract id list
				if (![''].includes(node.first.value)) {
					node.remove();
				}
				break;
			case 'attribute':
				if (node.first.attribute.startsWith('data-')) {
					// TODO: extract data-* list
					node.remove();
				} else if (node.first.attribute === 'class') {
					if (shouldRemoveAttribute(node.first, usedClassNames)) {
						node.remove();
					}
				}
				break;
			case 'tag':
				const second = node.nodes[1];
				if (second && second.type === 'class') {
					if (!usedClassNames.includes(second.value)) {
						node.remove();
					}
				}
				break;
			default:
			// no-op
		}
	}
}

function shouldRemoveAttribute(
	node: selectorParser.Attribute,
	usedClassNames: string[]
) {
	switch (node.operator) {
		case '^=':
			return !usedClassNames.some(cls => cls.startsWith(node.value ?? ''));
		default:
			return false;
	}
}
