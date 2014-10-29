// Settings
var GEN_POP = 9;  // size of each generation's population
var GEN_COUNT = 0;// begin generation counter at 0
var GOAL = [3,1,4,5,9,2,6,5,3,5]; // the goal, duh
var MAX_CHANCE_DEATHS = 10; // randomly killed off each generation
var MUTATE_CHANCE = .01 // Math.random() must be < to mutate
var MAX_GENS = 5000; // To cap off each run
var ELITE_COUNT = 1 // How many best-ranked indivs to potentially clone
var ELITE_CLONE_CHANCE = 1; // Chance of fittest indivs cloning to next gen
var SCORE_RECORD = [];
var CLONE_RECORD = [];
var MUTATION_RECORD = [];

//===========================================

evolve();

//===========================================

function evolve()
{
    var pop = [];
    initPop( pop );
    while( !isGoalReached( pop ) && GEN_COUNT < MAX_GENS )
    {
        pop = iterateGenerations( pop );
        GEN_COUNT++;
        MUTATION_RECORD[ GEN_COUNT ] = 0;
        CLONE_RECORD[ GEN_COUNT ] = 0;
    }
}


function initPop( pop ) 
{
    // For each individual
    for (var ii = 0; ii < GEN_POP; ii++)
    {
        // Push a new individual onto the population array
        pop.push( { genes: [], fitness: [], fitnessScore: 9999 } );
        
        // Loop through each gene of each individual
        for ( var jj = 0; jj < GOAL.length; jj++ ) // for each gene
        {
          // randomly generate the genes
          pop[ii].genes[jj] = Math.floor( Math.random() * 10 );
        }
        // Try uncommenting the following to see how giving a little help
        // changes the time to convergence
        pop[ii].genes[0] = 3;
        pop[ii].genes[1] = 1;
        pop[ii].genes[2] = 4;
        //pop[ii].genes[3] = 5;
        //pop[ii].genes[4] = 9;
    }// end for loop for initial generation
}


// Not currently used
function randomSmite( currentGenParam )
{
    var generationArray = currentGenParam;
    // Randomly kill off some of the population. Shit happens.
    for ( var i = 0; i < MAX_CHANCE_DEATHS; i++ )
    {
        // I smite thee
        generationArray[Math.random() * generationArray.length].pop();
    }
}


function iterateGenerations( currentGen )
{
    var total = 0;
    var nextGen = [];
    
    // for each individual in this generation
    for (var i = 0; i < currentGen.length; i++ )
    {        
        // for each gene
        for ( var j = 0; j < currentGen[i].genes.length; j++ )
        {
            // calculate fitness
            var temp = Math.abs( GOAL[j] - currentGen[i].genes[j] );
            currentGen[i].fitness[j] = temp;
            // sum fitness of all genes
            total =  total + currentGen[i].fitness[j];
        }
        // set fitnessScore from total
        currentGen[i].fitnessScore = total;       
        total = 0; // reset total
    }// end for each indiv
        
    // sort population by fitness        
    currentGen.sort( function( a, b ){
        return a.fitnessScore - b.fitnessScore;
    });
        

    // Record best fitness from generation for graph
    SCORE_RECORD.push(currentGen[0].fitnessScore);


    // CLONE
    // Clone elites to the next generation by chance
    for ( var ii = 0; ii < ELITE_COUNT; ii++ )
    {
        if ( Math.random() < ELITE_CLONE_CHANCE )
        {
            nextGen.push( currentGen[ ii ] );
            CLONE_RECORD[ GEN_COUNT ] += 1; // keep track of clones
        }
    } 


    // MATE
    // for each indiv, mate with random other
    for ( var jj = 0; jj < currentGen.length - ELITE_COUNT; jj++ )
    {
        // first parent is from the loop iterators position
        // second parent is randomly selected from the population
        var child = { genes:[], fitness: [], fitnessScore: 9999 };
        var firstParent = currentGen[ jj ];
        var secondParent = currentGen[ Math.floor(Math.random() * currentGen.length) ];
        var splitPoint = // The crossover position in genes array
            Math.floor( Math.random() * 
            firstParent.genes.length );
        // Child gets genes from before splitPoint on firstParent
        // and after splitPoint on secondParent
        child.genes = firstParent.genes.slice( 0, splitPoint )
            .concat( secondParent.genes.slice( splitPoint ) );
        mutate( child );
        nextGen.push( child ); // add child to next generation
    } // end for each indiv mating loop 
    return  nextGen;
}// end iterateGeneration


// See if any indivs have fitness == 0
function isGoalReached( paramCurrentGen )
{
    var i = 0; // iterator
    // see if any have reached the goal state
    for ( i = 0; i < paramCurrentGen.length; i++ )
    {
        if ( paramCurrentGen[i].fitnessScore > 0 ) { return false; }
        if ( paramCurrentGen[i].fitnessScore === 0 ) { return true; }
    }
}


// Accepts an object individual and 
// decides to mutate based on chance
function mutate( paramCurrentIndiv )
{
    // Mutation is by chance set at the top
    if ( Math.random() > MUTATE_CHANCE ) 
    {
        return;
    }
    MUTATION_RECORD[ GEN_COUNT ] += 1;
    // Randomly select gene and set to something betwee 0 and 9
    var geneIndex = Math.floor( 
        Math.random() * paramCurrentIndiv.genes.length );
    paramCurrentIndiv.genes[ geneIndex ] = Math.floor( Math.random() * 10 );
}
