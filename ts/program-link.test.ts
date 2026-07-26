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
let device = null as unknown as cl.TClDevice;

before(() => {
	({ context, device } = cl.quickStart());
});

describe('Program - linkProgram', () => {
	it('fails as context is invalid', () => {
		U.withProgram(context, squareKern, (prg) => {
			assert.throws(() => cl.linkProgram({} as unknown as cl.TClContext, null, null, [prg]));
		});
	});

	it('fails as program is of bad type', () => {
		U.withProgram(context, squareKern, () => {
			assert.throws(() =>
				cl.linkProgram(context, [device], null, [{} as unknown as cl.TClProgram]),
			);
		});
	});

	it('links one compiled program', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		cl.compileProgram(prg);

		const nprg = cl.linkProgram(context, null, null, [prg]);
		U.assertType(nprg, 'object');

		cl.releaseProgram(nprg);
		cl.releaseProgram(prg);
	});

	it('links one compiled program with a list of devices', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		cl.compileProgram(prg, [device]);
		const nprg = cl.linkProgram(context, [device], null, [prg]);
		U.assertType(nprg, 'object');
		cl.releaseProgram(prg);
	});

	it('links two compiled programs', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		cl.compileProgram(prg);

		const prg2 = cl.createProgramWithSource(context, squareCpyKern);
		cl.compileProgram(prg2);

		const nprg = cl.linkProgram(context, null, null, [prg, prg2]);
		U.assertType(nprg, 'object');

		cl.releaseProgram(prg);
		cl.releaseProgram(prg2);
	});
});
