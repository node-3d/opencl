import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';
import * as U from './utils.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;
let device = null as unknown as cl.TClDevice;

before(() => {
	({ context, device } = cl.quickStart());
});

describe('Program - getProgramInfo', () => {
	const testForType = (key: keyof typeof cl, _assert: (v: unknown) => void) => {
		it(`returns the good type for ${key}`, () => {
			U.withProgram(context, squareKern, (prg) => {
				const val = cl.getProgramInfo(prg, cl[key] as unknown as number);
				_assert(val);
			});
		});
	};

	testForType('PROGRAM_REFERENCE_COUNT', (v) => U.assertType(v, 'number'));
	testForType('PROGRAM_NUM_DEVICES', (v) => U.assertType(v, 'number'));
	testForType('PROGRAM_CONTEXT', (v) => U.assertType(v, 'object'));
	testForType('PROGRAM_DEVICES', (v) => U.assertType(v, 'array'));
	testForType('PROGRAM_BINARIES', (v) => U.assertType(v, 'array'));
	testForType('PROGRAM_BINARY_SIZES', (v) => U.assertType(v, 'array'));
	testForType('PROGRAM_SOURCE', (v) => U.assertType(v, 'string'));

	it('has the same program source as the one given', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		assert.ok(cl.getProgramInfo(prg, cl.PROGRAM_SOURCE) === squareKern);
		cl.releaseProgram(prg);
	});
});

describe('Program - getProgramBuildInfo', () => {
	const testForType = (key: keyof typeof cl, _assert: (v: unknown) => void) => {
		it(`returns the good type for ${key}`, () => {
			U.withProgram(context, squareKern, (prg) => {
				const val = cl.getProgramBuildInfo(prg, device, cl[key] as unknown as number);
				_assert(val);
			});
		});
	};

	testForType('PROGRAM_BUILD_STATUS', (v) => U.assertType(v, 'number'));
	testForType('PROGRAM_BUILD_OPTIONS', (v) => U.assertType(v, 'string'));
	testForType('PROGRAM_BUILD_LOG', (v) => U.assertType(v, 'string'));

	it('returns the same options string that was passed before', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const buildOpts = '-D NOCL_TEST=5';
		cl.buildProgram(prg, null, buildOpts);

		const opt = cl.getProgramBuildInfo(prg, device, cl.PROGRAM_BUILD_OPTIONS) as string;
		assert.ok(opt.includes(buildOpts));
		cl.releaseProgram(prg);
	});
});
