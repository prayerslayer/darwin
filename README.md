# Darwin

A small framework for evolutionary algorithms in node.js.

Evolutionary algorithms are beneficial when the search space for your solution is way too big to be fully explored and you don't care about a perfect solution, one that's "good enough" will do.

These algorithms usually work the following way:

1. Start with an initial pool of genomes
2. Select a number of genomes
3. Make them have children
4. Kick the worst genomes out of the pool
5. Exit or go to step 2

## API

