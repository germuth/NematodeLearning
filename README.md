# Using Neural Networks to learn the Neuromuscular activity of Caenorhabditis elegans locomotion
Aaron Germuth & Alex Aravind

<b>1 Introduction</b>

<i>1.1 C. elegans and Locomotion</i>

Caenorhabditis elegans (C. elegans) is a primitive nematode commonly found in the soil. It has been heavily studied and helped facilitate breakthroughs in nearly every area of biology. It was the first animal to have a completely sequenced genome (Sulston et al 1992), described cell development lineage (Sulston et al 1983), and nervous system (White et al 1985). Every single worm has the exact same number and identity of each of its 959 somatic cells (Eutely). Of these, 302 make up the entire nervous system, including sensory neurons (input), interneurons, and motor neurons (output). 

Locomotion consists of the movements made by animal to move through its environment. This is a fundamental animal behaviour, performed in almost every single animal species. It forms the basis for complex behaviours such as seeking out nutrients or mates, and avoiding toxins or predators. Animals makes large use of their neural system to perform locomotion. Sensory neurons take in input, feed it through interneurons, which leads to specific timings in various motor neurons (or motoneurons), leading to muscle contraction, and subsequent movement. 

C. elegans locomotion is not fully understood, despite having the complete connectivity and neuronal information (connectome). Many neurons have been grouped with similar functionality and location (White et al 1986). Lesion studies have been performed which destroy/ablate a single neuron, and observe the resulting effect on the worm’s movement (Chalfie et al. 1985; Mclntyre et al.1993; Faumont et al. 2011; Fujii et al. 2011; Zheng et al. 1999). Such experimental evidence often suggests the function of a neuron, but it is never the full picture. Understanding how the neurons achieve movement would provide critical insight into how complex behaviours come about from individual neurons, from sensory input to behavioural output. 

In order to attempt to understand a complex system, it is often useful to separate into multiple sections. Marr (1982) claims that there are three levels any system can be broken down into, in order to achieve a complete understanding. A computational level (what are the input and output of the system), a hardware level (what are the components and how are they connected), and an algorithmic level (how is the computation implemented). 

<i>1.2	Computational Level</i>

The output of the neural system is the worm’s resulting behaviour. C elegans moves through various liquids by undulating (moving sinusoidally, similar to a snake) (Gray J and Lissmann 1964; Burr and Robinson 2004). Whenever a single side of the body contracts, the opposing side is relaxed. This propagates in waves down through the entire body (see Figure 1). The frequency of motion is proportional to the viscosity of the liquid it is travelling through (thicker liquids result in smaller amplitude, higher frequency movement). The worm steers its direction through specific nerve rings and muscles in it’s neck. Other than the neck, the body is only able to move in two dimensions (it cannot lift above the surface). 

![a](https://cloud.githubusercontent.com/assets/3782710/16973116/925fd144-4de5-11e6-95cf-90bce4861534.PNG)

Figure 1. Schematic Drawing of C. elegans, illustrating the muscle contraction and relaxation.

The input of the neural system comes from various sensory neurons. The worm is capable of sensing touch, and multiple concentration gradients (food, toxin, etc.) (Bargmann 2006). Gradients are believed to be measured by C. elegans using sensors in the head, by comparing subsequent measurements over time (Hilliard et al. 2002). It can then assess which direction to travel with respect to various food, toxin, predator, and mate interactions. Despite this wide array of sensory neurons, the worm is still able to move forward, although slightly uncoordinated, when every single interneuron has been ablated (Zheng et al. 1999; Fujii et al. 2011). This indicates that the motor neurons must take some sensory input for themselves. This could be so-called “stretch sensors” that tell the worm where it’s body is currently located.

In fact, certain motoneurons have been observed to have a long neurite (projection from cell body) with no apparent function (White et al. 1986). This neurite points from posterior to anterior (towards the head of the worm). This neurite could serve as a stretch sensor (Personal communication with Lou Byerly and Richard L. Russel, cited by White et al. 1986). In this way, the worm could sense how contracted it’s muscles currently are. Furthermore, experiments have shown that B motor neurons depolarize (“fire”) whenever the section of the worm below it bends (Wen et al. 2012). This suggests that the worms oscillatory motion might propagate from the back of the worm towards the head. Each motoneuron would be capable of sensing when the body section beneath it bends, so it is then it’s turn to bend, and this propagates through the worm. 

<i>1.3	Hardware Level</i>

The neurons of C elegans have been grouped into categories based on connectivity information (White et al. 1986). There are a series of nerve rings in the head, presumed to function as sensory input, and control for head steering (Hilliard et al. 2012). Specific to movement, there are a series of A, B, and D motoneurons running along the length of the body. These are more or less replicated on each side of the worm (dorsal (left) and ventral (right)). The B motoneurons are believed to be responsible for forward movement, and the A motoneurons for backward movement (Haspel et al. 2010; Fujii et al. 2010). The D motoneurons inhibit the opposite side of the worm (dorsal vs ventral) during contractions. For example, in Figure 1 on the left, if the dorsal side is contracting, the ventral side will be relaxed. Interestingly, these motoneurons (D) are not required during forward movement (McIntire et al. 1993). This suggests that the B motoneurons alone are responsible for generating most of the forward locomotion behaviour. Each motoneuron is connected to approximately 4-6 muscle cells nearby.

<i>1.4	Algorithmic Level</i>

This stage is the least understood by a significant margin. It is difficult to understand how the worm turns sensory input into the required behaviour. This is where, historically, simulations have began to take a role. If a researcher is able to create a simulation that exhibits convincing C. elegans motion, it indicates that the assumptions that researcher has made in their simulation are valid. It does not prove whether the worm actually works that way, but provides some evidence. Such simulations must take into account experimental advice to remain biologically relevant. However, if the simulation has applications in robotics, it can be simply inspired by C. elegans locomotion, rather than an exact duplicate. 

There are two primary theories for how the worm might generate locomotion behaviour. The first theory assumes the presence of a central pattern generator (CPG) (Wen et al. 2012). This is a biological phenomenon that is able to generate timed signals, similar to a clock in a processor. This can be achieved through a single “pacemaker” cell, or through a network of neurons with recurrent connections (Gjorgjieva et al. 2014). So far, no conclusive evidence of a CPG has been discovered in C elegans. The theory predicts that a CPG sends a regular signal to one end of the worm, and this signal is propagated through the worm's body. Typically the CPG is modeled in the head, with waves running from head to tail. This is supported by simulations (Karbowski et al. 2008; Wen et al. 2012). Alternatively, the CPG signal could be sent to the tail (or the CPG itself is present in the tail), and then propagate from tail to head through the unspecialized neurites discussed earlier. Simulations have also shown this to generate realistic motion (Bryden & Cohen 2008). It is also possible that the worm contains multiple CPGs along its body, although this is not well supported (Gjorgjieva et al 2014). Note that CPGs have already been discovered in other animals such as the lamprey, leech, and fly (Drosophila larvae).  

The second theory assumes that there is no CPG present in C elegans. The rhythm generation and propagation must be done purely by continuous outputs from the neural network, without explicit timing. This means the worm must have proprioceptive sensory neurons, to sense its body’s relative position, in order for it to know, at any instantaneous moment, what section of its body to bend next. Simulations such as (Bryden & Cohen 2008) and (Boyle et al. 2012) were able to show realistic movement without a CPG, by independently generating oscillations. More experimental evidence is needed to determine which theory, if any, is correct.

<i>1.5	Genetic Algorithms</i>

A genetic algorithm is an optimization algorithm heavily inspired by evolution. It starts with a population (group of specific size) of potential solutions. Each solution is ranked according to its fitness. Individual solutions of the population are said to be more fit if they solve the problem more efficiently. Therefore the algorithm requires a fitness function which is able to give a quantitative score to each individual. The algorithm proceeds by iterating over many generations. Each generation, individuals from the population are mutated (a random change is made) as well as combined (crossover, analogous to two parents producing offspring). The top performers of this group becomes the population for the next generation. 

Often many thousands of generations are needed before a satisfactory solution is found. This means the fitness function is invoked once per individual once per generation. This often means the speed of the fitness function is the limiting factor on execution speed of an algorithm.

<i>1.6	Reinforcement Learning</i>

Reinforcement learning problems are problems where an agent is taking actions in an environment in attempt to maximize a cumulative reward. At each (normally discrete) time step, the agent is given a set of actions, and selects one of them. Each action is associated with a hidden reward, given to the agent for selecting that action. A reinforcement learning problem is therefore trying to select the optimal policy for an agent, one which maximizes future reward. 

These problems can often be solved (or sufficiently estimated) even when the environment is unpredictable (information about the environment can only be gained by interacting with it). This problem can be approached using tabular methods (dynamic programming), genetic algorithms, and approximate online learning (for example gradient descent with a neural network), among other techniques. 

<b>2 Existing Work</b>

Many of the existing simulations tend to exclude large portions of the nervous system, including only what is essential. This is mostly justified since the neurons of the worm appear to be largely mutually exclusive. For example, it has been shown that every interneuron can be ablated and the worm can still move forward (McIntire et al. 1993). If all the simulation is trying to do is replicate worm movement, one shouldn’t include neurons that have nothing to do with movement. In fact, including these extra neurons may be unrealistic, since the simulation now has multiple extra neurons to implement movement. Therefore adding the entire neural network may actually detract from experimental validity, unless you are to also add the entire worm’s behavioural repertoire. For this reason, trying to replicate existing studies with a more complete neural network would not provide biologically relevant results. 

With this, it is difficult to know where to proceed. Every theory for how the worm moves already has a simulation showing that it could work. If there was some new, (or old but undiscovered) experimental evidence, that had not been incorporated into a simulation yet, that would provide a substantial contribution. In this study, we aim to reproduce the results seen in previous studies. More specifically, we hope to train a neural network to control simulated C. elegans locomotion. If the simulation is able to display realistic movement, this would provide further evidence for the hypothesis that C. elegans does not contain a CPG. 

<b>3 Methods</b>

<i>3.1	Simulator</i>

A two-dimensional simulation for the worm was created in an open source javascript implementation of the Box2D physics engine. The worm consists of multiple independent segments, each of which is interconnected by a rotating joint (see Figure 2). There is a motor on each joint which can apply force in both directions at various strengths. The motor speed and direction is controlled by output from the neural network. Each motor stimulates the muscles in a single segment of the worm. Dorsal muscles are simulated when the motor pushes clockwise, and ventral muscles when counter-clockwise. The worm is placed in the middle of a gravity-free, infinite 2D plane, from a top-down view. 

![b](https://cloud.githubusercontent.com/assets/3782710/16973115/925fa3d6-4de5-11e6-8e6a-de0d7296bb0f.PNG)

Figure 2. Screenshot of Box2d simulation showing a worm of size 10. 

<i>3.2	Neural Network</i>

A neural network is used to control the locomotion of the worm. The neural network has N-1 input neurons, 25 hidden neurons, and 2N-2 output neurons, where N is the segment count of the worm. Each input neuron takes in the relative angle between adjacent segments. Output neurons control the motor speed and force applied for each motor. Motor direction is dependant on the sign of motor speed. The motors of the simulation are controlled by the respective outputs of the neural network. The neural network uses floating points with values within [0,1]. To account for this, the resulting input/output neurons are scaled appropriately. For example, motors can give a maximum of 500 force (arbitrary units), so the result from the neural network is multiplied to 500 to get the applied force. 

<i>3.3	Training</i>

The genetic algorithm trains neural networks. The neural networks are encoded as a large array of doubles, where each double is a network edge weight of the neural network. This array is ordered, and can be converted back and forth between the associated neural network. 75 iterations is performed by default.

Each individual has a 10% chance of mutation, where a mutation consists of either a complete re-roll or a perturbation. Rerolling consists of setting the network weight to a new completely random value. Perturbation edits the current weight by adjusting it 10% in a random direction. Crossover is performed by selecting two random individuals, and generating a random bitmap. If the ith bit is 1, the child takes the first parents ith edge weight value. If the ith bit is 0, the child gets the second parent’s ith value.
 
The fitness function creates a worm with a neural network, and allows it to interact with the world for 8 simulated seconds (sampled 24 times a second). At the end of the simulation, the position of the worms head is used to assess how far it was able to travel. The further the left the worm has reached in 8 seconds, the quicker it has moved, so the fitness function is simply the negative of x position. 

<b>4 Results</b>

After training the worm we were unable to generate realistic sinusoidal movement. We were able to show some lateral movement, but the motion resembled something analogous to a jellyfish propelling itself across ice (see Figure 3). 


![c](https://cloud.githubusercontent.com/assets/3782710/16973118/9260074a-4de5-11e6-8d1d-ef000e4c143e.PNG)

Figure 3. Three screenshots showing jellyfish-like movement. The worm initially starts flat (1). The left and right half of the worm each contract and pull together (2), propelling the worm downwards (3). While this does move the worm, it is not characteristic of normal C. elegans locomotion. 

Since other work has been able to reproduce movement (Bryden & Cohen 2008; Boyle et al. 2012), this is an unexpected result. There are many potential reasons for the inability to reproduce natural movement. The first potential issue is the simulation environment used. Box2D is a rigid body simulation, not intended for simulated fluids. It is likely the movement of C. elegans depends somewhat on a viscous material to propel itself through. Evidence for this viewpoint is suggested by studies indicating the worm has a single movement behaviour whether it is moving through water or across agar (Boyle & Cohen 2012). The environment in Box2D was modeled with various friction joints. Many different parameters were tested with varying strengths, accelerations, and weights, but no combination was able to produce satisfactory movement. One option to consider is to try simulating multiple tiny spheres in box2D to roughly simulate the effect of water. However, this would be extremely computationally intensive.

A second potential issue is the fitness function. Currently, for each worm in the population (~100 worms), it is simulated for 8 seconds of movement. This is sampled at 24 frames per second, giving the worm 24*8 = 192 decision points. This is done for 100 worms for 100 generations to give a total of 1,920,000 points. This means not only is the neural network invoked 2 million times, but the physics simulated must extrapolate future position in the future (1/24th of a second) 2 million times. This is a very costly procedure, and greatly limits the amount of generations that we can feasibly run. It is possible that with more generations we would start to see potential movement.

<b>5 Future Work</b>

The first aim is to realistic movement. Switching the physics engine used may provide a more realistic fluid-like environment. Two popular options include BBC and OpenWorm. BBC (Boyle, Berri & Cohen 2012) is a biologically grounded model for C. elegans locomotion. The simulation works in 2D, modeling the hydrostatic skeleton and every muscle of an adult nematode (see Figure 4). It has 147 degrees of freedom across the length of the worm and has generated realistic locomotion in other studies.

![d](https://cloud.githubusercontent.com/assets/3782710/16973119/9261d5e8-4de5-11e6-8dd2-22878aa667a4.PNG)

Figure 4. 2D schematic of the physical model structure for the BBC simulator.

It is also possible to use the OpenWorm physics simulator (see Figure 5). OpenWorm is a massive projected undertaken by individuals all over the world. It attempts to completely simulate every aspect of a C. elegans worm down to the cellular level. 
	
![e](https://cloud.githubusercontent.com/assets/3782710/16973117/925fe62a-4de5-11e6-9bfc-5e3fc1192774.PNG)

Figure 5. Rendering of simulated C. elegans nematode in OpenWorm browser. 

While the OpenWorm simulator is much more accurate, BBC is most likely the better choice. OpenWorm is still under active development and is likely to have large computation complexity. It is unlikely one could effectively train the worm using evolutionary methods. The BBC simulator has already been shown to work with evolutionary methods (Izquierdo & Beer 2015). For these reasons, progress has already begun with the BBC model.

Once completed, we would like to compare several training methods. A classic genetic algorithm can be compared to more sophisticated techniques such as NeuroEvolution of Augmenting Topologies (NEAT, University of Texas). This has been shown in the literature to be very effective, but mutates the neural network structure. This may also allow for an inference as to how optimized the biological network. For example, if changing topology yields better results, it suggests that if C. elegans were to evolve these corresponding changes, its fitness may improve. 
	
Furthermore we would like to attempt to train the worm with reinforcement learning. This means the worm will have zero pre-existing knowledge, or “training time”. It will immediately be placed in its environment (with its neural network in a random state), and attempt to learn from its interactions with the environment. This would be similar to a worm figuring how to move from birth. Such an approach could be executed in real time and may even make a restricted OpenWorm simulation possible. However some challenges are naturally present when performing reinforcement learning in a real time environment, with continuous outputs. 

<b>6	Conclusion</b>

This project and its future directions will allow exploration on the inner neural functioning of locomotion on C. elegans. If the artificial neural network is able to learn and properly navigate through its environment, it would provide some evidence that my modeling assumptions (for example, presence of stretch receptors) could exist in the actual worm. It will also provide a comparison of the performance between genetic algorithms and more classical reinforcement learning techniques in a novel task (training the worm to move).






6	References

Bargmann, C. I. (2006). Chemosensation in C. elegans.

Boyle, J. H., Berri, S., & Cohen, N. (2012). Gait modulation in C. elegans: an integrated neuromechanical model. Frontiers in computational neuroscience,6.

Bryden, J., & Cohen, N. (2008). Neural control of Caenorhabditis elegans forward locomotion: the role of sensory feedback. Biological cybernetics,98(4), 339-351.

BURR, A., & ROBINSON, A. F. (2004). 2 Locomotion Behaviour. Nematode behaviour, 25.

Chalfie, M., Sulston, J. E., White, J. G., Southgate, E., Thomson, J. N., & Brenner, S. (1985). The neural circuit for touch sensitivity in Caenorhabditis elegans. The Journal of neuroscience, 5(4), 956-964.

Faumont, S., Rondeau, G., Thiele, T. R., Lawton, K. J., McCormick, K. E., Sottile, M., ... & Lockery, S. R. (2011). An image-free opto-mechanical system for creating virtual environments and imaging neuronal activity in freely moving Caenorhabditis elegans. PLoS One, 6(9), e24666.

Fujii, H., Baba, T., Ishida, Y., Kondo, T., Yamagishi, M., Kawano, M., & Mukaida, N. (2011). Ablation of the Ccr2 gene exacerbates polyarthritis in interleukin‐1 receptor antagonist–deficient mice. Arthritis & Rheumatism,63(1), 96-106.
Gjorgjieva, J., Biron, D., & Haspel, G. (2014). Neurobiology of Caenorhabditis elegans locomotion: where do We Stand?. BioScience, 64(6), 476-486.

Gray, J., & Lissmann, H. W. (1964). The locomotion of nematodes. Journal of Experimental Biology, 41(1), 135-154.

Haspel, G., O'Donovan, M. J., & Hart, A. C. (2010). Motoneurons dedicated to either forward or backward locomotion in the nematode Caenorhabditis elegans. The Journal of Neuroscience, 30(33), 11151-11156.

Hilliard, M. A., Bargmann, C. I., & Bazzicalupo, P. (2002). C. elegans responds to chemical repellents by integrating sensory inputs from the head and the tail. Current Biology, 12(9), 730-734.

Karbowski, J., Schindelman, G., Cronin, C. J., Seah, A., & Sternberg, P. W. (2008). Systems level circuit model of C. elegans undulatory locomotion: mathematical modeling and molecular genetics. Journal of computational neuroscience, 24(3), 253-276.

Marr, D. (1982), Vision: A Computational Approach, San Francisco, Freeman & Co.

McIntyre, K. J. (1993). U.S. Patent No. 5,257,706. Washington, DC: U.S. Patent and Trademark Office.

Izquierdo, E. J., & Beer, R. D. (2015). An integrated neuromechanical model of steering in C. elegans. In Proceeding of the European Conference on Artificial Life (pp. 199-206).

Sulston, J., Du, Z., Thomas, K., Wilson, R., Hillier, L., Staden, R., ... & Dear, S. (1992). The C. elegans genome sequencing project: a beginning.Nature, 356(6364), 37-41.

Sulston, J. E., Schierenberg, E., White, J. G., & Thomson, J. N. (1983). The embryonic cell lineage of the nematode Caenorhabditis elegans.Developmental biology, 100(1), 64-119.

Wen, Q., Po, M. D., Hulme, E., Chen, S., Liu, X., Kwok, S. W., ... & Kawano, T. (2012). Proprioceptive coupling within motor neurons drives C. elegans forward locomotion. Neuron, 76(4), 750-761.

White, J. G., Southgate, E., Thomson, J. N., & Brenner, S. (1986). The structure of the nervous system of the nematode Caenorhabditis elegans: the mind of a worm. Phil. Trans. R. Soc. Lond, 314, 1-340.

Zheng, Y., Brockie, P. J., Mellem, J. E., Madsen, D. M., & Maricq, A. V. (1999). Neuronal control of locomotion in C. elegans is modified by a dominant mutation in the GLR-1 ionotropic glutamate receptor. Neuron, 24(2), 347-361.
