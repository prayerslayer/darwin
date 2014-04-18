describe( 'The Darwin API', function() {

    var darwin;

    beforeEach( function() {
        delete require.cache[ require.resolve( '../src/darwin' ) ];
        darwin = require( '../src/darwin' );
    });

    it( 'should be defined', function() {
        expect( darwin ).toBeDefined();
    });

    it( 'should have a select function', function() {
        expect( darwin.select ).toBeDefined();
    });

    it( 'should have a seed function', function() {
        expect( darwin.seed ).toBeDefined();
    });

    it( 'should have a compare function', function() {
        expect( darwin.compare ).toBeDefined();
    });

    it( 'should have a run function', function() {
        expect( darwin.run ).toBeDefined();
    });

    it( 'should have a mutate function', function() {
        expect( darwin.mutate ).toBeDefined();
    });

    it( 'should have a fitness function', function() {
        expect( darwin.fitness ).toBeDefined();
    });

    it( 'should have an offspring function', function() {
        expect( darwin.offspring ).toBeDefined();
    });
});