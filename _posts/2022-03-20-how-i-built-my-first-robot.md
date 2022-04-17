---
layout: post
title:  "My first robotics project"
date:   2022-03-20 10:19:00 +0800
tags: robotics esp32 docker flask
categories: 
comments_id: 1
---
### I was once a child
So, who never dreamt of creating their own robot either ride one or create their own.
Well I'm sure I'm a part of that group that wants one on my own.
Who knew that with what we have in our time building one is harder than it looks.

I grew up watching the classic cartoon Dexters Laboratory, where the main character Dexter often times uses a wrench to tighten some bolts and nuts then voila an invention is made which includes a giant robot or the backpack exoskeleton, that look really cool during my childhood and still looks kinda cool today.

### Backstory
This past few months I actually had a hard time coping with the current events happening to the world, the pandemic happened and is supposed to be nearing its end during the time of this posting. The lockdowns imposed everywhere limits most activities. I had a chance to move jobs into a less strict and slightly higher compensating company, with the extra income I'm earning, more spare time I have due to less commute, and the mass adaptation of online shopping and ecommerce in the country, I found out that I can revive a hobby that I actually liked and can do to pass this pandemic.

I was once interested in iot devices as influenced by a former colleague of mine, we used to ride the bus home together, and often time he would tell me stories of the projects they used to have during college mostly prototypes done with arduino and servo motors. I took IT as my course during my times in the university my colleague took ECE meaning I really don't have any background into real electronics projects, I was in awe hearing what students were capable of doing without prior work experience.

I started out with some Arduinos and servo motors back in 2014, I really had no idea what I was doing back then(I think I understood more today) I was able to do the blink program with some LED lights, burnt some of them because I didn't know that LED lights actually needs some resistance to lower the voltage passing through them, and I was even able to run the servo motors I bought but didn't quite understand why the microcontroller I was using was not powering the servo enough(I was supplying power to the servo from the arduino).

That phase didn't last very long though, as the time, resource and parts stores are not accessible to me(I'm living in the province outside the main cities).

### Electronics then Robotics
After moving to my new job and getting my last payment from my last employer, I had a chance to get me a 3D Printer, an Ender 3 Max, the one with the 30x30x34 build dimension. Having never experienced in using one, I had so many problems using the machine specially levelling the printer but with some research and perseverance, I bought an autoleveler and it really helped me with the leveling problems, another mistake I made is that I searched for strong materials to print with, I found out that ABS was quite stronger and heat resistant compared to PLA, so I bought and used ABS as my first printing filament and later found out that printing with ABS is significantly more difficult compared to printing in PLA, it's like starting out a game on a higher difficulty, I was able to print some projects with the ABS filament, and am currently using the first working project I ever made with electronics and the 3D printer, a redox keyboard.

During the earlier months of the pandemic, I was blessed with the youtube algorithm, of a channel that I took interest real fast, Zack Freedman. An electronics project and vlog channel where Zack explains projects he made with some nerd humor that I found hilarious, it is actually his channel that gave me the idea of getting a 3D printer, and start a basic project that includes electronics. A mechanical keyboard, in his video he showed how to get the 3D models and how to handwire and configure the keyboard in QMK. One keyboard he showcased was the Dactyl Manuform, its a split keyboard with an ergonomic design and as said by Zack, could protect your chasity just by owning one, with knowledge in 3d printing and the ABS filament I have, I was able to print the frame of a redox keyboard a simpler keyboard design with split but flat frames(I didn't understand how supports work in 3D printing before).

During that project I was able to work on hand soldering different electronic components, understood how diodes works, know what a parallel connection is and event got to explore flashing firmwares into a microcontroller like an arduino or teensy. Building that project felt so good, it actually brings my inner child excitement out even though it included burning my hand, getting frustrated debugging flawed key switches and thinking that I wasn't very good at soldering, turns out you shouldn't buy a soldering iron kit thats worth around $4.

So yeah I started with a difficult printing material and a hardly working soldering iron, which I think kind of helped me in the process, because I managed to experience difficult times as a beginner.

### Micro ROS and ESP32
During my time in my previous employer, I had a chance to join a hackathon, something that includes moving a retail robot into a virtual store, most api and i/o from the simulated robot is already provided, the 3d simulated retail store is actually amazing as the robot actually moves based on the api and documentation provided in the hackathon challenge, me and my team managed to get to the implementation phase, meaning we submitted an idea that the judges found interesting, but due to the lack of experties and implementation time, we weren't able to create a minimal prototype and lost the hackathon and some sleep, but I did gain something from that, the idea that ROS or Robot Operating System exists and its open source.

It was only this year, that I was able to checkout ROS again ever since that hackathon ended, I found out that in order to make the robots work with ROS you need some kind of linux machine attached to your hardware that interfaces with the sensors you want to use in your robot. I was one of the lucky ones that got my hand into Raspberry Pi 4 with 8GB of RAM with the price near the retail, the pandemic took a hard hit into the silicon manufacturing and drove prices of even RPis too high it would have been the perfect candidate for the job. That sucks, as one would need to invest in a full pledged machines or overpriced raspberry pis just to start a hobby in creating robots with ROS. Thats where Micro ROS come into play.

Luckily theres a new project in the ROS community, MicroROS, a ROS implementation embedded into mid ranged and cheaper microcontroller like the ESP32 which has bluetooth and WiFi built in the system, its very convenient as you won't need any external modules for connection, all you have to do now is to implement MicroROS into it and hope that everything works according to the documentation.

I have a very simple understand of how ROS works, in terms of topic and publisher ROS documenation explains it very straight forward, where a certain subscriber, in our case the robot, subscribes to a given topic and another node publishes information, this way a remote brain operator can send instructions to a robot and the robot using data from sensors can communicate back to the remote brain operator.
![ROS2 Topics](/assets/20220320/Topic-SinglePublisherandSingleSubscriber.gif "ROS2 Topic explained")
*ROS2 Topics from https://docs.ros.org/en/foxy/Tutorials/Topics/Understanding-ROS2-Topics.html*

Simple right? All I have to do now is to create a subscriber and publish data from another node then my robot would be able to move. Luckily I was on a windows machine, so building the firmware with ROS libraries for the ESP32 is not possible, So I had to be creative, good thing I'm doing software engineering as a profession, and I have some knowledge how to use Docker, so I created a simple docker image with all the prerequisite of building a firmware and mounting my firmware code.

The actual image I'm using to build the ESP32 firmware, ran the build image with the name *rosrunner* for below Dockerfile:
{% highlight Docker %}
FROM ros:foxy

ENV ROS_DISTRO=foxy
SHELL ["/bin/bash", "-c"]

RUN . /opt/ros/$ROS_DISTRO/setup.bash

RUN mkdir /microros_ws
WORKDIR /microros_ws
RUN git clone -b $ROS_DISTRO https://github.com/micro-ROS/micro_ros_setup.git src/micro_ros_setup
RUN sudo apt update && rosdep update
RUN rosdep install --from-path src --ignore-src -y
RUN sudo apt-get install python3-pip -y
RUN rm /usr/src/gtest && rm /usr/src/gmock
RUN source /opt/ros/$ROS_DISTRO/setup.bash && colcon build
RUN source /opt/ros/$ROS_DISTRO/setup.bash && source install/local_setup.bash && ros2 run micro_ros_setup create_firmware_ws.sh freertos esp32
{% endhighlight %}

Good thing I was using Docker on a windows machine, because as of writing this, theres actually no way of forwarding serial connection from the host machine to the docker container, So I did install esp32 idf just so that I can upload the Hello World counterpart of micro ros installation on an ESP32 found [here][esp32-microros]. I encountered a problem with the communication from the ESP32 to the docker container in my windows machine, maybe some networking issues as `--net==host` didn't work as expected. I didn't actually put too much effort into fixing it as I have a work around, I instead forwarded the port of the agent and got it working the second time as I needed to specify that in the creation of the int32_publisher udp was used.

`docker run -it --rm -p 8888:8888/udp microros/micro-ros-agent:foxy udp4 --port 8888 -v6`

So far so good, next is I need some kind of chasis and a way of moving the robot with, I once used a N298L motor driver in a previous project I worked on, the idea is simple its an HBridge where you can on and off the pins that the power is coming from an external source, its switches(transistors) grouped together to avoid short circuiting the flow of electricity, commonly used for RC projects, next is the robot chasis, I have a former colleague sold me a robot building kit she got for her birthday, so I used that along with the DC motors and track conveyor belt wheels, mounting the motor driver and the ESP32 is done by printing extra parts, good thing I have a 3D Printer.

The actual robot looks like this:
![ESP32 Robot](/assets/20220320/20220320_234517.jpg "ESP32 Robot")
*ESP32 Robot*

For the subscriber code that I used in this robot, the code can be found [here][esp32-subscriber], the code is very primitive, as it doesn't actually compute any linear/angular movements in controlling the motor driver, it simply just switches the wheels to move forward or backward at the same time or move them seperate ways in order to turn based on a positive or negative input from the topic.

Next is I had to make an API for publishing to the brain node of the setup. So I decided to make a very simple api written in flask to expose a GET api that expects a **dir** or direction parameter so that it could be published into the ROS environment. code for that server is found [here][ros-flask-publisher]. I used the same image for creating the agent for the ROS environment, since I wasn't be able to make the `ROS_DOMAIN_ID` work and I didn't put any more effort into making it work. I used docker-compose here as I wanted to be able to change my code while the container is still running and mounting is the solution, I put the docker image in its own directory so that changes on my code would trigger a rebuild.

to run the server for the controller just do:

`docker-compose up`

then inside the container, run

`cd /app && python3 main.py`

The message publisher api should run at port **5000**, the default of flask

Lastly I needed an interface, that would interact with the physical world or user, I'm also quite talented in creating apps and by this time I'm already tired and running out of time for this weekend project. So I created the very intuitive and innovative android app for controlling my robot, that looks like this:

![Teleop App](/assets/20220320/Screenshot_20220321-002035_teleop_android.jpg "Teleop App")
*Teleop App code [here][ros-controller-app]* 

So basically the diagram between the communication from app controller to the robot is as follows:
![Dataflow](/assets/20220320/dfd.png "Dataflow")
*Dataflow*

Lastly, here's the demo of the robot being controlled via the app. [video][video-demo]

[esp32-microros]: https://micro.ros.org/blog/2020/08/27/esp32
[esp32-subscriber]: https://github.com/jcnecio/esp32-microros/tree/master/ros
[ros-flask-publisher]: https://github.com/jcnecio/esp32-microros/tree/master/teleop_server
[ros-controller-app]: https://github.com/jcnecio/esp32-microros/tree/master/teleop_android
[video-demo]: https://youtu.be/_-BVPfUlOzg