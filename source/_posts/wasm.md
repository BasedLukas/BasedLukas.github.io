---
title: WASM
share_cover: 2024-12-wasm/wasm.jpg
author: Lukas
subtitle: It's so over for JavaScript
description: Running a Python CPU emulator in the browser with WebAssembly. An interactive puzzle built with WASM that bundles a full Python interpreter.
date: 2024-12-07
---

{%raw%}

 <style>
     /* Default: hide the iframe and show the message for mobile portrait mode */
     #robot-frame {
         display: none;
     }

     #mobile-message {
         display: none;
         font-size: 1.5em;
         text-align: center;
         color: red;
         font-weight: bold;
         margin-top: 50px;
     }

     /* Show the iframe on landscape mode */
     @media screen and (orientation: landscape) and (max-width: 768px) {
         #robot-frame {
             display: block;
         }
         #mobile-message {
             display: none;
         }
     }

     /* Show the iframe for desktops */
     @media screen and (min-width: 769px) {
         #robot-frame {
             display: block;
         }
         #mobile-message {
             display: none;
         }
     }
 </style>
 
 <!-- The iframe -->
 <iframe id="robot-frame" src="robot.html" style="width: 100%; height: 850px; border: none;"></iframe>

 <!-- Message for mobile portrait mode -->
 <div id="mobile-message">
     The game cannot load in portrait mode. <br> 
     Please turn your phone sideways or visit on a desktop device.
 </div>

<script>
    // JavaScript to handle dynamic behavior
    function handleOrientationChange() {
        const iframe = document.getElementById('robot-frame');
        const message = document.getElementById('mobile-message');

        if (window.innerWidth < 769) {
            if (window.matchMedia("(orientation: landscape)").matches) {
                iframe.style.display = "block";
                message.style.display = "none";
            } else {
                iframe.style.display = "none";
                message.style.display = "block";
            }
        } else {
            iframe.style.display = "block"; // Desktop always shows
            message.style.display = "none";
        }
    }

    // Initial check
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('resize', handleOrientationChange);
</script>

{%endraw%}

*Note: This puzzle is based on a [previous blog post ](https://loreley.one/2023-07-cpu/) of mine. I've reprinted it below (with slight modifications) to provide the context of how this CPU works and why I made it. The functionality of the CPU is derived entirely from simulated logic gates. All the operations and control flow are based on the underlying properties of the logic gates, and changing their operation leads to corresponding changes in function.* 
*I've been playing around with WASM (Web Assembly) and decided to resuscitate my old python code from that blogpost in order to run it in the browser. The entire python interpreter is bundled with the game code using WASM in the browser. I thought this was pretty cool.*
*Thanks to Ivan for reviewing an earlier version of this post.*

<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#tutorial" aria-expanded="false" aria-controls="collapse">
Tutorial
</button>

<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#old-cpu-post" aria-expanded="false" aria-controls="collapse">
Old Blog Post
</button>


<div class="collapse" id="tutorial">

### Introduction

This CPU features six general-purpose registers (`reg0` to `reg5`), along with a special register (`reg6`) used for both input and output. It supports four main types of operations:

- **Immediate Values**
- **Arithmetic Operations**
- **Copying**
- **Comparisons and Control Flow**

All values in the CPU are 8-bit and overflow after 255 to 0. 
For comparisons, values are treated as **signed** (range -128 to 127).

---

### Immediate Values

Load a constant value into `reg0`. Only values up to 63 are allowed because the two most significant bits (MSB) are reserved for instruction encoding.

```
0       # Load 0 into reg0 (min allowed immediate)
36      # Load 36 into reg0
63      # Load 63 into reg0 (max allowed immediate)
```

---

### Copying Data

The `copy` instruction copies data between registers or between a register and the input/output.
**Input and Output**: `reg6` serves as both the input and output register.

```
copy <source_register> <destination_register>
``` 
```assembly
copy 6 1   # Copy value from input (reg6) to reg1
copy 3 6   # Copy value from reg3 to output (reg6)
copy 5 3   # Copy value from reg5 into reg3
copy 6 6   # Copy from input directly to output
copy 1 1   # NOP
```

---

### Arithmetic and Logical Operations

Arithmetic and logical operations use `reg1` and `reg2` as operands and store the result in `reg3`. 
Arithmetic uses 2's complliment. Values overflow if they exceed 255. 

**Addition** (`add`): Adds `reg1` and `reg2`.
**Subtraction** (`sub`): Subtracts `reg2` from `reg1`.
**Bitwise AND** (`and`): Performs a bitwise AND operation on `reg1` and `reg2`.
**Bitwise OR** (`or`): Performs a bitwise OR operation on `reg1` and `reg2`.


```
1        # Load 1 into reg0
copy 0 1 # Move 1 into reg1
2        # Load 2 into reg0
copy 0 2 # Move 2 into reg2
add      # reg3 = reg1 + reg2 = 1 + 2 = 3
copy 3 6 # Output result (3)
```

```
32
copy 0 1
32
copy 0 2
add  # 64 in reg 3
copy 3 2
copy 3 1
add # 128 in reg 3
copy 3 1
copy 3 2
add 
copy 3 6
# total 256, so output is 0 == [0,0,0,0,0,0,0,0]
```

```
0
copy 0 1
2
copy 0 2
sub  # 0 - 2 = -2
copy 3 6
# cpu output is -2 == [1,1,1,1,1,1,1,0]
```

```
32
copy 0 1
32
copy 0 2
add  # 64 in reg 3
copy 3 2
copy 3 1
add # 128 in reg 3
1
copy 0 2
copy 3 1
sub     # 128 - 1
copy 3 6
# result is 127 == [0,1,1,1,1,1,1,1] in 2's compliment
```

---

### Comparisons and Control Flow

The `eval` instruction compares the **signed** value in `reg3` against `0`. If the condition is true, the program counter jumps to the address in `reg0`.

```
eval <condition>
```

Supported conditions:

- `eval always`: Always jump.
- `eval never`: Never jump.
- `eval =`: Jump if `reg3 == 0`.
- `eval !=`: Jump if `reg3 != 0`.
- `eval <`: Jump if `reg3 < 0` (signed).
- `eval <=`: Jump if `reg3 <= 0` (signed).
- `eval >`: Jump if `reg3 > 0` (signed).
- `eval >=`: Jump if `reg3 >= 0` (signed).

---

### Labels

Labels act as named locations in the program. Defining a label associates it with its position in the program. Calling labels is just shorthand for using immediate values (and thus labels can't be placed after line 63).


```assembly
label <name>
```
```assembly
label start # start = 0
copy 6 1    # Read input into reg1
add         # Add reg1 and reg2
start       # Label used here as jump target, equvalent to using immediate 0
eval >=     # Jump to "start" if reg3 >= 0
```

This program copies `1` into `reg1`, adds it with `reg2`, and stores the result in `reg2` in a loop until the result overflows and becomes negative.

```assembly
1           # Load 1 into reg0
copy 0 1    # Copy 1 into reg1
label loop
add         # reg3 = reg1 + reg2
copy 3 2    # Store result in reg2
copy 3 6    # print result to output
loop
eval >=     # Jump to label loop if reg3 >= 0
```

**For comparisons, the value is treated as signed (`127` is interpreted as `127`, but `128` is interpreted as `-128`). The last result the cpu prints is thus `128`**

### Robot Instructions

output (controls):
`1 == turn left`  
`2 == turn right`  
`3 == step forward`

input:
`1 == wall`  
`0 == clear`

```
# this will rotate you left
1
copy 0 6

# rotate right 3 times
2
copy 0 6
copy 0 6
copy 0 6

# walk in a line until blocked
label start_loop
3
copy 0 6
copy 6 3    # put the input in reg3
start_loop
eval =      # if reg3 is 0 there is no wall
```

glhf

<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#tutorial" aria-expanded="false" aria-controls="collapse">
Hide Tutorial
</button>

</div>

<div id="old-cpu-post" class="collapse">

## Introduction
A while back, I came across an interesting game on Steam called [Turing Complete](https://turingcomplete.game/). The objective of the game is to design a Turing complete CPU from scratch, and it guides players through each step of the process. Starting with the basics of logic gates, the building blocks of a CPU, players tackle progressively more complex challenges until they reach the point of designing their own CPU capable of performing simple tasks. I found the game captivating and spent an unhealthy amount of time in it.

{% raw %}
<center>
<img src="turing_complete.jpg" alt="turing_complete">
<p><small>Turing Complete gameplay</small></p>
</center>
{% endraw %}

After completing the game, I decided it would be fun to create a Python emulator for a similar CPU. While it's relatively easy to make a basic emulator in Python due to its high-level nature, I chose a different approach. I wanted to build the CPU entirely from scratch, deriving the logic from the fundamental functionality of logic gates. This means that the CPU's performance is determined solely by simple true/false comparisons, without relying on if statements or other control flows. It does make the code a bit harder to read at times, but by merely changing the function of a single logic gate, you can witness how the entire CPU's behavior is affected (spoiler alert: it stops working).

## Logic Gates
The design starts with the logic gates. Here is an excerpt of the code
```python

def and_(*args:bool)->int:
    return int(all(args))

def or_(*args:bool)->int:
    return int(any(args))

def not_(*args:bool)->int:
    return int(not all(args))
```
The logic gates perform simple comparisons and return true or false values. For example the AND gate returns true only if both of its inputs are true. The OR gate returns true if either (or both) of its inputs are true.

{% raw %}
<center>
<img src="logic_gates.jpg" alt="logic gates">
<p><small>logic gate symbols</small></p>
</center>
{% endraw %}

## Basic Components

Once we have our logic gates, we can utilize them to create essential components. Let's focus on the full adder as an example. The purpose of a full adder is to take two binary inputs and perform addition on them. For instance, when adding 0 + 0, the output is 0. When adding 1 + 0, the output is 1.

However, adding 1 + 1 poses a challenge. In binary, we lack a way to represent the number 2 directly. To address this, we introduce a carry bit, similar to carrying over a digit when adding two decimal numbers that exceed 9. Additionally, we have a carry input to account for any carry bits from previous additions. 

{% raw %}
<center>
<img src="full_adder.png" alt="full adder">
<p><small>full adder design</small></p>
</center>
{% endraw %}


A truth table is a structured table that presents the outputs corresponding to all possible input combinations. It allows us to systematically analyze the behavior of a component or system under consideration. In the case of a full adder, the truth table would display the sum output and carry output for each potential combination of binary inputs and carry input. By checking the truth table, we can see how the full adder operates under different input scenarios.


{% raw %}
<center>
<img src="full_adder_truth.png" alt="full adder truth table">
<p><small>full adder truth table</small></p>
</center>
{% endraw %}

The above design can now be implemented in code, using the logic gates we have created previously. In this case I first made a half adder (which doesn't have a carry in) and used two of them to construct a full adder. Notice how all the logic is dependent on the operation of the logic gates.

```python
def half_adder(input1:bool, input2:bool):
    return sn(
        sum=xor(input1, input2),
        carry=and_(input1, input2)
        )

    
def full_adder(input1:bool, input2:bool, carry_in:bool):
    half_adder1 = half_adder(input1, input2)
    half_adder2 = half_adder(half_adder1.sum, carry_in)
    out = sn(
        sum=half_adder2.sum,
        carry=or_(half_adder1.carry, half_adder2.carry)
    )
    return out
```

After creating a number of basic components such as these, we create more complex components such as an ALU (Arithmetic Logic Unit). The task of the ALU is to perform simple mathematical operations, such as adding 2 numbers together. In this case the ALU can only perform 4 simple operations; Addition, Subtraction, and two logical operations AND and OR. I took inspiration from this 32 bit ALU design, although mine only has 8 bits.

{% raw %}
<center>
<img src="ALU.png" alt="alu">
<p><small>32 bit ALU design</small></p>
</center>
{% endraw %}

# The Full CPU

The design of the CPU includes six registers, an input, and an output, along with an ALU. Additionally, there is a unit that can carry out comparisons between a value and zero. The CPU operates by executing one of four distinct types of operations:

- Immediate: This operation is for moving a given value into register 0. 

- Arithmetic: The operands for any arithmetic operation are always register 1 and register 2, and the resultant output is stored in register 3.

- Copy: This operation is used for duplicating values from one register to another or to the output. For example, 'copy 0 6' copies from register 0 to the output, and 'copy 5 3' copies from register 5 to register 3.

- Evaluation: This operation evaluates the value in register 3 against zero. If the condition is true, it sets the program counter to the value in register 0.

{% raw %}
<center>
<img src="full_cpu.jpeg" alt="full cpu">
<p><small>CPU design</small></p>
</center>
{% endraw %}

Using just these operations we have already created a turing complete CPU! However writing code for it would be challenging as we would have to write everything in binary. To solve this I made a simple assembler that converts assembly code to binary. It also adds a number of useful features such as labels. Labels allow you to mark a point in your program to jump to, making it much easier to create loops in your code. Let's take a look at a simple program. 

```
# create a marker at the beginning of the program where we can jump to
label start 

# read from input (reg6) into reg1
copy 6 1

# add reg 1 and 2, store the result in reg3
add

#copy result from reg3 into reg2
copy 3 2

# loop back to start if the value is not negative
start
eval >=

# Once the value overflows and becomes negative send the result to the output
copy 3 6
```

In the simple program above, the value 1 is continuously being fed into the CPU. At each iteration we add it to the value stored in register 2, so that we increment the value by 1. Eventually the value grows large enough that it overflows and becomes negative. This is because in binary the most significant bit (MSB) is used to represent negative numbers. Once this happens the program stops running.


## Conclusion

{% raw %}
<center>
<img src="norway.jpeg" alt="NORway">
<p><small>NOR-way</small></p>
</center>
{% endraw %}

I thought this was quite a fun project, I certainly learnt a lot. While it may seem a little complicated, the truth is that by playing Turing Complete, you learn in a very intuitive manner. I can highly recommend it. If you want to write your own program or take a look at the code, it is all available on my [github](https://github.com/BasedLukas/cpu_simulator).


<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#old-cpu-post" aria-expanded="false" aria-controls="collapse">
Hide Blog Post
</button>

</div>



