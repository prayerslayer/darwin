var darwin = require( '../src/darwin' );

darwin.seed( function( index ) {
    return parseInt( Math.random() * 10 * index, 10 );
});

darwin.fitness( function( genome ) {
    if ( genome === 0 )
        return Infinity; // not defined for zero
    return Math.abs( 50 - genome );
});

darwin.compare( darwin.lowerBetter );

darwin.offspring( function( a, b, r ) {
    // we have 7 binary digits
    var split = parseInt( ( r || Math.random() ) * 6, 10 ),
        left = '',
        right = '';

    a = a & 127;
    b = b & 127;

    for( var i = 0; i < 7; i++ ) {
        if ( i < split ) {
            left += '1';
            right += '0';
        } else {
            left += '0';
            right += '1';
        }
    }
    left = parseInt( left, 2 );
    right = parseInt( right, 2 );

    return (a & left) | (b & right);
});

var solution = darwin.run({
    population: 10,
    generations: 10,
    generationGap: 0.2,
    crossoverProbability: .5,
    outputLog: true
});

console.log( 'Solution', solution );