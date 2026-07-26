{
	'variables': {
		'bin': '<!(node -e "import(\'@node-3d/addon-tools\').then((m) => m.printBin())")',
		'cl_include': 'include',
		'opencl_lib_machine%': 'X64',
	},
	'targets': [
		{
			'target_name': 'opencl',
			'includes': ['common.gypi'],
			'sources': [
				'cpp/bindings.cpp',
			],
			'include_dirs': [
				'<!@(node -e "import(\'@node-3d/addon-tools\').then((m) => m.printInclude())")',
				'<(cl_include)',
			],
			'conditions': [
				['OS=="win" and target_arch=="arm64"', {
					'variables': {
						'opencl_lib_machine': 'ARM64',
					},
				}],
				['OS=="linux"', {
					'libraries': [
						"-Wl,-rpath,'$$ORIGIN'",
						'-lOpenCL',
					],
				}],
				['OS=="mac"', {
					'libraries': ['-framework OpenCL'],
				}],
				['OS=="win"', {
					'actions': [
						{
							'action_name': 'make_opencl_import_lib',
							'inputs': ['lib/OpenCL.def'],
							'outputs': ['<(INTERMEDIATE_DIR)/OpenCL.lib'],
							'action': [
								'lib.exe',
								'/nologo',
								'/def:<(module_root_dir)/lib/OpenCL.def',
								'/machine:<(opencl_lib_machine)',
								'/out:<(INTERMEDIATE_DIR)/OpenCL.lib',
							],
						},
					],
					'libraries': ['<(INTERMEDIATE_DIR)/OpenCL.lib'],
				}],
			],
		},
	],
}
