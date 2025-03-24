import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/DRACOLoader.js"; // Thêm DRACOLoader
import { gsap } from "https://cdn.skypack.dev/gsap";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import * as dat from "https://cdn.skypack.dev/dat.gui";

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 25;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container-3d").appendChild(renderer.domElement);

const scene = new THREE.Scene();
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

let watch;
let mixer;

// Khởi tạo GLTFLoader và DRACOLoader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // Đường dẫn đến file giải nén Draco
loader.setDRACOLoader(dracoLoader); // Gắn DRACOLoader vào GLTFLoader

loader.load(
  "./model.glb",
  function (gltf) {
    watch = gltf.scene;
    watch.position.set(-0, -1, 20); // Vị trí ban đầu
    scene.add(watch);

    // mixer = new THREE.AnimationMixer(watch);
    // mixer.clipAction(gltf.animations[0]).play();
    console.log(gltf.animations);

    // Tạo panel điều khiển với dat.GUI
    // const gui = new dat.GUI();
    // const positionFolder = gui.addFolder("Position");
    // positionFolder.add(watch.position, "x", -100, 100).name("X");
    // positionFolder.add(watch.position, "y", -100, 100).name("Y");
    // positionFolder.add(watch.position, "z", -100, 100).name("Z");
    // positionFolder.open();

    // const rotationFolder = gui.addFolder("Rotation");
    // rotationFolder
    //   .add(watch.rotation, "x", -Math.PI, Math.PI)
    //   .name("X")
    //   .step(0.01);
    // rotationFolder
    //   .add(watch.rotation, "y", -Math.PI, Math.PI)
    //   .name("Y")
    //   .step(0.01);
    // rotationFolder
    //   .add(watch.rotation, "z", -Math.PI, Math.PI)
    //   .name("Z")
    //   .step(0.01);
    // rotationFolder.open();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); // Theo dõi tiến trình tải
  },
  function (error) {
    console.error("Error loading GLTF model:", error);
  }
);

let arrPositionModel = [
  {
    id: "banner",
    position: { x: 0, y: -1, z: 20 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: "info",
    position: { x: -1, y: -0.1, z: 20 },
    rotation: { x: 0.5, y: 0, z: 0 },
  },
  {
    id: "design",
    position: { x: 1.5, y: 0, z: 19 },
    rotation: { x: 1.8, y: -1.73, z: 1.67 },
  },
  {
    id: "about",
    position: { x: 0.5, y: 0, z: 20 },
    rotation: { x: 0.7, y: -3.14, z: 2.4 },
  },
  {
    id: "end",
    position: { x: 0, y: 0, z: 20 },
    rotation: { x: -2.5, y: -2.64, z: -3.04 },
  },
];
const modelMove = () => {
  const sections = document.querySelectorAll("section");
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });
  let position_active = arrPositionModel.findIndex(
    (val) => val.id == currentSection
  );
  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    gsap.to(watch.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 1,
      //   ease: "power1.out",
    });
    gsap.to(watch.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 1,
      //   ease: "power1.out",
    });
  }
};
window.addEventListener("scroll", () => {
  if (watch) {
    modelMove();
  }
});
const reRender3d = () => {
  requestAnimationFrame(reRender3d);
  renderer.render(scene, camera);
  //   controls.update();
};
reRender3d();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
