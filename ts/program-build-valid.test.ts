import fs from 'node:fs';
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

describe('Program - buildProgram valid', () => {
	it('builds using a valid program and a given device', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		try {
			cl.buildProgram(prg, [device]);
		} finally {
			cl.releaseProgram(prg);
		}
	});

	it('builds using a valid program', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		try {
			cl.buildProgram(prg);
		} finally {
			cl.releaseProgram(prg);
		}
	});

	it('builds using a valid program and options', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		try {
			cl.buildProgram(prg, null, '-D NOCL_TEST=5');
		} finally {
			cl.releaseProgram(prg);
		}
	});
});
