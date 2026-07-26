import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;
let device = null as unknown as cl.TClDevice;

before(() => {
	({ context, device } = cl.quickStart());
});

describe('Program - buildProgram invalid', () => {
	it('throws if program is nullptr', () => {
		assert.throws(
			() => cl.buildProgram(null as unknown as cl.TClProgram),
			new Error('Argument 0 must be of type `Object`'),
		);
	});

	it('throws if program is invalid', () => {
		const prg = cl.createProgramWithSource(context, `${squareKern}????`);
		assert.throws(() => cl.buildProgram(prg, [device]), cl.BUILD_PROGRAM_FAILURE);
	});
});
