# Darwin

A small framework for evolutionary algorithms in node.js.

Evolutionary algorithms are beneficial when the search space for your solution is way too big to be fully explored and you don't care about a perfect solution, one that's "good enough" will do.

These algorithms usually work the following way:

1. Start with an initial pool of genomes ("seed")
2. Select a number of genomes ("select")
3. Make them have children ("offspring")
4. Kick the worst genomes out of the pool (according to "fitness")
5. Exit or go to step 2

## Mandatory API / Example

Say we want to know a number closest to 50. This is of course not the kind of problem you would use evolutionary algos for, but this way it's easier to get how they work.

Throughout the examples I will presume that you ``require``d Darwin like this:

    var darwin = require( 'darwin' );

### seed()

First we create our initial pool of possible solutions (genomes).

With ``seed()`` we either

1. set the seed population Darwin should start with or
2. tell Darwin how to create seeds.

For 1. just put an array in, just like

    darwin.seed([ 10, 20, 30, 40, 60, 70, 80, 90 ]);

For 2. you could pass a function like this

    darwin.seed( function( index ) {
        return parseInt( Math.random() * 10 * index, 10 );
    });

We will use the second one here to generate a seed population of 10 genomes, thus between 0 and 90.

### fitness()

Darwin needs to assess genomes (or solutions). That's what the ``fitness`` function is for. In our example it would look like this:

    darwin.fitness( function( genome ) {
        if ( genome === 0 )
            return Infinity; // not defined for zero
        return Math.abs( 50 - genome );
    });

The fitness ("goodness") of a solution is its distance to 50, where we need to exclude the case of zero. Because Darwin assumes higher fitness is better, we have to tell him otherwise:

### compare()

Darwin assumes higher fitness means better, we want to change that like so:

    darwin.compare( darwin.lowerBetter );

### offspring()

Darwin will know select genomes based on their fitness (see below) and force them to have sex. We need to tell Darwin though how chromosomes are spread from the parents to a child. This part is totally up to you to implement, there are some [common strategies](http://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)) though.

We will use the one-point crossover here. As our numbers are below 100 we can look at them as strings of 7 bit. We take a random split point and give our children the bits left from parent A and right from parent B.


    // i: 0123456
    // ----------
    // A: 0011001
    // B: 0000110
    //       |
    // C: 0010110
    darwin.offspring( function( a, b ) {
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

### run() / Parameters

Neat! That's all we need. We can start the simulation with ``darwin.run()`` now, although we would want to pass some parameters to it:

* crossoverProbability (0..1): Probability that chromosomes from parents are mixed in their child. Defaults to 0.3.
* mutationProbability (0..1): Probability that a chromosome of a child mutates. Defaults to 0.001.
* population (>0): Size of the gene pool. Defaults to 100.
* generations (>0): How many generations the genes should run through. Defaults to 10.
* killWeak (true|false): If the worst part of the generation should be killed. Defaults to true.
* generationGap (0..1): Which percentage of the population should be selected for reproduction or killed. Defaults to 0.1 (10%).
* outputLog (true|false): If Darwin should output some logs.

    darwin.run({
        population: 10,
        generations: 1000,
        outputLog: true
    });



## Optional API methods

### mutate()

Not yet implemented thoroughly.

### select()

In every generation a subset of the population is selected to make babies. By default Darwin uses elitist selection, e.g. it takes the most fit genomes.

To use a different selection method, pass in a function that takes an array and returns an item of the array.

    darwin.select( function( population ) {
        return population[0]; // always use the same genome o.O
    });