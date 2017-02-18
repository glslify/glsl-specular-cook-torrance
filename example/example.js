'use strict'

var glsl = require('glslify')
var drawTriangle = require('a-big-triangle')
var createShader = require('gl-shader')

var vert = glsl`
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(position,0,1);
}`

var frag = glsl`
precision mediump float;
#pragma glslify: specular = require(../index.glsl)
varying vec2 uv;
uniform vec3 lightPosition;
void main() {
  float r = sqrt(dot(uv,uv));
  float theta = atan(uv.y,uv.x);
  float phi   = asin(r);
  vec3 normal = vec3(\
    cos(theta)*sin(phi),\
    sin(theta)*sin(phi),\
    -cos(phi));
  vec3 position = vec3(normal.xy, normal.z+5.0);
  vec3 eyeDir = normalize(-position);
  vec3 lightDir = normalize(lightPosition - position);
  if(r > 1.0 || dot(normal,eyeDir)<0.0) {
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
  } else {
    float power = 10.0 * specular(lightDir, eyeDir, normal, 0.2, 1.0);
    gl_FragColor = vec4(power,power,power, 1.0);
  }
}`

var canvas = document.createElement('canvas')
canvas.width          = window.innerWidth
canvas.height         = window.innerHeight
canvas.style.left     = "0px"
canvas.style.top      = "0px"
canvas.style.position = "absolute"
document.body.appendChild(canvas)

var gl = canvas.getContext('webgl')
var shader = createShader(gl, vert, frag)

function render() {
  shader.bind()
  var theta = Date.now()*0.0005
  var x = Math.cos(theta)
  var y = Math.sin(theta)
  shader.uniforms.lightPosition = [100.0*x, 10.0, 100.0*y]
  drawTriangle(gl)
  requestAnimationFrame(render)
}

render()
