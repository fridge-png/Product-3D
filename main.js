import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader";

const scene = new THREE.Scene();

const dimensions = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const objloader = new OBJLoader();
const mtlloader = new MTLLoader();

var mesh;
var material;
mtlloader.load(
  // resource URL
  "models/Dizzy.mtl",
  function (mats) {
    mats.preload()
    objloader.setMaterials(mats)
    objloader.load(
      "models/Dizzy.obj",
      function (object) {
        scene.add(object);
      }
    );
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened");
  }
);


const light = new THREE.PointLight(0xffffff, 1000);
light.position.set(10, 10, 10);
const light2 = new THREE.PointLight(0xffffff, 500);
light2.position.set(-10, -10, -10);
scene.add(light);
scene.add(light2);

const camera = new THREE.PerspectiveCamera(
  45,
  dimensions.width / dimensions.height,
  0.1,
  100
);
camera.position.z = 1;
scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(dimensions.width, dimensions.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 3;
controls;

window.addEventListener("resize", () => {
  dimensions.width = window.innerWidth;
  dimensions.height = window.innerHeight;
  camera.updateProjectionMatrix();
  camera.aspect = dimensions.width / dimensions.height;
  renderer.setSize(dimensions.width, dimensions.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

const t1 = gsap.timeline({ defaults: { duration: 1 } });
// t1.fromTo(mesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
t1.fromTo("nav", { y: "-100%" }, { y: "0%" });
t1.fromTo(".title", { opacity: 0 }, { opacity: 1 });

let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => {
  mouseDown = true;
});
window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / dimensions.width) * 255),
      Math.round((e.pageY / dimensions.height) * 255),
      150,
    ];
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(light.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
