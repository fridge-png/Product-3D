import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const scene = new THREE.Scene();

const dimensions = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const loader = new OBJLoader();

// const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);
// load a resource

var mesh;
loader.load(
	// resource URL
	'models/test.obj',
    function ( object ) {
        object.traverse(function(child){
            if (child instanceof THREE.Mesh){
                console.log(child)
                child.material = material
                mesh = child
            }
        })
        // mesh = object
        // object.material = material
        // mesh = new THREE.Mesh(object.,material)
        
		scene.add( mesh );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
)




const light = new THREE.PointLight(0xffffff, 300);
light.position.set(10, 10, 10);
const light2 = new THREE.PointLight(0xffffff, 300);
light2.position.set(10, 20, -10);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  45,
  dimensions.width / dimensions.height,
  0.1,
  100
);
camera.position.z = 10;
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
controls.autoRotateSpeed = 5;
controls

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
let rgb = []
window.addEventListener("mousedown", () => {
  mouseDown = true;
});
window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener('mousemove', (e) => {
    if (mouseDown){
        rgb = [Math.round((e.pageX / dimensions.width)*255),Math.round((e.pageY / dimensions.height)*255),150]
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(mesh.material.color,{r:newColor.r,g:newColor.g,b:newColor.b})
    }
})
