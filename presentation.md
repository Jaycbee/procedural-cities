---
history: true
width: 1280
height: 960
margin: 0.05
theme: white
slideNumber: true
nocite: |
    @subvimpl
bibliography: prosem.bib
header-includes: |
    <style>
    img { max-height:400px !important; }
    .reveal h1 { font-size: 1.5em; }
    iframe {
        width: 1024px; height: 768px;
    }
    </style>
---

# Procedural Modeling of Cities <br><small><small>Press space to continue</small></small><img src="img/20151221012636.png" style="position:fixed;top:0;left:0;width:2066px;opacity:0.2;height:1300px;max-height:initial !important;max-width:initial;z-index:-100;margin-left:-280px;margin-top:-590px;">

##

**Goal**: *Automatic generation of a realistic-looking city<br> including road structure and buildings*

. . .

### Applications

* Entertainment (Movies, Games)
* Military training
* Land use planning

## Approach

1. Choose/Process input parameters
2. Generate street network
3. Evaluate building blocks
4. Generate building structure and architecture

Optional interaction between these steps

# Modeling of the street network <br><small>@cities2001</small>

<!--
## Input parameters

Need some type of contextual information.

<!--
- map boundaries and obstacles
- street layouting information

. . . --.>

**Examples**

- elevation and water map
- population density map
- vegetation map
- city type and road patterns
- city zones (residential, industrial, etc.)
-->

## Initialization

* begin with two opposite street segments
* greedily continue mostly straight from existing segments

<iframe data-src="demo.html#
    segment_count_limit = 10;
    arrowhead_size = 110;
    draw_circle_on_segment_base = 25;
    iterations_per_second = 1;
    smooth_zoom_start = 1;
    highway_branch_probability = 0;
    only_highways = 1;
    restart_after_seconds = 2;
    highway_population_sample_size = 0;
    iteration_speedup = 0.05;
    seed = 0.4010764153208;
"></iframe>

## Branching

- branch with some probability at ≈ 90 degrees

<iframe style="height:600px" data-src="demo.html#
    segment_count_limit = 20;
    arrowhead_size = 80;
    smooth_zoom_start = 1;
    draw_circle_on_segment_base = 30;
    iterations_per_second = 1;
    target_zoom = 0.8;
    two_segments_initially = 0;
    highway_population_sample_size = 0;
    only_highways = 1;
    seed = 0.03;
    restart_after_seconds = 3;
    highway_branch_probability = 0.12;
    iteration_speedup = 0.05;
"></iframe>

## Street hierarchy

Primary, secondary, tertiary streets are used in urban planning

→ Simplified distinction between "highways" and normal streets

. . .

- highway segments are longer and branch less
- normal streets can only branch into normal streets

<iframe style="height:400px;width:500px;" data-src="demo.html#
    segment_count_limit = 20;
    arrowhead_size = 100;
    iterations_per_second = 1;
    target_zoom = 0.8;
    highway_segment_width = 24;
    two_segments_initially = 0;
    only_highways = 1;
    smooth_zoom_start = 1;
    seed = 0.1;
    restart_after_seconds = 3;
    iteration_speedup = 0.05;
"></iframe>
<iframe style="height:400px;width:500px;" data-src="demo.html#
    segment_count_limit = 40;
    arrowhead_size = 80;
    iterations_per_second = 2;
    target_zoom = 0.8;
    two_segments_initially = 0;
    only_highways = 0;
    smooth_zoom_start = 1;
    seed = 0.1;
    restart_after_seconds = 3;
    start_with_normal_streets = 1;
    iteration_speedup = 0.05;
"></iframe>

## Parallel growth

New potential segments are evaluated after existing ones

<iframe style="height:500px;" data-src="demo.html#
    segment_count_limit = 40;
    //arrowhead_size = 80;
    smooth_zoom_start = 1;
    iterations_per_second = 2;
    skip_iterations = 10;
    delay_between_time_steps = 2;
    seed = 0.1;
    restart_after_seconds = 3;
    start_with_normal_streets = 1;
    priority_future_colors = 1;
    iteration_speedup = 0.05;
"></iframe>

*red* = current step

*green* = next step

## Highway branching

Normal streets branching from highways have an additional delay (*blue*)

<iframe style="height:500px;" data-src="demo.html#
    segment_count_limit = 400;
    smooth_zoom_start = 1;
    iterations_per_second = 1.5;
    iteration_speedup = 0.2;
    two_segments_initially = 0;
    skip_iterations = 0;
    HIGHWAY_POPULATION_SAMPLE_SIZE = 0;
    normal_branch_time_delay_from_highway = 8;
    seed = 0.384021194207972;
    // seed = 0.14609342411312398;
    restart_after_seconds = 3;
    priority_future_colors = 1;
"></iframe>

This prevents highways from being cut off by normal streets

## Conflict resolution

If a new segment

- is near an existing street:  Adjust endpoint and create intersection

. . .

![<small>@cities2001</small>](img/20151213214559.png)

. . .

- ends in an obstacle (e.g. water, park): Shorten or rotate segment to fit

## Global goals (1)

<div style="float:right;border:1px">
<small>Simplex noise</small><br><img src="img/20151215214538.png" style="margin-top:-1ex;border:none;height:200px;"></div>

Population map (generated with layered simplex noise):

```javascript
function populationAt(x, y) {
    value1 = simplex2(x / 10      , y / 10      ) / 2 + 0.5;
    value2 = simplex2(x / 20 + 0.5, y / 20 + 0.5) / 2 + 0.5;
    value3 = simplex2(x / 20 + 1.0, y / 20 + 1.0) / 2 + 0.5;
    return Math.pow((value1 * value2 + value3) / 2, 2);
}
```

<iframe style="height:500px" data-src="demo.html#
    segment_count_limit = 0;
    iterations_per_second = Infinity;
    draw_heatmap = 1;
    seed = 0.8174194933380932;
    smooth_zoom_start = Infinity;
    heatmap_pixel_dim = 7;
    heatmap_as_threshold = 0;
    target_zoom = 0.01;
    iteration_speedup = 0.05;
"></iframe>


## Global goals (2)

Highways try to connect population centers.

Possible new directions are sampled, the one with largest population is chosen

![](img/20151215171754.png)

. . .

<iframe style="height:400px;" data-src="demo.html#
    segment_count_limit = 1000;
    draw_heatmap = 1;
    heatmap_pixel_dim = 10;
    draw_heatmap_as_threshold = 0;
    HIGHWAY_POPULATION_SAMPLE_SIZE = 1;
    iterations_per_second = 200;
    only_highways = 1;
    restart_after_seconds = 10;
    seed = 0.8163482854142785;
    iteration_speedup = 0.05;
"></iframe>


## Global goals (3)

Streets only branch if population is larger than some threshold:

<iframe data-src="demo.html#
    segment_count_limit = 10000;
    iteration_speedup = 1;
    draw_heatmap = 1;
    seed = 0.8174194933380932;
    heatmap_pixel_dim = 10;
    heatmap_as_threshold = 1;
    target_zoom = 1.0;
    restart_after_seconds = 7;
"></iframe>

## Global Goals (4) — Street patterns

Different patterns found in cities:

<div class=notes>
- Rectangular raster (≈ 90° angles)
- Radial
- Branching / random
</div>

![<small>[@cities2001]</small>](img/20151213214501.png)

## Street patterns — Examples


<div style="float:left">
![San Francisco](img/sanfran.png)
</div>
<div style="float:left">
![Sao Paolo](img/20151215222027.png)
</div>
<div style="float:left">
![New Delhi](img/newdelhi.png)
</div>
<div style="float:left">
![Tokyo](img/20151215221746.png)
</div>

<small>http://maps.stamen.com/</small>

## Implementation as parametric L-System

Original implementation by @cities2001
```
w: R(0, initialRuleAttr) ?I(initRoadAttr, UNASSIGNED)
p1: R(del, ruleAttr) : del<0 -> e
p2: R(del, ruleAttr) > ?I(roadAttr,state) : state==SUCCEED
    { globalGoals(ruleAttr,roadAttr) creates the parameters for:
          pDel[0-2], pRuleAttr[0-2], pRoadAttr[0-2] }
    -> +(roadAttr.angle)F(roadAttr.length)
      B(pDel[1],pRuleAttr[1],pRoadAttr[1]),
      B(pDel[2],pRuleAttr[2],pRoadAttr[2]),
      R(pDel[0],pRuleAttr[0]) ?I(pRoadAttr[0],UNASSIGNED)[i]
p3: R(del, ruleAttr) > ?I(roadAttr, state) : state==FAILED -> e
p4: B(del, ruleAttr, roadAttr) : del>0 -> B(del-1, ruleAttr, roadAttr)
p5: B(del, ruleAttr, roadAttr) : del==0 -> [R(del, ruleAttr)?I(roadAttr, UNASSIGNED)]
p6: B(del, ruleAttr, roadAttr) : del<0 -> e
p7: R(del, ruleAttr) < ?I(roadAttr,state) : del<0 -> e
p8: ?I(roadAttr,state) : state==UNASSIGNED
    { localConstraints(roadAttr) adjusts the parameters for:
        state, roadAttr}
    -> ?I(roadAttr, state)
p9: ?I(roadAttr,state) : state!=UNASSIGNED -> e
```
→ unnecessarily complicated

## Implementation with priority queue

originally from @harmful

```javascript
function generate() {
    let Q = new PriorityQueue<Segment>();
    Q.enqueueAll(makeInitialSegments());
    let segments = [];

    while (!Q.empty() && segments.length < SEG_LIMIT) {
        let minSegment = Q.dequeue();
        // resolve conflicts
        let accepted = applyLocalConstraints(minSegment, segments);
        if (accepted) {
            segments.push(minSegment);
            // create new segments
            Q.enqueueAll(globalGoalsGenerate(minSegment));
        }
    }
}
```

<small>(+ a quadtree in *applyLocalConstraints*)</small>

## Complete demo

(10000 segments, not full speed)

<iframe data-src="demo.html#
    iteration_speedup = 1;
    segment_count_limit = 10000;
    restart_after_seconds = 3;
    seed = 0.14140297517183242;
"></iframe>

# Modeling of buildings blocks and architecture

## Input parameters

- Street network
- Building information (e.g. height / type / age)

## Lot subdivision

<img src="img/20151108215824.png" width=1000>
<br><small>@cities2001</small>

<!--
#. Calculate areas by scaling from street crossings
#. Assume convex and mostly rectangular regions-->
#. Recursively divide along the longest edges that are approximately parallel
#. Discard all blocks that do not have street access

## Architecture

Approaches:

- L-systems (see @cities2001)
- Split grammars (see Wonka et al. (2003) “Instant Architecture.”)

# Alternative Methods

## Tensor fields

![<small>Chen, Guoning, Gregory Esch, Peter Wonka, Pascal Müller, and Eugene Zhang. 2008. “Interactive Procedural Street Modeling.” In <em>ACM SIGGRAPH 2008 Papers</em>, 103:1–103:10. SIGGRAPH ’08. New York, NY, USA: ACM. doi:<a href="http://doi.org/10.1145/1399504.1360702" class="uri">http://doi.org/10.1145/1399504.1360702</a>.</small>](img/20151215231757.png)

## Time simulation

![<small>Weber, Basil, Pascal Müller, Peter Wonka, and Markus Gross. 2009. “Interactive Geometric Simulation of 4D Cities.” <em>Computer Graphics Forum</em> 28 (2): 481–92. doi:<a href="http://doi.org/10.1111/j.1467-8659.2009.01387.x" class="uri">http://doi.org/10.1111/j.1467-8659.2009.01387.x</a>.</small>](img/20151124201337.png)

## References

Slides including source code:

<h2 style="text-transform:none"><https://phiresky.github.io/procedural-cities/></h2>

<small>
