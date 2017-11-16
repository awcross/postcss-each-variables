import test from 'ava';
import postcss from 'postcss';
import plugin from './';

const processing = (input, opts) => {
	return postcss([plugin(opts)]).process(input).css;
};

test('simple array', t => {
	const value = ':root { --array: foo, bar, baz; } @each $val in var(--array) {}';
	const expected = ':root { --array: foo, bar, baz; } @each $val in (foo,bar,baz) {}';
	t.is(processing(value), expected);
});

test('array with index', t => {
	const value = ':root { --array: foo, bar, baz; } @each $val, $i in var(--array) {}';
	const expected = ':root { --array: foo, bar, baz; } @each $val, $i in (foo,bar,baz) {}';
	t.is(processing(value), expected);
});

test('array with inner parentheses', t => {
	const value = ':root { --array: purple, hsl(95, 63%, 46%), hsl(6, 63%, 46%); } @each $val in var(--array) {}';
	const expected = ':root { --array: purple, hsl(95, 63%, 46%), hsl(6, 63%, 46%); } @each $val in (purple,hsl(95, 63%, 46%),hsl(6, 63%, 46%)) {}';
	t.is(processing(value), expected);
});

test('multiple arrays with inner parentheses', t => {
	const value = ':root { --names: good, bad, ugly; --colors: purple, hsl(95, 63%, 46%), hsl(6, 63%, 46%); } @each $key, $val in var(--names), var(--colors) {}';
	const expected = ':root { --names: good, bad, ugly; --colors: purple, hsl(95, 63%, 46%), hsl(6, 63%, 46%); } @each $key, $val in (good,bad,ugly), (purple,hsl(95, 63%, 46%),hsl(6, 63%, 46%)) {}';
	t.is(processing(value), expected);
});

test('multiple arrays with inner parentheses 1', t => {
	const value = ':root { --names: good, bad, ugly; --colors: (purple, hsl(95, 63%, 46%), hsl(6, 63%, 46%)); } @each $key, $val in var(--names), var(--colors) {}';
	const expected = ':root { --names: good, bad, ugly; --colors: (purple, hsl(95, 63%, 46%), hsl(6, 63%, 46%)); } @each $key, $val in (good,bad,ugly), (purple,hsl(95, 63%, 46%),hsl(6, 63%, 46%)) {}';
	t.is(processing(value), expected);
});

test('simple map', t => {
	const value = ':root { --map: ( foo: baz, bar: raz ); } @each $key, $val in var(--map) {}';
	const expected = ':root { --map: ( foo: baz, bar: raz ); } @each $key, $val in (foo,bar), (baz,raz) {}';
	t.is(processing(value), expected);
});

test('map with inner parentheses', t => {
	const value = ':root { --map: ( foo: baz, bar: hsl(95, 63%, 46%) ); } @each $key, $val in var(--map) {}';
	const expected = ':root { --map: ( foo: baz, bar: hsl(95, 63%, 46%) ); } @each $key, $val in (foo,bar), (baz,hsl(95, 63%, 46%)) {}';
	t.is(processing(value), expected);
});
