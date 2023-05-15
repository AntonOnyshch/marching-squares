# Marching squares

This algorithm is widely used for drawing a contour line around some discrete data.

Reason i made this project to is to understand this algorithm and later had add some features like drawing triangles and interpolization for more smooth contours.


## Example


https://github.com/AntonOnyshch/marching-squares/assets/58116769/6ebe3870-8ba9-4b3a-b120-3eee5ee9a802



## Features

- Draw arbitrary dots and contour around them
- Draw lines, triangles. Including filled triangles
- Use interpolation for smooth lines
- Ability to tune resolution
- Several random pictures to see different results

## Structure of the project
1. Shape drawer interface and Canvas shape drawer class. This was made for separating drawing logig from main algorithm.
2. Look Up Table for grayscale images. Purpose of this is contain table where for example if you have isovalue of 240(bright color in rgb) you would have table where all pixels below this level will have 0 and under will have 1. And because i work with *.dcm images which are just grayscale(imagine you need seek bright color in all 500 images) that's what i need.
3. Isosurface-2d-generator which can generate separate isosurface for any image, not only grayscale.
4. The Marching Squares class itself.

## Additional materials

- [The Coding Train](https://www.youtube.com/watch?v=0ZONMNUKTfU) - the best video for entering into marching squares


## How to use
You need first install "http-server" npm package. Or use global one if you have.
```sh
npm install
http-server ./
```
