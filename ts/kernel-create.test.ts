import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';
import * as U from './utils.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();
const squareCpyKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square_cpy.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;

before(() => {
	({ context } = cl.quickStart());
});

describe('Kernel - createKernel', () => {
	it('returns a valid kernel', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			assert.ok(k);
			cl.releaseKernel(k);
		});
	});

	it('fails as kernel does not exist', () => {
		U.withProgram(context, squareKern, (prg) => {
			assert.throws(() => cl.createKernel(prg, 'i_do_not_exist'));
		});
	});
});

describe('Kernel - createKernelsInProgram', () => {
	it('returns two valid kernels', () => {
		U.withProgram(context, [squareKern, squareCpyKern].join('\n'), (prg) => {
			const kerns = cl.createKernelsInProgram(prg);
			assert.ok(kerns);
			assert.ok(kerns.length === 2);

			assert.ok(kerns[0]);
			assert.ok(kerns[1]);

			cl.releaseKernel(kerns[0]);
			cl.releaseKernel(kerns[1]);
		});
	});
});
