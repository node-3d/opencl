import fs from 'node:fs';
import { strict as assert } from 'node:assert';
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

describe('Kernel - setKernelArg inferred scalar invalid primitive', () => {
	it('fails when passed a char as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(() => cl.setKernelArg(k, 2, null, 'a'), cl.INVALID_ARG_VALUE);

			cl.releaseKernel(k);
		});
	});

	it('fails when passed a vector as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(() => cl.setKernelArg(k, 2, null, [5, 10, 15]), cl.INVALID_ARG_VALUE);

			cl.releaseKernel(k);
		});
	});
});
