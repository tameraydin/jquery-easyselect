module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('easyselect.jquery.json'),
		banner: '/*! \n\t<%= pkg.title %> <%= pkg.version %> - <%= pkg.homepage %>\n*/\n',
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: ['dist/jquery.easyselect.min.css']
				}
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>\n'
			},
			build: {
				files: {
					'dist/jquery.easyselect.min.js': ['src/jquery.easyselect.js']
				}
			}
		},
		jshint: {
			all: [
				'src/jquery.easyselect.js'
			]
		},
		jasmine : {
			src : 'dist/jquery.easyselect.min.js',
			options : {
				specs : 'test/spec/easySelect.js',
				vendor: [
					'lib/jquery-1.4.2.min.js'
				]
			}
		},
		less: {
			main: {
				dest: 'dist/jquery.easyselect.min.css',
				src: [
					'src/jquery.easyselect.base.less',
					'src/jquery.easyselect.theme.default.less'
				],
				options: {
					yuicompress: true
				}
			}
		},
		watch: {
			css: {
				files: 'src/*.less',
				tasks: ['less']
			},
			scripts: {
				files: ['src/*.js'],
				tasks: ['uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-banner');

	grunt.registerTask('default', ['less','uglify','usebanner','jshint','jasmine']);

};