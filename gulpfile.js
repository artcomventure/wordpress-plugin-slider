let gulp = require( 'gulp' )
    replace = require( 'gulp-replace' ),
    del = require( 'del' ),
    concat = require( 'gulp-concat' );

gulp.task( 'build', gulp.series( build = (done) => {
    // clear dist folder
    del.sync( 'dist/**/*' );

    // collect all needed files
    gulp.src( [
        '**/*',
        // ... but:
        '!**/*.scss',
        '!**/*.css.map',
        '!js/*.js.map',
        '!*.md',
        '!LICENSE',
        '!readme.txt',
        '!gulpfile.js',
        '!package.json',
        '!package-lock.json',
        '!node_modules{,/**}',
        '!dist{,/**}',
        '!assets{,/**}',
        '!src{,/**}'
    ] ).pipe( gulp.dest( 'dist/' ) );

    // concat files for WP's readme.txt
    // manually validate output with https://wordpress.org/plugins/about/validator/
    gulp.src( [ 'readme.txt', 'README.md', 'CHANGELOG.md' ] )
        .pipe( concat( 'readme.txt' ) )
        // remove screenshots
        // todo: scrennshot section for WP's readme.txt
        .pipe( replace( /\n\!\[image\]\([^)]+\)\n/g, '' ) )
        // WP markup
        .pipe( replace( /#\s*(Changelog)/g, "## $1" ) )
        .pipe( replace( /##\s*([^(\n)]+)/g, "== $1 ==" ) )
        .pipe( replace( /==\s(Unreleased|[0-9\s\.-]+)\s==/g, "= $1 =" ) )
        .pipe( replace( /#\s*[^\n]+/g, "== Description ==" ) )
        .pipe( gulp.dest( 'dist/' ) );

    done();
} ) );
