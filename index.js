import {MarchingSquares} from './debug/marching-squares.js';

window.marchinsquares = {
  onCanvas: undefined,
  onCanvasCtx: undefined,
  offCanvas: undefined,
  offCanvasCtx: undefined,
  resolution: 0,
  threshold: 0,
  comparison: 0,
  colors: Uint32Array,
  linesLUT: Uint32Array,
  trianglesLUT: Uint32Array,
  field: Uint32Array,
  marchingsquares: MarchingSquares,
  drawingWay: 0,
  activeTab: '',
  // Base init function
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

    // Precalculated Look Up Table for stroke grid.
    this.linesLUT = MarchingSquares.getLinesLUT();
    // Precalculated Look Up Table for filled grid.
    this.trianglesLUT = MarchingSquares.getTriangleLUT();

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
    this.onCanvas = document.getElementById('onscreencanvas');
    this.onCanvasCtx = this.onCanvas.getContext("2d");
    this.onCanvas.width = width;
    this.onCanvas.height = height;
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

        // Fill arbitrary field by random numbers.
        this.field = new Uint32Array((this.onCanvas.width + 1) * (this.onCanvas.height + 1));
        for (let i = 0; i < this.field.length; i++) {
          this.field[i] = Math.floor(Math.random() * Math.floor(2));
        }

        // Set threshold
        this.threshold = 1;

        // Set comparion type to ">"
        this.comparison = 0;

        // Call draw method
        this.draw(this.resolution);
      }
      break;
      case 'Tooth_Picture': {
        // OnScreen Canvas we will be use for drawing our image on it, etc.
        this.initOffScreenCanvas(520, 520);

        // OnScreen Canvas we will be use for drawing our lines, etc.
        this.initOnScreenCanvas(this.offCanvas.width, this.offCanvas.height);

        // Init image element and draw its image on the canvas.
        this.initImgElement('./pictures/tooth.jpg', this.offCanvas.width, this.offCanvas.height, ()=>{
          // Set threshold
          this.threshold = this.colors[0];

          // Set comparion type to ">"
          this.comparison = 0;

          // Call draw method
          this.draw(this.resolution);
        });
      }
      break;
      case 'Asteroid_Picture': {
        // OnScreen Canvas we will be use for drawing our image on it, etc.
        this.initOffScreenCanvas(680, 431);
        // OnScreen Canvas we will be use for drawing our lines, etc.
        this.initOnScreenCanvas(this.offCanvas.width, this.offCanvas.height);
        // Init image element and draw its image on the canvas.
        this.initImgElement('./pictures/mu69.png', this.offCanvas.width, this.offCanvas.height, ()=>{
          // Set threshold
          this.threshold = this.colors[1];
          
          // Set comparion type to ">"
          this.comparison = 0;

          // Call draw method
          this.draw(this.resolution);
        });
      }
      break;
      case 'Letter_Picture': {
        // OnScreen Canvas we will be use for drawing our image on it, etc.
        this.initOffScreenCanvas(500, 500);

        // OnScreen Canvas we will be use for drawing our lines, etc.
        this.initOnScreenCanvas(500, 500);

        // Init image element and draw its image on the canvas.
        this.initImgElement('./pictures/h.png', 500, 500, ()=>{
          // Set threshold
          this.threshold = this.colors[0];

          // Set comparion type to "<"
          this.comparison = 2;

          // Fill field from picture buffer for using it further
          this.fill_Field_From_Picture_Array();

          // Call draw method
          this.draw(this.resolution);
        });
      }
      break;
      default:
        break;
    }
  },
  draw: function(res) {
    document.getElementById('resValue').textContent = res;
    this.resolution = parseInt(res);
    this.fill_Field_From_Picture_Array();
    if(this.drawingWay === 0) {
      // Call draw method
      MarchingSquares.drawStrokeGrid(
        this.field,
        this.onCanvasCtx,
        this.onCanvas.width,
        this.onCanvas.height,
        this.resolution,
        this.threshold,
        'rgb(123, 0, 255, 255)',
        this.linesLUT
      )
    }
    else if(this.drawingWay === 1) {
      // Call draw method
      MarchingSquares.drawFilledGrid(
        this.field,
        this.onCanvasCtx,
        this.onCanvas.width,
        this.onCanvas.height,
        this.resolution,
        this.threshold,
        'rgb(123, 0, 255, 255)',
        this.trianglesLUT
      )
    }
    else {
      // Call draw method
      MarchingSquares.drawDotGrid(
        this.field,
        this.onCanvasCtx,
        this.onCanvas.width,
        this.onCanvas.height,
        this.resolution,
        this.threshold,
        'rgb(123, 0, 255, 255)'
      )
    }
  },
  setDrawingWay: function(index = 0) {
    const radioBtns = document.getElementsByClassName("radioBtn");
    for (let i = 0; i < radioBtns.length; i++) {
      radioBtns[i].checked = false;
    }

    radioBtns[index].checked = true;

    this.drawingWay = index;
    this.draw(document.getElementById('resRange').value);
  },
  fill_Field_From_Picture_Array: function() {
    if(this.activeTab === 'Arbitrary') return;
    const off_cvs = this.offCanvas;
    const buffer = this.offCanvasCtx.getImageData(0, 0, off_cvs.width, off_cvs.height).data.buffer;
    const array = new Uint32Array(buffer);
    const resl = this.resolution;
    const rows = Math.round(off_cvs.width / resl);
    const cols = Math.round(off_cvs.height / resl);
    const ths = this.threshold;
    this.field = new Uint32Array(rows * cols);
    const stride = resl * off_cvs.width;
    let j = 0;
    if(this.comparison === 0) {
      for (let i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
          if(array[i * stride + j * resl] > ths) {
            this.field[i * rows + j] = 1;
          }
        }
      }
    }
    else if(this.comparison === 1) {
      for (let i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
          if(array[i * stride + j * resl] === ths) {
            this.field[i * rows + j] = 1;
          }
        }
      }
    }
    else {
      for (let i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
          if(array[i * stride + j * resl] < ths) {
            this.field[i * rows + j] = 1;
          }
        }
      }
    }
  }
}
