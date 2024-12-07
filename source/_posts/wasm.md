---
title: WASM
cover: img/bg.webp
share_cover: 2024-12-wasm/wasm.jpg
author: Lukas
subtitle: It's so over for JavaScript
mathjax: false
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

*Note: This game is based on a [previous blog post ](https://loreley.one/2023-07-cpu/) of mine. I've been playing around with WASM (Web Assembly) and decided to resuscitate my old python code. The way it works is that the entire python interpreter is bundled with the game in the browser (using pyodide). See [my github](https://github.com/BasedLukas/cpu_simulator) for the implementation.*

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

Arithmetic and logical operations use `reg1` and `reg2` as operands and store the result in `reg3`. Supported operations:
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
