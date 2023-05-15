import {MarchingSquares} from './debug/marching-squares.js';
import { ISOSurface2DGenerator } from './debug/iso-surface-2d-generator.js';
import { GrayscaleISOContourLUT } from './debug/grayscale-iso-contour-lut.js';
import { CanvasShapeDrawer } from './debug/canvas-shape-drawer.js';

window.marchinsquares = {
  shapeDrawer: undefined,
  marchingSquares: undefined,
  isoContourLUT: GrayscaleISOContourLUT,
  offCanvas: undefined,
  offCanvasCtx: undefined,
  offCanvasData: undefined,
  colors: Uint32Array,
  field: Uint32Array,
  drawingWay: 'lines',
  activeTab: '',
  isoSurfaceGenerator: ISOSurface2DGenerator,

  // Preparing colors and LUT's
  init: function() {

    // Set precalculated colors as "abgr".
    // These colors can be used as thresholds. 
    this.colors = new Uint32Array(5);
    // white smoke color
    this.colors[0] = (255 << 24) + (240 << 16) + (240 << 8) + 240;
    // black color
    this.colors[1] = 255 << 24;
    // pink color
    this.colors[2] = (255 << 24) + (255 << 16) + (0 << 8) + 123;
    // white smoke 2 color
    this.colors[3] = (255 << 24) + (249 << 16) + (249 << 8) + 249;
    // gray color
    this.colors[4] = (255 << 24) + (127 << 16) + (127 << 8) + 127;

    return this;
  },
  // Show content when switching tabs
  openTab: function(name) {
      // Declare all variables
      let i, tabcontent, tablinks;
      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
      }
      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(name).style.display = "block";
      document.getElementById(name).className += " active";

      this.activeTab = name;
      this.initTab();
  },

  // Initializing onscreen canvas
  initOnScreenCanvas: function(width, height) {
    const onCanvas = document.getElementById('onscreencanvas');
    onCanvas.width = width;
    onCanvas.height = height;

    this.shapeDrawer = new CanvasShapeDrawer(onCanvas.getContext("2d"));
    this.marchingSquares = new MarchingSquares(this.shapeDrawer);
    this.marchingSquares.resolution = parseInt(document.getElementById('resRange').value);
  },

  // Initializing offscreen canvas
  initOffScreenCanvas: function(width, height) {
    this.offCanvas = document.getElementById('offscreencanvas');
    this.offCanvasCtx = this.offCanvas.getContext("2d");
    this.offCanvas.width = width;
    this.offCanvas.height = height;
  },

  // Uploading test image for offscreen canvas
  initImgElement: function(imgName, width, height, ready = ()=>{}) {
    // Create new image and then draw its data on canvas
    const newImg = new Image(width, height);
    newImg.onload = (ev) => {
      this.offCanvasCtx.drawImage(newImg, 0, 0);
      const arrayBuffer = this.offCanvasCtx.getImageData(0, 0, width, height).data.buffer;
      this.field = new Uint32Array(arrayBuffer);
      ready();
    };
    newImg.src = imgName;
  },

  initTab: function() {
    this.resolution = parseInt(document.getElementById('resRange').value);
    switch (this.activeTab) {
      case 'Arbitrary': {
        if(this.offCanvas) {
          // Clear offscreen canvas if we had already drawn a picture
          this.offCanvasCtx.clearRect(0, 0, this.offCanvas.width, this.offCanvas.height);
        }
        // OnScreen Canvas we will be use for drawing our lines, etc.
        this.initOnScreenCanvas(500, 500);

        this.isoContourLUT = new GrayscaleISOContourLUT(500 * 500);
        this.isoContourLUT.generateRandom();
        this.offCanvasData = new Uint32Array(500 * 500);
        for (let i = 0; i < this.offCanvasData.length; i++) {
          const value = Math.floor(Math.random() * 255);
          this.offCanvasData[i] = (255 << 24) + (value << 16) + (value << 8) + value;
        }
        this.draw(this.resolution);
      } break;
      case 'Tooth_Picture': {
        // OnScreen Canvas we will be use for drawing our image on it, etc.
        this.initOffScreenCanvas(520, 520);

        // OnScreen Canvas we will be use for drawing our lines, etc.
        this.initOnScreenCanvas(this.offCanvas.width, this.offCanvas.height);

        // Init image element and draw its image on the canvas.
        this.initImgElement('./pictures/tooth.jpg', this.offCanvas.width, this.offCanvas.height, ()=>{

          this.offCanvasData = this.offCanvasCtx.getImageData(0, 0, this.offCanvas.width, this.offCanvas.height).data.buffer;
          this.isoContourLUT = new GrayscaleISOContourLUT(256);
          this.isoContourLUT.generate(240, 'more');

          this.marchingSquares.isoValue = 240;
          this.draw(this.resolution);
        });
      } break;
      case 'Asteroid_Picture': {
        // OnScreen Canvas we will be use for drawing our image on it, etc.
        this.initOffScreenCanvas(680, 431);
        
        // OnScreen Canvas we will be use for drawing our lines, etc.
        this.initOnScreenCanvas(this.offCanvas.width, this.offCanvas.height);
        
        // Init image element and draw its image on the canvas.
        this.initImgElement('./pictures/mu69.png', this.offCanvas.width, this.offCanvas.height, ()=>{
          
        this.offCanvasData = this.offCanvasCtx.getImageData(0, 0, this.offCanvas.width, this.offCanvas.height).data.buffer;
        // this.isoSurfaceGenerator = new ISOSurface2DGenerator(new Uint32Array(this.offCanvasData), this.offCanvas.width, this.offCanvas.height);
        // this.isoSurfaceGenerator.threshold = this.colors[1];
        // this.isoSurfaceGenerator.comparisonType = 2;
        this.isoContourLUT = new GrayscaleISOContourLUT(256);
        this.isoContourLUT.generate(0, 'more');
        this.marchingSquares.isoValue = 0;
        this.draw(this.resolution);
        });
      } break;
      case 'Letter_Picture': {
        // OnScreen Canvas we will be use for drawing our image on it, etc.
        this.initOffScreenCanvas(500, 500);

        // OnScreen Canvas we will be use for drawing our lines, etc.
        this.initOnScreenCanvas(500, 500);

        // Init image element and draw its image on the canvas.
        this.initImgElement('./pictures/h.png', 500, 500, ()=> {

          this.offCanvasData = this.offCanvasCtx.getImageData(0, 0, this.offCanvas.width, this.offCanvas.height).data.buffer;
          // this.isoSurfaceGenerator = new ISOSurface2DGenerator(new Uint32Array(this.offCanvasData), this.offCanvas.width, this.offCanvas.height);
          // this.isoSurfaceGenerator.threshold = this.colors[0];
          // this.isoSurfaceGenerator.comparisonType = 0;
          this.isoContourLUT = new GrayscaleISOContourLUT(256);
          this.isoContourLUT.generate(127, 'equal');
          this.marchingSquares.isoValue = 127;
          this.draw(this.resolution);
        });
      } break;
      default:
        break;
    }
  },
  draw: function() {
    this.marchingSquares.color = 'rgb(123, 0, 255, 255)';
    this.marchingSquares.isoContourLUT = this.isoContourLUT.lut;
    this.marchingSquares.scalarGrid = new Uint32Array(this.offCanvasData);

    switch (this.drawingWay) {
      case 'lines': {
        this.marchingSquares.drawLines();
      } break;
      case 'triangles': {
        this.marchingSquares.isoContourLUT = this.isoContourLUT.lut;
        this.marchingSquares.scalarGrid = new Uint32Array(this.offCanvasData);
        this.marchingSquares.drawTriangles();
      } break;
      case 'dots': {
        this.marchingSquares.drawDots();
      } break;
      default:
        break;
    }
  },
  setResolution: function(res) {
    document.getElementById('resValue').textContent = res;
    this.marchingSquares.resolution = parseInt(res);
    this.draw();
  }, 
  setDrawingWay: function(type) {
    const radioBtns = document.getElementsByClassName("radioBtn");
    for (let i = 0; i < radioBtns.length; i++) {
      radioBtns[i].checked = false;
    }
    document.getElementById(type).checked = true;

    this.drawingWay = type;

    if(type === 'dots') {
      document.getElementById('filled').checked = false;
      document.getElementById('interpolation').checked = false;
      this.marchingSquares.useInterpolation = false;
      this.shapeDrawer.filled = false;
    }

    this.draw();
  },

  setInterpolation: function() {
    const input = document.getElementById('interpolation');
    if(this.drawingWay === 'dots' || this.activeTab === 'Arbitrary') {
      
      input.checked = false;
      this.marchingSquares.useInterpolation = input.checked;
      return;
    }

    this.marchingSquares.useInterpolation = input.checked;
    this.draw(this.resolution);
  },

  setFilled: function() {
    const input = document.getElementById('filled');
    if(this.drawingWay === 'lines' || this.drawingWay === 'dots') {
      input.checked = false;
      return;
    }
    this.shapeDrawer.filled = input.checked;
    this.draw(this.resolution);
  }
}