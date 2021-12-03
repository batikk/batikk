// Copyright (c) 2018 ml5
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Style Transfer Image Example using p5.js
This uses a pre-trained model of The Great Wave off Kanagawa and Udnie (Young American Girl, The Dance)
=== */

let style;
let video;
let resultImg;

let loading = false;

let displayImage = [];

let x1 = 165;
let y1 = 195;
let x2 = 165;
let y2 = 455;
let x3 = 1135;
let y3 = 195;
let x4 = 1135;
let y4 = 455;
let r = 230;
let pressState = 0;

let myFont;

function preload(){
  displayImage.push(loadImage('images/1.jpg'));
  displayImage.push(loadImage('images/2.jpg'));
  displayImage.push(loadImage('images/3.jpg'));
  displayImage.push(loadImage('images/4.jpg'));
  myFont = loadFont('f.ttf');
}

function setup() {
  createCanvas(1300, 700);

  video = createCapture(VIDEO);
  video.hide();

  style = ml5.styleTransfer('models/batik1', video, modelLoaded);
  pixelDensity(1);
  imageMode(CENTER);
  rectMode(CENTER);
  textAlign(CENTER);
}

function draw(){
  textFont(myFont);
  background(240);
  image(displayImage[0],x1,y1,r,r);
  image(displayImage[1],x2,y2,r,r);
  image(displayImage[2],x3,y3,r,r);
  image(displayImage[3],x4,y4,r,r);
  fill(40);
  textSize(22);
  text("Live Batik Painting",width/2,610);
  text("Malaysia Batik",x1,610);
  text("Chinese Batik",x3,610);

  if(loading){
    textSize(20);
    text("Loading Model...",width/2,height/2);
  }

  if(dist(x1,y1,mouseX,mouseY) < r/2){
    fill(255,100);
    rect(x1,y1,r,r);
    pressState = 1;
  }else if(dist(x2,y2,mouseX,mouseY) < r/2){
    fill(255,100);
    rect(x2,y2,r,r);
    pressState = 2;
  }else if(dist(x3,y3,mouseX,mouseY) < r/2){
    fill(255,100);
    rect(x3,y3,r,r);
    pressState = 3;
  }else if(dist(x4,y4,mouseX,mouseY) < r/2){
    fill(255,100);
    rect(x4,y4,r,r);
    pressState = 4;
  }else{
    pressState = 0;
  }


  push();
  translate(335,90);
  if(resultImg != null && !loading){
    resultImg.resize(640,480);
    resultImg.loadPixels();
    video.loadPixels();
    for (let y = 0; y < video.height; y ++) {
      for (let x = 0; x < video.width; x ++) {
        let index = (x + y * video.width) * 4;
        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        let bri = (r + g + b) / 3;
        noStroke();
        if (bri < 50) {
          let style_r = resultImg.pixels[index + 0];
          let style_g = resultImg.pixels[index + 1];
          let style_b = resultImg.pixels[index + 2];
          fill(color(style_r,style_g,style_b));
          ellipse(x,y,1,1);
        }
      }
    }  
  }
  pop();
  
}

// A function to call when the model has been loaded.
function modelLoaded() {
  console.log("loaded");
  loading = false;
  style.transfer(gotResult);
}

// When we get the results, update the result image src
function gotResult(err, result) {
  if(!loading)
  {
    resultImg = loadImage(result.src);
    style.transfer(gotResult);
  }
   
}

function keyPressed(){
  loading = true;
  if(key == 'A'){
    style = ml5.styleTransfer('models/batik1', video, modelLoaded);
  }else if(key == 'S'){
    style = ml5.styleTransfer('models/batik2', video, modelLoaded);
  }else if(key == 'D'){
    style = ml5.styleTransfer('models/batik3', video, modelLoaded);
  }else if(key == 'F'){
    style = ml5.styleTransfer('models/batik4', video, modelLoaded);
  }
}

function mousePressed(){
  if(pressState == 1){
    loading = true;
    style = ml5.styleTransfer('models/batik1', video, modelLoaded);
  }else if(pressState == 2){
    loading = true;
    style = ml5.styleTransfer('models/batik3', video, modelLoaded);
  }else if(pressState == 3){
    loading = true;
    style = ml5.styleTransfer('models/batik2', video, modelLoaded);
  }else if(pressState == 4){
    loading = true;
    style = ml5.styleTransfer('models/batik4', video, modelLoaded);
  }
}