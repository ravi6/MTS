# MTS
Tic Tac Toe 
   Author: Ravi Sankar Saripalli
   Date: 26th November
   Version: 0.1

   Last Modified  13th December

### Change Log:
 * 28th Nov. Completed node class structure and node exploration function "addNode"
 * 29th Nov. Added method to board class to enable game evaluation (WIN/DRAW)
 * 03 Dec.   Totally revamped the code to enable state tracking of nodes with board class
            Got stuck with issue related to deep cloning of objects (the board object)
            Deep cloning of generic object is not trivial, but simple vectors or sets whose members
            are of simple type (eg. numbers, or strings) can be easily cloned.
            
            ## The MonteCarlo Tree Search in my own words
             
            ### Selection
              Starting from root node,
              if fully expanded node (all possible children have been spawned and initialized) 
              Choose the best of the child nodes based on win/trials ratio and repeat selection process 
              until anode with potential child nodes yet to be discovered is found.
              
            ### Epansion 
               Spawn off a new child node from the previously found partially expanded node
               if it is not a terminal node (node that can't have children).  
             
            ### Simulation
               play a random game from the freshly spawned child node until a terminal node is reached. 
               (ie. game is drawn or over) (Note:) During this phase no new nodes are created but
               visited in a volatile space.

            ### Propagation
               With the end result of the game at hand, propagate the information up the tree from the newly 
               spawned node till we reach the root re-enforcing the desired behaviour.

           ### Note:  Biasing "selection" criterion towards less used but discovered children 
              The selection criterion (win/trial ratio)  can be furher
              refined (UTC) add bias towards children who are less visted. This is done by augmenting the win/trial ratio
              with a function that adds bias based on the ratio of current node trials to the parent node trials.
              That function is Alpha*sqrt( ln(Np) / Ni ). where Np and Ni are parent and child node trial counts respectively.
              Alpha is an empirical constant. When Np is very large relative to Ni and Alpha is not zero the bias increases to allow
              selection of neglected child. But when the are of similar magnitude the correction becomes relatively small. (We assume
              Alpaha is of the order of 1. (It has been suggested that Alpha is theoretically 1.4. Rationale is not yet explored. 
        
              Repeat the process.  Simulation and propagation loop can be nested in the overall loop.

  * 12 Dec.  Overall algorithm implemented. Few tests with random light play
            were made. UTC component that allows tree exploration based on 
            some ratio of total visits to the parent node to the child node 
            is now in place. f*sqrt(ln(Np) / Nc) is added to the (Nwins/Nc)
            If both players choose to play random, the best path

  * 13 Dec.  GUI to display board state in animated way is finished.
            Game play with learnt behaviour against a random opponent is yet to 
            be coded. I though I had that with bestChildren chain. But that appears
            incorrect, because opponent play should be random but should not be 
            based on what is best for you :((
 
 * 17 Dec.  Implemented learntPlay, where 'o' player makes use of the learnt behaviour whenever he can,
            the opponent always plays random. (misses even obvious wins/losses). If the opponent makes a move
            that pushes the game into unexplored tree, even the 'o' player has no other go but to play random.
            All of this logic is implemented. GUI elements to examine statistics of such a game is added.
            Considering several sets of game plays, statstics of the outcome is extracted based on the sets of the games
            100 sets of 100 games each. (say).  Because JavaScript is single thread execution, for gui to work properly
            heavy cpu functions need to be split into smaller chunks with recourse to "setTimeout" calls and recursive functions.

 * 28 Dec.  Completed adding plottinig functionality to evaluate MTS performance
            At this stage there appears not so significant performance when UTC
            factor or expansion phase counts increases. This is a little surprising.
            Has this any bearing to the fact that I favour the first discovered child
            with highest score. (ie. ideally when many candidates with a tie some randomness
            need to be used to pick the winner).
            A big lesson, they are always passed by reference. Be very careful
            especially when you are using Timeout calls with objects passed assume
            as parameters. Have to make special effort if you want the state
            of the passed object not changed between Timeout calls.


* 29 Dec.   Well expansion factor does indeed effect the nodes discovered, you have
            to make it larger than 1.4 to see the dramatic effect. Also, realized 
            in order for the tree to expand, one need to make simulations only then
            you can get the selection process
