'use strict';
const postcss = require('postcss');
const rfc = require('reduce-function-call');

const resolveValue = (value, map) => {
	return rfc(value, 'var', body => {
		let variable = map[body];

		if (!variable) {
			return value;
		}

		// Strip outer parentheses
		if (variable.indexOf('(') === 0) {
			variable = variable.replace(/^\(|\)$/g, '');
		}

		const decls = postcss.list.comma(variable);

        // Convert to object
		const result = decls.reduce((obj, decl) => {
			const arr = decl.split(/[:]/).map(str => str.trim());

			return Object.assign({}, obj, {
				[arr[0]]: arr[1]
			});
		}, {});

        // Remove undefined values
		const props = Object.keys(result).filter(n => n);
		const values = Object.keys(result).map(n => result[n]).filter(n => n);

		return values.length ? `(${props}), (${values})` : `(${props})`;
	});
};

const processRule = (params, map) => {
	const values = params.split(/\s+in\s+/).map(str => postcss.list.comma(str))[1];
	params = values.reduce((acc, value) => acc.replace(value, resolveValue(value, map)), params);

	return params;
};

module.exports = postcss.plugin('postcss-each-variables', () => {
	return css => {
		const map = [];

		css.walkRules(rule => {
			if (rule.selector === ':root') {
				rule.each(decl => {
					map[decl.prop] = decl.value;
				});
			}
		});

		css.walkAtRules('each', rule => {
			rule.params = processRule(rule.params, map);
		});
	};
});
