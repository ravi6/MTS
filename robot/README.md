# DMCTS-Test bed

## Background
    This part of the repo contains code to understand the DMCTS algorithm 
with single threaded Javascript engine. The empahsis is more on 
getting all the algorithmic component of each agent correct. True parallel 
execution of each agent is not possible.

## Description of the task
Several agents can move about on a predifined grid in two dimensional
space. The movement of the agent is restricted to only x and y directions
and each move is confined to one grid space. The domain consists of arbitraily
placed walls (lines in cartesian space) and these restric agent moves.
Also, some nodes of the grid have treasure for each agent to collect when they
move into those positions. The task is to allow agents to seek best path that
maximizes total bounty collected by all of the agents. The number of moves 
an agent can make is limited (cost function). While the code can handle any 
mumber of agents, for now we will explore the problem with two agents.

## Development Log

# 12th July 2019

      - Completed full implementation of DMCTS and visulization of results.
Discounting of rollout score with age is not implemented yet. Explorations so 
far indicate that

* All runs show that action sequences have about 20% of revisits in the
their move sequence by each agent.

* With beta value decreasing from 1 to .001 over 100 iterations, the 
probability associated with 10 sampled action sequences of each agent tend
to oscillate but seem to monotonically increase in a stright line from first
sequence to the last sequence. This to me does not make sense.

