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
              Starting from root node, look for fully expanded node whose all possible children have
              been spawned and initialized. Choose the best of the children based on win/trials ratio
              With the best child continue the process until you hit unexpanded or partially expanded node.

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

         .... reward calculations are yet to be properly implemented
         ....  Expansion of tree heuristics yet to be understood   

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