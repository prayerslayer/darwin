var gulp = require( 'gulp' ),
    jshint = require( 'gulp-jshint' ),
    watch = require( 'gulp-watch' ),
    jasmine= require( 'gulp-jasmine' );

gulp.task( 'watch', function() {
    gulp.src( 'src/*.js' )
        .pipe( watch() )
        .pipe( jshint() )
        .pipe( jshint.reporter( require('jshint-stylish') ) );
});

gulp.task( 'test', function() {
    gulp.src( 'test/*.js' )
        .pipe( jasmine() );
});

gulp.task( 'default', ['watch'] );