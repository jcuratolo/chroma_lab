// Settings
var GEN_POP = 5000; // size of each generation's population
var GEN_COUNT = 0; // begin generation counter at 0
//var GOAL = [3,1,4,5,9,2,6,5,3,5]; // the goal, duh
var GOAL = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
var MAX_CHANCE_DEATHS = 10; // randomly killed off each generation
var MUTATE_CHANCE = .01 // Math.random() must be < to mutate
var MAX_GENS = 5000; // To cap off each run
var ELITE_COUNT = 50 // How many best-ranked indivs to potentially clone
var ELITE_CLONE_CHANCE = 1; // Chance of fittest indivs cloning to next gen
var SCORE_RECORD = [];
var ELITE_RECORD = [];
var CLONE_RECORD = [];
var MUTATION_RECORD = [];

//===========================================

evolve();

//===========================================

function evolve()
{
  var pop = [];
  initPop( pop );
  while ( !isGoalReached( pop ) && GEN_COUNT < MAX_GENS )
  {
    pop = iterateGenerations( pop );
    GEN_COUNT++;
    MUTATION_RECORD[ GEN_COUNT ] = 0;
    CLONE_RECORD[ GEN_COUNT ] = 0;
  }
  for ( var i = 0; i < SCORE_RECORD.length; i++ )
  {
    document.getElementById( "candidates" ).innerHTML += "<li>" + ELITE_RECORD[ i ].join( "" ) + "</li>";
  }
}

function evolveNoLoop( paramCurrentGen )
{

}



function initPop( pop )
{
  // For each individual
  for ( var ii = 0; ii < GEN_POP; ii++ )
  {
    // Push a new individual onto the population array
    pop.push(
    {
      genes: [],
      fitness: [],
      fitnessScore: 9999
    } );

    // Loop through each gene of each individual
    for ( var jj = 0; jj < GOAL.length; jj++ ) // for each gene
    {
      // randomly generate the genes
      pop[ ii ].genes[ jj ] = Math.floor( Math.random() * 10 );
    }
    // Try uncommenting the following to see how giving a little help
    // changes the time to convergence
    //pop[ ii ].genes[ 0 ] = 0;
    //pop[ ii ].genes[ 1 ] = 0;
    //pop[ii].genes[2] = 4;
    //pop[ii].genes[3] = 5;
    //pop[ii].genes[4] = 9;
  } // end for loop for initial generation
}


// Not currently used
function randomSmite( currentGenParam )
{
  var generationArray = currentGenParam;
  // Randomly kill off some of the population. Shit happens.
  for ( var i = 0; i < MAX_CHANCE_DEATHS; i++ )
  {
    // I smite thee
    generationArray[ Math.random() * generationArray.length ].pop();
  }
}

function calcFitness( paramCurrentGen )
{
  var total = 0;
  // for each individual in this generation
  for ( var i = 0; i < paramCurrentGen.length; i++ )
  {
    // for each gene
    for ( var j = 0; j < paramCurrentGen[ i ].genes.length; j++ )
    {
      // calculate fitness
      var temp = Math.abs( GOAL[ j ] - paramCurrentGen[ i ].genes[ j ] );
      paramCurrentGen[ i ].fitness[ j ] = temp;
      // sum fitness of all genes
      total = total + paramCurrentGen[ i ].fitness[ j ];
    }
    // set fitnessScore from total
    paramCurrentGen[ i ].fitnessScore = total;
    total = 0; // reset total
  } // end for each indiv
}


// Place the fittest indivs at the beginning of
// paramCurrentGen
function sortGenByFitness( paramCurrentGen )
{
  paramCurrentGen.sort( function( a, b )
  {
    return a.fitnessScore - b.fitnessScore;
  } );
}


// Update records for reporting date later
function updateRecords( paramCurrentGen )
{
  SCORE_RECORD.push( paramCurrentGen[ 0 ].fitnessScore );
  ELITE_RECORD.push( paramCurrentGen[ 0 ].genes );
}


// Copy fittest indivs to next gen according to settings
function cloneElitesToNextGen( paramCurrentGen, paramNextGen )
{
  // Clone elites to the next generation
  for ( var i = 0; i < ELITE_COUNT; i++ )
  {
    if ( Math.random() < ELITE_CLONE_CHANCE )
    {
      paramNextGen.push( paramCurrentGen[ i ] );
      CLONE_RECORD[ GEN_COUNT ] += 1; // keep track of clones
    }
  }
}


function mate( paramCurrentGen, paramNextGen )
{
  // for each indiv, mate with random other
  for ( var jj = 0; jj < paramCurrentGen.length - ELITE_COUNT; jj++ )
  {
    // first parent is from the loop iterators position
    // second parent is randomly selected from the population
    var child = {
      genes: [],
      fitness: [],
      fitnessScore: 9999
    };
    var firstParent = paramCurrentGen[ jj ];
    var secondParent = paramCurrentGen[ Math.floor( Math.random() *
      paramCurrentGen.length ) ];
    var splitPoint = // The crossover position in genes array
      Math.floor( Math.random() *
        firstParent.genes.length );
    // Child gets genes from before splitPoint on firstParent
    // and after splitPoint on secondParent
    child.genes = firstParent.genes.slice( 0, splitPoint )
      .concat( secondParent.genes.slice( splitPoint ) );
    mutate( child );
    paramNextGen.push( child ); // add child to next generation
  } // end for each indiv mating loop 
}


function iterateGenerations( paramCurrentGen )
{
  var nextGen = [];

  calcFitness( paramCurrentGen );
  sortGenByFitness( paramCurrentGen );
  updateRecords( paramCurrentGen );
  cloneElitesToNextGen( paramCurrentGen, nextGen );
  mate( paramCurrentGen, nextGen );

  return nextGen;
} // end iterateGeneration


// See if any indivs have fitness == 0
function isGoalReached( paramCurrentGen )
{
  var i = 0; // iterator
  // see if any have reached the goal state
  for ( i = 0; i < paramCurrentGen.length; i++ )
  {
    if ( paramCurrentGen[ i ].fitnessScore > 0 )
    {
      return false;
    }
    if ( paramCurrentGen[ i ].fitnessScore === 0 )
    {
      return true;
    }
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