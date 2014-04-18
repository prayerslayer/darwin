var m = require( 'mori' );

var params,
    makeSeedFn,
    initialSeeds,
    mutateFn,
    makeBabyFn,
    compareFn,
    fitnessFn,
    selectFn;

function log() {
    if ( params.outputLog ) {
        console.log.apply( console, arguments );
    }
}

function normalize( max ) {
    return function( value ) {
        return value / max;
    };
}

function smallerThan( val ) {
    return function( a ) {
        return a < val;
    };
}

function findMaximum( acc, next ) {
    return next > acc ? next : acc;
}

function crossover( parents ) {
    var parentA = m.first( parents ),
        parentB = m.last( parents ),
        offspringA = Math.random() < params.crossoverProbability ? makeBabyFn( parentA, parentB ) : parentA,
        offspringB = Math.random() < params.crossoverProbability ? makeBabyFn( parentB, parentA ) : parentB;
    return m.vector( offspringA, offspringB );
}

function mutate( child ) {
    if ( Math.random() < params.mutationProbability ) {
        return mutateFn( child );
    }
    return child;
}

// default compare function
compareFn = function compare( fitnessA, fitnessB ) {
    return fitnessA - fitnessB;
};

// default select function
selectFn = function select( genomes ) {
    // normalize based on fitness, sort, take random number, first >= random number wins
    var fitties = m.map( fitnessFn, genomes ),
        max = m.reduce( findMaximum, 0, fitties ),
        unit = normalize( max ),
        kill = smallerThan( Math.random() ),
        chosens = m.drop_while( m.comp( kill, unit, fitnessFn ), genomes ),
        neo = m.first( chosens );

    return neo;
};

// mutate defaults to identity function
// i.e. there is no mutation
mutateFn = m.identity;

exports.fitness = function( fit ) {
    if ( !fit ) return;
    if ( typeof fit !== 'function' ) return;
    fitnessFn = fit;
};

exports.select = function( userSelect ) {
    if ( !userSelect ) return;
    if ( typeof userSelect !== 'function' ) return;
    selectFn = userSelect;
};

exports.compare = function( userCompare ) {
    if ( !userCompare ) return;
    if ( typeof userCompare !== 'function' ) return;
    compareFn = userCompare;
}

exports.offspring = function( userOffspring ) {
    if ( !userOffspring ) return;
    if ( typeof userOffspring !== 'function' ) return;
    makeBabyFn = userOffspring;
};

exports.mutate = function( userMutate ) {
    if ( !userMutate ) return;
    if ( typeof userMutate !== 'function' ) return;
    mutateFn = userMutate;
};

exports.seed = function( seeds ) {
    // seeds may either be a function to create one or an array of seeds to use
    if ( !seeds ) return;

    if ( typeof seeds === 'function' ) {
        makeSeedFn = seeds;
    }
    if ( typeof seeds === 'object' && seeds.length ) {
        initialSeeds = m.seq( seeds );
    }
};

exports.run = function( config ) {

    // check prerequisites
    if ( !fitnessFn )
        throw new Error( 'You must specify a fitness function.' );
    if ( !makeBabyFn )
        throw new Error( 'You must specify an offspring function.' );

    if ( !config ) {
        config = {
            'crossoverProbability': 0.3,
            'mutationProbability': 0.001, // not yet used
            'population': 100,
            'generations': 10,
            'killWeak': true,
            'outputLog': false,
            'generationGap': 0.1 // replace 10% of population in every generation
        };
    } else {
        config.crossoverProbability = config.crossoverProbability || 0.3;
        config.mutationProbability = config.mutationProbability || 0.001;
        config.population = config.population || 100;
        config.generations = config.generations || 10;
        config.killWeak = config.killWeak || true;
        config.outputLog = config.outputLog || false;
        config.generationGap = config.generationGap || 0.1;
    }
    var population;
    params = config;

    // seed initial population
    // if there are no seeds set, we generate them
    if ( !initialSeeds ) {
        // check if there is a function to create a seed
        if ( !makeSeedFn ) {
            throw new Error( 'You must specify seeds or a function to create one.' );
        }
        // seed
        population = m.map( makeSeedFn, m.range( config.population ) );
    } else {
        population = initialSeeds;
    }

    // run algo
    var start = Date.now(),
        births,
        chosenOnes = m.vector(),
        parents,
        offsprings;

    m.each( m.range( config.generations ), function( i ) {
        log( 'Current generation is ', i, ' with population ', m.count( population ) );
        // calculate how many children we need
        births = m.count( population ) * config.generationGap;
        // select 10 % of population to have children
        m.empty( chosenOnes );
        m.each( m.range( births ), function() {
            log( 'Selecting...' );
            chosenOnes = m.conj( chosenOnes, selectFn( population ) );
        });
        log( 'Pairing...' );
        // make babies
        parents = m.partition( 2, chosenOnes );                                  // group them in 2
        log( 'Reproducing...' );
        offsprings = m.map( crossover, parents );                                // make 2 babies
        offsprings = m.map( mutate, offsprings );                              // mutate babies
        population = m.into( population, m.mapcat( m.identity, offsprings ) );   // unfold babies in population
        if ( config.killWeak ) {
            log( 'KILLING SPREEE' );
            // kill worst 10 % of population
            population = m.take( config.population, m.reverse( m.sort_by( fitnessFn, compareFn, population ) ) );
        }
    });

    var end = Date.now();
    log( 'Simulation ran for', end - start, 'ms.' );
    return m.first( m.sort_by( fitnessFn, compareFn, population ) );
};