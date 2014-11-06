var chromaLab = ( function()
{
  // Settings
  var GEN_POP = 12; // size of each generation's population
  var GEN_COUNT = 0; // begin generation counter at 0
  var GENE_COUNT = 9; // how many genes each indiv has
  var GOAL = {};
  var MUTATE_CHANCE = 1 // Math.random() must be < to mutate
  var MAX_GENS = 5000; // To cap off each run
  var ELITE_COUNT = .5 // How many best-ranked indivs to potentially clone
  var ELITE_CLONE_CHANCE = 1; // Chance of fittest indivs cloning to next gen
  var SCORE_RECORD = []; // these hold statistics for graphing
  var ELITE_RECORD = [];
  var CLONE_RECORD = [];
  var MUTATION_RECORD = [];
  var MATE_MODES = {
    arithmeticMean: function( a, b )
    {
      console.log( "a mean" );
      return Math.floor( ( a + b ) / 2 );
    },
    geometricMean: function( a, b )
    {
      console.log( "g mean" );
      return Math.floor( Math.sqrt( a * b, .5 ) );
    },
    quadraticMean: function( a, b )
    {
      console.log( "q mean" );
      return Math.floor( Math.sqrt( ( a * a + b * b ) / 2 ) );
    }
  };
  // Default way of producing children
  var MATE_MODE_SELECTION = "arithmeticMean";

  var pop = [];
  initPop( pop );
  //===========================================

  evolve();

  //===========================================

  function evolve()
  {
    pop = iterateGenerations( pop );
    writeGen( pop );
  }


  function writeGen( paramCurrentGen )
  {
    // For each indiv
    for ( var i = 0; i < GEN_POP; i++ )
    {
      document.getElementById( i ).style.background = getBG( paramCurrentGen[ i ] );
      document.getElementById( i ).childNodes[ 1 ].style.color = getTitle( paramCurrentGen[ i ] );
      document.getElementById( i ).childNodes[ 3 ].style.color = getText( paramCurrentGen[ i ] );
    }

    // output elite swatch
    var eliteSample = document.getElementsByClassName( "elite" )[ 0 ];
    eliteSample.style.background = getBG( paramCurrentGen[ 0 ] );
    eliteSample.childNodes[ 1 ].style.color = getTitle( paramCurrentGen[ 0 ] );
    eliteSample.childNodes[ 3 ].style.color = getText( paramCurrentGen[ 0 ] );

    var eliteCSSReadout = document.getElementsByClassName( "elite_css_readout" )[ 0 ];
    eliteCSSReadout.innerHTML = "background: " + getBG( paramCurrentGen[ 0 ] ) + ";";
    eliteCSSReadout.innerHTML += "</br>";
    eliteCSSReadout.innerHTML += "h1 { color: " + getTitle( paramCurrentGen[ 0 ] ) + "; }";
    eliteCSSReadout.innerHTML += "</br>";
    eliteCSSReadout.innerHTML += "p { color: " + getText( paramCurrentGen[ 0 ] ) + "; }";
    eliteCSSReadout.style.background = "black";

  }


  function getBG( paramCurrentIndiv )
  {
    return "rgb(" + paramCurrentIndiv.genes[ 0 ] + "," + paramCurrentIndiv.genes[ 1 ] + "," + paramCurrentIndiv.genes[ 2 ] + ")";
  }

  function getTitle( paramCurrentIndiv )
  {
    return "rgb(" + paramCurrentIndiv.genes[ 3 ] + "," + paramCurrentIndiv.genes[ 4 ] + "," + paramCurrentIndiv.genes[ 5 ] + ")";
  }

  function getText( paramCurrentIndiv )
  {
    return "rgb(" + paramCurrentIndiv.genes[ 6 ] + "," + paramCurrentIndiv.genes[ 7 ] + "," + paramCurrentIndiv.genes[ 8 ] + ")";
  }


  function initPop( paramCurrentGen )
  {
    // For each individual
    for ( var ii = 0; ii < GEN_POP; ii++ )
    {
      // Push a new individual onto the population array
      paramCurrentGen.push(
      {
        genes: [],
        fitness: [],
        fitnessScore: 5000
      } );

      // Loop through each gene of each individual
      for ( var jj = 0; jj < GENE_COUNT; jj++ ) // for each gene
      {
        // randomly generate the genes
        paramCurrentGen[ ii ].genes[ jj ] = Math.floor( Math.random() * 256 );
      }
      // Try uncommenting the following to see how giving a little help
      // changes the time to convergence
      //paramCurrentGen[ ii ].genes[ 0 ] = 0;
      //paramCurrentGen[ ii ].genes[ 1 ] = 0;
      //paramCurrentGen[ii].genes[2] = 4;
      //paramCurrentGen[ii].genes[3] = 5;
      //paramCurrentGen[ii].genes[4] = 9;
    } // end for loop for initial generation
    GOAL = paramCurrentGen[ 0 ]; // just to have something to begin with
  } // End intiPop()


  function calcFitness( paramCurrentGen )
  {
    // The fittest individual becomes the goal
    var total = 0;
    // for each individual in this generation
    for ( var i = 0; i < paramCurrentGen.length; i++ )
    {
      paramCurrentGen[ i ].fitnessScore = cosineSimilarity( paramCurrentGen[ i ].genes, GOAL.genes )
      //console.log( i, " ", paramCurrentGen[ i ].fitnessScore );
      // for each gene
      // for ( var j = 0; j < paramCurrentGen[ i ].genes.length; j++ )
      // {
      //   // calculate fitness
      //   var temp = Math.abs( GOAL.genes[ j ] - paramCurrentGen[ i ].genes[ j ] );
      //   paramCurrentGen[ i ].fitness[ j ] = temp;
      //   // sum fitness of all genes
      //   total = total + paramCurrentGen[ i ].fitness[ j ];
      // }
      // // set fitnessScore from total
      // paramCurrentGen[ i ].fitnessScore = total + 1;
      // total = 0; // reset total
    } // end for each indiv
  }


  function dotProduct( vecA, vecB )
  {
    var product = 0;
    for ( var i = 0; i < vecA.length; i++ )
    {
      product += vecA[ i ] * vecB[ i ];
    }
    return product;
  }


  function magnitude( vec )
  {
    var sum = 0;
    for ( var i = 0; i < vec.length; i++ )
    {
      sum += vec[ i ] * vec[ i ];
    }
    return Math.sqrt( sum );
  }


  function cosineSimilarity( vecA, vecB )
  {
    return dotProduct( vecA, vecB ) / ( magnitude( vecA ) * magnitude( vecB ) );
  }


  // Place the fittest indivs at the beginning of
  // paramCurrentGen
  function sortGenByFitness( paramCurrentGen )
  {
    paramCurrentGen.sort( function( a, b )
    {
      return b.fitnessScore - a.fitnessScore;
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
    // After sorting by fitnessScore, everything < ELITE_COUNT
    // is considered an elite
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
      // child is produced by averaging between the two
      var child = {
        genes: [],
        fitness: [],
        fitnessScore: 5000
      };
      var firstParent = paramCurrentGen[ jj ];
      var secondParent = paramCurrentGen[ Math.floor( Math.random() *
        paramCurrentGen.length ) ];
      var firstParentWeight = Math.random();

      // for each gene of each individual
      for ( var k = 0; k < paramCurrentGen[ jj ].genes.length; k++ )
      {
        child.genes[ k ] = MATE_MODES[ MATE_MODE_SELECTION ]( firstParent.genes[ k ], secondParent.genes[ k ] );


        // Child's gene is the arithmetic mean of the two parents
        /*child.genes[ k ] =
                Math.floor(
                  Math.pow(
                    firstParent.genes[ k ] *
                    secondParent.genes[ k ], .5 ) );
              */
        // Average
        //child.genes[ k ] = Math.floor( ( firstParent.genes[ k ] + secondParent.genes[ k ] ) / 2 );

        // Multiply
        //child.genes[ k ] = Math.floor( firstParent.genes[ k ] * secondParent.genes[ k ] / 255 );

        // Screen
        //child.genes[ k ] = Math.floor( 255 - ( ( 255 - firstParent.genes[ k ] ) * ( 255 - secondParent.genes[ k ] ) ) );

        // Addition
        //firstParent.genes[ k ] + secondParent.genes[ k ] > 255 ? child.genes[ k ] = 255 : child.genes[ k ] = firstParent.genes[ k ] + secondParent.genes[ k ];

        // Lighten
        //firstParent.genes[ k ] > secondParent.genes[ k ] ? child.genes[ k ] = firstParent.genes[ k ] : child.genes[ k ] = secondParent.genes[ k ];

        // Darken
        //firstParent.genes[ k ] < secondParent.genes[ k ] ? child.genes[ k ] = firstParent.genes[ k ] : child.genes[ k ] = secondParent.genes[ k ];
      }
      mutate( child );
      // add child to next generation 
      paramNextGen.push( child );
      sortGenByFitness( paramNextGen );
      calcFitness( paramNextGen );
      //console.log( paramNextGen );
    } // end for each indiv mating loop 
  }


  function iterateGenerations( paramCurrentGen )
  {
    var nextGen = [];
    //updateRecords( paramCurrentGen );
    // Calc and sort to find out who elites are in light of
    // the user's new selection
    calcFitness( paramCurrentGen );
    sortGenByFitness( paramCurrentGen );
    cloneElitesToNextGen( paramCurrentGen, nextGen );
    //creat children to fill the next generation
    mate( paramCurrentGen, nextGen );
    // sort by fitness for display
    calcFitness( nextGen );
    sortGenByFitness( nextGen );
    return nextGen;
  } // end iterateGeneration


  // Accepts an object individual and 
  // decides to mutate based on chance
  // Proposed mutation classes:
  //    cosmic ray
  //    inversion
  //    multiply
  //    screen
  function mutate( paramCurrentIndiv )
  {
    // Mutation is by chance set at the top
    if ( Math.random() > MUTATE_CHANCE )
    {
      return;
    }
    MUTATION_RECORD[ GEN_COUNT ] += 1;
    // Randomly select gene and set to something betwee 0 and 255
    var geneIndex = Math.floor(
      Math.random() * paramCurrentIndiv.genes.length );
    paramCurrentIndiv.genes[ geneIndex ] = Math.floor( Math.random() * 256 );
  }

  function setMATE_MODE_SELECTION( paramNewMode )
  {
    MATE_MODE_SELECTION = paramNewMode;
  }

  function getMode()
  {
    //console.log( "getMode()" );
    return MATE_MODE_SELECTION;
  }

  // expose returned keys to outside
  return {
    improveFitness: function( paramCurrentIndiv )
    {
      //paramCurrentIndiv.fitnessScore = 0;
      //console.log( "improved fitness!" );
      GOAL = paramCurrentIndiv;
      evolve();
    },
    pop: function()
    {
      return pop;
    },
    reset: function()
    {
      initPop( pop );
      writeGen( pop );
      console.log( "refreshed" );
    },
    setMode: function( param )
    {
      setMATE_MODE_SELECTION( param );
      console.log( "set mode to", getMode() );
    },
    getMode: function()
    {
      getMode();
      console.log( "which get mode?" );
    }
  }; // END RETURN
} )(); // IIFE