describe( 'Darwin', function() {

    var darwin,
        noFn = [ 1, 2, 3 ],
        fakeFn = function fakeFn() {};

    beforeEach( function() {
        delete require.cache[ require.resolve( '../src/darwin' ) ];
        darwin = require( '../src/darwin' );
    });

    it( 'should not run without fitness function', function() {
        expect( darwin.run ).toThrow();
    });

    it( 'should not run without offspring function', function() {
        darwin.fitness( fakeFn );
        expect( darwin.run ).toThrow();
    });

    it( 'should not run without seeds', function() {
        darwin.fitness( fakeFn );
        darwin.offspring( fakeFn );
        expect( darwin.run ).toThrow();
    });

    it( 'should not accept non-functions', function() {
        darwin.seed( fakeFn );

        darwin.fitness( noFn );
        expect( darwin.run ).toThrow();

        darwin.fitness( fakeFn );
        darwin.offspring( noFn );
        expect( darwin.run ).toThrow();

        darwin.offspring( fakeFn );
        expect( darwin.run ).not.toThrow();
    });

    it( 'should accept non-functions only for seed()', function() {
        darwin.fitness( noFn );
        darwin.offspring( fakeFn );
        darwin.seed( noFn );
        expect( darwin.run ).toThrow();
        darwin.fitness( fakeFn );
        expect( darwin.run ).not.toThrow();
    });

});