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

### 12th July 2019

Completed full implementation of DMCTS and visulization of results.
Discounting of rollout score with age is not implemented yet.
Using the following parameter
* move budget for each robot = 40
* treasure at each location  = 1
* beta range = ( 1, 0.001)  reduced in  100 iterations
* alpha = 0.1 (Newton step lag)
* starting positions Cat (0,0), Dog(0,10)

Explorations so far indicate that

* All runs show that action sequences have about 20% to 50% revisits in 
their move sequence by each agent.

* With beta value decreasing from 1 to .001 over 100 iterations, the 
probability associated with 10 sampled action sequences of each agent tend
to oscillate but seem to monotonically increase in a stright line from first
sequence to the last sequence. This to me does not make sense.

### 18th July 2019
* Well now I have more explorations beta low value upt 0.0001 was explore.
Also, beta variation shape with S shaped curve with varying degrees of slope
was also considered. In addition noted that sampling from pdf is not as trivial
as I first imagined. Looks like when you have discrete probability distribution,
one needs to generate cumulative table and then use a random number from 0 to 1 to
select the sequence from the pdf. Anyway three different schemes just RANDOM, QMAX
and SAMPLE (proper one) were explored. 

* For some combination I was getting high peaks with just one pushing close 0.98
but now I can't reproduce it. Perhaps that was with fewer iteration count (800).
Need to re-examine. Overall the picture is still confusing. But what is encouraging is
all sequences in the pdf tables produce expected high score after max iterations.

