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

describe('Kernel - setKernelArg explicit invalid scalar', () => {
	it('fails when passed a char as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(() => cl.setKernelArg(k, 2, 'char', 'a'), cl.INVALID_ARG_VALUE);

			cl.releaseKernel(k);
		});
	});

	it('fails when passed a vector as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(() => cl.setKernelArg(k, 2, 'int', [5, 10, 15]), cl.INVALID_ARG_VALUE);

			cl.releaseKernel(k);
		});
	});

	it('fails when passed a memobject as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const mem = cl.createBuffer(context, 0, 8, null);

			assert.throws(() => cl.setKernelArg(k, 2, 'int', mem), cl.INVALID_ARG_VALUE);

			cl.releaseMemObject(mem);
			cl.releaseKernel(k);
		});
	});
});
