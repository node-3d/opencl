import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';
import * as U from './utils.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;
let isD3DDevice = false;

before(() => {
	const setup = cl.quickStart();
	({ context } = setup);
	isD3DDevice = U.isD3DDevice(setup);
});

describe('Kernel - setKernelArg inferred scalar extra', () => {
	it('fails to pass an extra argument', (t) => {
		if (isD3DDevice) {
			t.skip('OpenCLOn12 crashes while checking inferred extra kernel args.');
			return;
		}

		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(() => cl.setKernelArg(k, 3, null, 5));

			cl.releaseKernel(k);
		});
	});
});
