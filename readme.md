# postcss-each-variables [![Build Status](https://travis-ci.org/awcross/postcss-each-variables.svg?branch=master)](https://travis-ci.org/awcross/postcss-each-variables)

[PostCSS](https://github.com/postcss/postcss) plugin enabling variable mapping for `@each`.


## Install
```js
npm install --save-dev postcss-each-variables
```

## Usage

```js
postcss([ require('postcss-each-variables') ])
```

Note: you must include postcss-each-variables before other at-rules plugins.

```css
:root {
	--breakpoints: (
		sm: 576px,
		md: 768px,
		lg: 992px,
		xl: 1200px
	);
}

@each $key, $value in var(--breakpoints) {
	.container-$(key) {
		max-width: $(value);
	}
}
```

```css
:root {
	--breakpoints: (
		sm: 576px,
		md: 768px,
		lg: 992px,
		xl: 1200px
	);
}

@each $key, $value in (sm, md, lg, xl), (576px, 768px, 992px, 1200px) {
	.container-$(key) {
		max-width: $(value);
	}
}
```

See [PostCSS](https://github.com/postcss/postcss) docs for examples for your environment.
