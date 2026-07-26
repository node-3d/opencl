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

describe('Kernel - retainKernel', () => {
	it('increments reference count', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			cl.retainKernel(k);
			const after = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);
			assert.strictEqual(after, 2);
			cl.releaseKernel(k);
			cl.releaseKernel(k);
		});
	});
});

describe('Kernel - releaseKernel', () => {
	it('decrements reference count', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			cl.retainKernel(k);
			cl.releaseKernel(k);
			const after = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);
			assert.strictEqual(after, 1);
			cl.releaseKernel(k);
		});
	});
});
