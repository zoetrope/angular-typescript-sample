module.exports = function (grunt) {

    grunt.initConfig({
        typescript: {
            main: {
                src: ['dist/scripts/**/*.ts'],
                dest: 'dist/scripts/App.js',
                options: {
                    target: 'es5',
                    sourcemap: true,
                    declaration: false
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: 'dist/',
                    layout: 'byType',
                    install: true,
                    verbose: true,
                    cleanTargetDir: false,
                    cleanBowerDir: false
                }
            }
        },
        copy: {
            views: {
                files: [
                    {expand: true, flatten: true, cwd: '', src: ['app/views/*.html'], dest: 'dist/views/'},
                    {expand: true, flatten: true, cwd: '', src: ['app/index.html'], dest: 'dist/'},
                    {expand: true, flatten: false, cwd: 'app/scripts', src: ['**/*.ts'], dest: 'dist/scripts'},
                    {expand: true, flatten: false, cwd: 'app/d.ts', src: ['**/*.d.ts'], dest: 'dist/d.ts'}
                ]
            }
        },
        uglify: {
            dev: {
                options: {
                    report: 'min',
                    beautify:true,
                    mangle: false,
                    preserveComments: 'some',

                    sourceMap: 'dist/scripts/App.min.js.map',
                    sourceMapRoot: '',
                    sourceMappingURL: 'App.min.js.map',
                    sourceMapIn: 'dist/scripts/App.js.map',
                    sourceMapPrefix: 1
                },
                files: {
                    'dist/scripts/App.min.js': [
                        'dist/scripts/libs/angular/*.js',
                        'dist/scripts/libs/angular-route/*.js',
                        'dist/scripts/libs/angular-resource/*.js',
                        'dist/scripts/App.js'
                    ]
                }
            }
        },
        clean: {
            dist: {
                src: [
                    'dist/*'
                ]
            }
        },
        connect: {
            options: {
                port: 9001,
                hostname: 'localhost'
            },
            dist: {
                options: {
                    base: 'dist'
                }
            }
        },
        exec: {
            tsd: {
                cmd: function () {
                    return "tsd install jquery angular angular-resource angular-route";
                }
            }
        }
    });

    grunt.registerTask('setup',['clean', 'bower', 'exec:tsd']);

    grunt.registerTask('build',['clean:dist', 'bower', 'copy', 'typescript', 'uglify']);

    grunt.registerTask('serve',['build','connect:dist:keepalive']);

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};