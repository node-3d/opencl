import fs from 'node:fs';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';
import * as U from './utils.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;

before(() => {
	({ context } = cl.quickStart());
});

describe('Program - getProgramInfo binaries', () => {
	const testForType = (key: keyof typeof cl, _assert: (v: unknown) => void) => {
		it(`returns the good type for ${key}`, () => {
			U.withProgram(context, squareKern, (prg) => {
				const val = cl.getProgramInfo(prg, cl[key] as unknown as number);
				_assert(val);
			});
		});
	};

	testForType('PROGRAM_BINARIES', (v) => U.assertType(v, 'array'));
	testForType('PROGRAM_BINARY_SIZES', (v) => U.assertType(v, 'array'));
});
