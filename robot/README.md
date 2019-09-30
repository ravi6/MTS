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

## 1st June 2019
* Identified bug in pdf sampling selection logic and that alleviated above concerns. Now
things are behaving as they were.

* Digressed a bit to make the GUI more manageable with Tabbed interface, re-jigged code
with class structure to avoid globals and make it more manageable. Added parameter inputs
to GUI. Hit major issue with rendering jflot plots on tabbed content as jflot does not like
to draw on hidden divisions. Had to move to  the plot tab, while refreshing plots and delay
plotting to ensure tab content is fully displayed. 

* Because the code was revamped, wanted to make sure that the newly structured code has not 
introduced any bugs. Noting that no fundamental classes have been modfied, only top level
DMCTS implementation was "classified !!!"(not in defence perspective). Initially was concerned
that new version is producing different results. But after thorough comparison with old version
results, it was clear that final pdf results after 2000 iterations varied within same version 
without any changes to parameters.

* Moving on with the new version, SAMPLE method for pdf selection is consistent with proper
sampling method from a discrete distribution. After attending the course work, it is clear
that one needs to make enough number of samples (with more playouts before restarting the
cycle. Also, what is clear is that we need to propagate just the collective socre for selected
action sequence combination. No need to weigh the score with associated probability numbers.
Now that I am clear on the method of generating samples from discrete distribution, it makes
sense that propagation of normal score eventually results in expected score. The probability
values associated with the table are encoded in samples selected. (Obviously one need to take
enough number of samples).

* So far every rollout is replacing pdf table entry with the new rollout sequence. This is
not appropriate. Have to replace an entry in the pdf table only when the rollout score is 
superior to the best candidate (in terms of collective gain). This means pdf table should also
contain the score/benefit values for ease of this implementation. As to what should happen
to the corresponding q value is left to the implementaion. One could reset all q's or leave
them as they were. Also, instead of using global collective score a relative global collective
score is a natural choice for back propogation.

* The above changes will be implemented in the following commits
 


## 2st June 2019
Completed implementing above changes. Need more exploratory runs. Chaning initial conditions,
obstacles etc. Also, explore different MTScycle strategies. Right now we rollout once for each
cycle. I think it is more appropriate to make several rollouts before moving on to next cycle. 

## 8th Aug 2019
Fixed bug in Entorpy calculation (negative sign omitted). But results still have
not changed substantially. PDF table after many iterations shows peaks on few rollout sequences despite the
fact that all of the combined score(of robots) appear to be quite close to maximum value. Also, the
move sequences are quite identical covering most of the reward points, but varying
only at tail end. Is this the artifact of flat region, where multiple paths produce
same score??

## 20th Sep 2019
Created online branch and pruned all other stuff except robot. The idea is not merge this ever with master. 
It will be standalone implementaion of DMCTS with parallel threads and online planning feature.
