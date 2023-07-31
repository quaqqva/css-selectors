## 1st slide
Hello, today I would like to talk about SVGs and how we can create our own and animate them.

## 2nd slide
First of all, let’s talk about what is SVG and what are the advantages of this format (why does it exist in the first place).
SVG stands for Scalable Vector Graphic, it is an XML language for describing two-dimensional vector drawings. It is an open standard with specification that is being supported nowadays.

## 3rd slide
In terms of graphic formats we can differentiate between two main families, raster formats (PNG, JPEG...) and vector formats (SVG etc.). A vector format does not contain the image with set of pixels, but descriptive elements – or vectors – of that image, which a viewer will be able to use to construct the image described. In summary, a vector image will describe a line where a raster image will describe a set of points constituting a line.

## 4th slide
Here are main advantages of SVG format:
- SVGs are scalable: we can scale them bigger or smaller and be confident that we retain the same quality of the image;
- SVGs are zoomable by the same reason;
- SVGs are customizable: we can change properties of objects inside SVG document pretty smoothly and adjust the image to our needs;
- SVGs can be searched, scripted or indexed: we can change our SVG dynamically with programming languages and they are searched and indexed by browsers’ search engines.

## 5th slide
So, let’s talk about how can we create these vector images. Basic SVG structure looks like this: first of all, we declare XML version, because SVG documents are based on XML language. Then we declare the ```svg``` tag, specify namespace (to prevent names clashing), also we can specify ```width```, ```height``` of the SVG and other styles and inside the SVG tag we declare elements that we want to see in out image.

## 6th slide
Before we get to create shapes, SVGs’ coordinate system is needed to point out.  SVG uses a coordinate system or grid system similar to the one used by canvas. That is, the top left corner of the document is considered to be the point (0,0), or point of origin. Positions are then measured in pixels from the top left corner, with the positive x direction being to the right, and the positive y direction being to the bottom. We can specify objects position by setting appropriate attributes for coordinates (```x``` and ```y```).

## 7th slide
Now we are ready to discuss how we can create objects and display them in our image. There are a total of 7 basic shapes, let’s discuss every shape separately.

## 8th slide
Rectangle shape can be created with ```rect```. In the example, we specify our rectangle’s ```width```, ```height```, ```stroke``` and ```fill``` color and get the following image.

## 9th slide
Circle shape can be created with `circle` tag. Here we need to specify center coordinates width cx and cy attributes, radius with corresponding attribute, and in our example we also set background color with `fill` and we set stroke.

## 10th slide
Ellipses can be created with `ellipse` tag absolutely the same way as we created circle in the previous slide. The only difference is that radiuses are different on x and y axes, so we set them separately with `rx` and `ry` attributes.

## 11th slide
We can create lines with `line` attribute. To create it, we need to specify start and end points coordinates with ```x1```, ```y1``` being start and ```x2```, ```y2``` being end coordinates. To style it, we use stroke attributes.

## 12th slide
```polygon``` tag is used to create closed shapes by defining a set of points between which the lines are connected. The last point is always connected to the first.

## 13th slide
```polyline``` tag is used for almost the same thing, but it creates **open** shapes. In the example, we don’t have any line where the red stroke is not present.

## 14th slide
```path``` shape helps us to create more complicated shapes compared to the base ones. It uses a set of commands to draw the shapes. After each command, we specify coordinates to which point we use the command and draw a shape this way.

## 15th slide
Here is the example of drawing the path shape. We set a point at ```(100, 100)```, draw a line with the end of ```(200, 100)``` and for the rest we use a cubic Bezier curve, finalizing by the ```Z``` command. Each of this command can be lowercase, meaning that the specified coordinates are **relative** to the previous point.

## 16th slide
SVGs support both ```CSS``` and ```SMIL``` animations, in this presentation we are going to review how SMIL animations are created, because they are built-in in the SVG document.

## 17th slide
There are 3 types of SMIL animations: using ```animate```, ```animateTransform``` and ```animateMotion```, let’s discuss each of them separately.

## 18th slide
Here is also a list of commands we can use to change the animation to our needs:
- ```attributeName``` specifies the object’s property that we are animating;
- ```dur``` specifies animation’s duration;
- ```from```, ```to```, ```values``` specify animated property keyframes;
- ```repeatCount``` specifies how many iterations is going to be in our animation;
- ```repeatDur``` specifies for how long animation is repeating;
- ```begin``` specifies the event with which the animation starts;
- ```calcMode``` specifies the animation’s timing function.
  
## 19th slide
Here we use regular animation to animate circle’s center, we specify that the animation is infinite, animates center from ```0``` to ```500px``` in ```0.5s```.

## 20th slide
In the next example we use transform animation to rotate our rectangle. In the transform, we specify rotate degrees and transform origin in pixels from which the rectangle is rotated.

## 21th slide
And in the last example we use motion animation to make the blue square move by specified ```path```. We also set ```rotate="auto"``` so it turns around when needed.

## 22nd slide
Well, that’s all I have to say. Hope this presentation was useful for you and thank you very much for your attention. Bye bye!
