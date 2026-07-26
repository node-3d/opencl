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

describe('Kernel - setKernelArg explicit invalid first argument', () => {
	it('fails when passed a scalar type as first argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(
				() => cl.setKernelArg(k, 0, 'float*', 5),
				new Error('Argument 3 must be of type `Object`'),
			);

			cl.releaseKernel(k);
		});
	});

	it('fails when passed a vector type as first argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(
				() => cl.setKernelArg(k, 0, 'float*', [5, 10, 15]),
				new Error('Argument 3 must be a CL Wrapper.'),
			);

			cl.releaseKernel(k);
		});
	});
});
