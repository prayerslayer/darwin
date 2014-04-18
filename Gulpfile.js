var gulp = require( 'gulp' ),
    jshint = require( 'gulp-jshint' ),
    watch = require( 'gulp-watch' ),
    jasmine= require( 'gulp-jasmine' );

gulp.task( 'watch', function() {
    gulp.src( 'src/*.js' )
        .pipe( watch() )
        .pipe( jshint() )
        .pipe( jshint.reporter( require('jshint-stylish') ) )
        .pipe( jshint.reporter( 'fail' ) );
});

gulp.task( 'test', function() {
    gulp.src( 'test/*.js' )
        .pipe( jasmine() )
        .on( 'error', function( e ) { throw e; });
});

gulp.task( 'default', ['watch'] );