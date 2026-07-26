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

describe('Kernel - setKernelArg explicit valid', () => {
	it('accepts a memobject as first argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const mem = cl.createBuffer(context, 0, 8, null);

			assert.equal(cl.setKernelArg(k, 0, 'float*', mem), cl.SUCCESS);

			cl.releaseMemObject(mem);
			cl.releaseKernel(k);
		});
	});

	it('accepts an integer as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.ok(cl.setKernelArg(k, 2, 'uint', 5) === cl.SUCCESS);

			cl.releaseKernel(k);
		});
	});
});
