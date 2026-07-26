import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;
let device = null as unknown as cl.TClDevice;

before(() => {
	({ context, device } = cl.quickStart());
});

describe('Program - createProgramWithSource', () => {
	it('returns a valid program', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		assert.ok(prg);
		cl.releaseProgram(prg);
	});

	it('throws as context is invalid', () => {
		assert.throws(
			() => cl.createProgramWithSource(null as unknown as cl.TClContext, squareKern),
			new Error('Argument 0 must be of type `Object`'),
		);
	});
});

describe('Program - createProgramWithBinary', () => {
	it('fails as binaries list is empty', () => {
		assert.throws(() => cl.createProgramWithBinary(context, [device], []), cl.INVALID_VALUE);
	});
});

describe('Program - createProgramWithBuiltInKernels', () => {
	it('fails as context is invalid', () => {
		assert.throws(
			() =>
				cl.createProgramWithBuiltInKernels(
					null as unknown as cl.TClContext,
					[device],
					['a'],
				),
			new Error('Argument 0 must be of type `Object`'),
		);
	});

	it('fails as device list is empty', () => {
		assert.throws(
			() => cl.createProgramWithBuiltInKernels(context, [], ['a']),
			cl.INVALID_VALUE,
		);
	});

	it('fails as names list is empty', () => {
		assert.throws(
			() => cl.createProgramWithBuiltInKernels(context, [device], []),
			cl.INVALID_VALUE,
		);
	});

	it('fails as names list contains non string values', () => {
		assert.throws(
			() =>
				cl.createProgramWithBuiltInKernels(
					context,
					[device],
					[(() => 0) as unknown as string],
				),
			cl.INVALID_VALUE,
		);
	});
});
