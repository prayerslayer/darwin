describe( 'The Darwin algorithm', function() {
    var darwin,
        _ = require( 'mori' );

    beforeEach( function() {
        delete require.cache[ require.resolve( '../src/darwin' ) ];
        darwin = require( '../src/darwin' );
    });

    it( 'should create the right amount of seeds', function() {
        var seed = jasmine.createSpy( 'seed' );
        darwin.seed( seed );
        darwin.fitness( _.identity );
        darwin.offspring( _.identity );
        darwin.run({
            'population': 100
        });
        expect( seed ).toHaveBeenCalled();
        expect( seed.calls.length ).toEqual( 100 );
    });

    
});