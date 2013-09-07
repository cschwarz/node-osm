module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['gruntfile.js', '*.js', 'entities/*.js', 'test/*.js', 'util/*.js']
		},
		mochaTest: {
			test: {
				options: {
					report: 'spec'
				},
				src: ['test/**/*.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('default', ['jshint', 'mochaTest']);
};