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
              Choose the best of the children based on win/trials ratio and repeat selection process until           
              until an unexpanded or partially expanded node.  (more on selection criterion in footnote)
              
            ### Epansion 
               First spawn off a new child node from the previously found partiallly expanded node. 
               If it is not terminal node (node that can't have children).  
             
            ### Simulation
               play a random game from the freshly spawned child state
               until game is drawn or over. (Note:) During this phase no new nodes are created but
               visited in a volatile space.

            ### Propagation
               With the end result of the game at hand, propagate the information up the tree till we reach the root
               re-enforcing the desired behaviour.

        
         Repeat enough times until some convergence ...

     Biasing Selection criterion towards less used children (discovered)
         The selection criterion (win/trial ratio)  can be furher
              refined (UTC) add bias towards children who are less visted. This is done by augmenting the win/trial ratio
              with a function that adds bias based on the ratio of current node trials to the parent node trials.


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

 
