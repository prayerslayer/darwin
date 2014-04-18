describe( 'The Darwin algorithm', function() {
    var darwin,
        _ = require( 'mori' );

    beforeEach( function() {
        delete require.cache[ require.resolve( '../src/darwin' ) ];
        darwin = require( '../src/darwin' );
    });

    afterEach( function() {
        darwin = null;
    });

    it( 'should binary-tournament-select correctly', function() {
        var genomes = [ 4, 0, 3, 2 ],    // 0, 2, 3, 4
            select = darwin.binaryTournament;

        darwin.fitness( _.identity );

        var selection = select( 4, genomes, 0.5, 0.00004 );
        expect( _.count( selection ) ).toBe( 1 );
        expect( _.nth( selection, 0 ) ).toBe( 0 );

        selection = select( 4, genomes, 0.5, 0.2 );
        expect( _.nth( selection, 0 ) ).toBe( 3 );
    });

    it( 'should elitist-select correctly', function() {
        var genomes = [ 4, 0, 3, 2 ],    // 1, 2, 3, 4
            select = darwin.elitist;

        darwin.fitness( _.identity );

        var selectOne = select( 1, genomes ),
            selectTwo =  select( 2, genomes ),
            selectThree= select( 3, genomes ),
            selectFour = select( 4, genomes );

        expect( _.first( selectOne ) ).toBe( 4 );

        expect( _.count( selectTwo ) ).toBe( 2 );
        expect( _.first( selectTwo ) ).toBe( 4 );
        expect( _.nth( selectTwo, 1 ) ).toBe( 3 );

        expect( _.count( selectThree ) ).toBe( 3 );
        expect( _.nth( selectThree, 0 ) ).toBe( 4 );
        expect( _.nth( selectThree, 1 ) ).toBe( 3 );
        expect( _.nth( selectThree, 2 ) ).toBe( 2 );

        expect( _.count( selectFour ) ).toBe( 4 );
        expect( _.nth( selectFour, 0 ) ).toBe( 4 );
        expect( _.nth( selectFour, 1 ) ).toBe( 3 );
        expect( _.nth( selectFour, 2 ) ).toBe( 2 );
        expect( _.nth( selectFour, 3 ) ).toBe( 0 );

    });

    it( 'should elitist-select correctly with lowerBetter fitness', function() {
        var genomes = [ 4, 0, 3, 2 ],    // 1, 2, 3, 4
            select = darwin.elitist;

        darwin.fitness( _.identity );
        darwin.compare( darwin.lowerBetter );

        var selectOne = select( 1, genomes ),
            selectTwo =  select( 2, genomes ),
            selectThree= select( 3, genomes ),
            selectFour = select( 4, genomes );

        expect( _.first( selectOne ) ).toBe( 0 );

        expect( _.count( selectTwo ) ).toBe( 2 );
        expect( _.first( selectTwo ) ).toBe( 0 );
        expect( _.nth( selectTwo, 1 ) ).toBe( 2 );

        expect( _.count( selectThree ) ).toBe( 3 );
        expect( _.nth( selectThree, 0 ) ).toBe( 0 );
        expect( _.nth( selectThree, 1 ) ).toBe( 2 );
        expect( _.nth( selectThree, 2 ) ).toBe( 3 );

        expect( _.count( selectFour ) ).toBe( 4 );
        expect( _.nth( selectFour, 0 ) ).toBe( 0 );
        expect( _.nth( selectFour, 1 ) ).toBe( 2 );
        expect( _.nth( selectFour, 2 ) ).toBe( 3 );
        expect( _.nth( selectFour, 3 ) ).toBe( 4 );
    });
    
});