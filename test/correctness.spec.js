describe( 'The Darwin algorithm', function() {
    var darwin,
        _ = require( 'mori' ),
        parameters = {
            'population': 10,
            'generations': 10,
            'generationGap': 0.5
        };

    beforeEach( function() {
        delete require.cache[ require.resolve( '../src/darwin' ) ];
        darwin = require( '../src/darwin' );
    });

    it( 'should create the correct amount of seeds', function() {
        var seed = jasmine.createSpy( 'seed' );

        darwin.seed( seed );
        darwin.fitness( _.identity );
        darwin.offspring( _.identity );
        darwin.run( parameters );
        
        expect( seed ).toHaveBeenCalled();
        expect( seed.calls.length ).toEqual( parameters.population );
        
    });

    it( 'should select the correct amount of genomes in every generation', function() {
        var select = jasmine.createSpy( 'select' );

        darwin.seed( _.identity );
        darwin.fitness( _.identity );
        darwin.offspring( _.identity );
        darwin.select( select );
        darwin.run( parameters );

        expect( select ).toHaveBeenCalled();
        expect( select.calls.length ).toEqual( parameters.generations * ( parameters.population * parameters.generationGap ) );
    });
    
});