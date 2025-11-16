import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import TWEEN from 'three/addons/libs/tween.module.min.js';

let stars, scene, camera, renderer, controls, mapPlane, arrow, clock = new THREE.Clock(), labelRenderer;
let openListDiv = null;
const container = document.getElementById('container');
const fadeOverlay = document.getElementById('fade');
let homePosition = { x: 0, y: 0, z: 50 };
let isReturningHome = true;
const labelData = [
  { id: 'label1', position: new THREE.Vector3(-36, 15, 0), file: 'dock1.html' },
  { id: 'label2', position: new THREE.Vector3(-5, 15, 0), file: 'dock2.html' },
  { id: 'label3', position: new THREE.Vector3(22, 5, 0), file: 'storage.html' },
  { id: 'label4', position: new THREE.Vector3(0, -6, 0), file: 'office.html' },
  { id: 'label5', position: new THREE.Vector3(-7.5, 28, 0), file: 'charging.html' },
  { id: 'label6', position: new THREE.Vector3(38, -10, 0), file: 'packing.html' },
  { id: 'label7', position: new THREE.Vector3(-12, 0, 0), file: 'dispatch.html' },
  { id: 'label8', position: new THREE.Vector3(38, 10, 0), file: 'canteen.html' }
];

const markersData = {
  offices: [
    {
      name: 'South Hub Office',
      list: ['Operations', 'HR', 'WHS', 'RME'],
      position: new THREE.Vector3(-2.4999999523162842, 5.651100707858248, 1.5707653222372282)
    },
    {
      name: 'Managers Office',
      list: ['Manager', 'Assistant Manager'],
      position: new THREE.Vector3(3.6615245159651106, -14.616085567827959, 12.642779646772503)
    }
  ],
  canteen: [
    {
      name: 'Main Canteen',
      list: ['Dining Area', 'Kitchen', 'Restrooms'],
      position: new THREE.Vector3(1.8026898796910413, -16.950322926226203, 13.917979327551857)
    },
    {
      name: 'North Hub Canteen',
      list: ['Dining Area', 'Kitchen', 'Restrooms'],
      position: new THREE.Vector3(12.8, 2.8596811296006477, 3.095724788038059)
    },
    {
      name: 'South Hub Canteen',
      list: ['Dining Area', 'Kitchen', 'Restrooms'],
      position: new THREE.Vector3(-2.4999999523162842, 5.651100707858248, 1.5707653222372282)
    }
  ],
  toilets: [
    {
      name: 'North Hub Toilets',
      list: ['Male', 'Female', 'Accessible'],
      position: new THREE.Vector3(12.8, 2.8596811296006477, 3.095724788038059)
    },
    {
      name: 'South Hub Toilets',
      list: ['Male', 'Female', 'Accessible'],
      position: new THREE.Vector3(-2.4999999523162842, 5.651100707858248, 1.5707653222372282)
    },
    {
      name: 'CRets Toilets',
      list: ['Male', 'Female', 'Accessible'],
      position: new THREE.Vector3(4.2379826266827925, 19.04517872654268, -7.797541863380945)
    },
    {
      name: 'Main Canteen Toilets',
      list: ['Male', 'Female', 'Accessible'],
      position: new THREE.Vector3(1.8026898796910413, -16.950322926226203, 13.917979327551857)
    }
  ],
  teams: [
    {
      name: 'South Hub',
      list: ['Operations', 'HR', 'WHS', 'RME'],
      position: new THREE.Vector3(-2.4999999523162842, 5.651100707858248, 1.5707653222372282)
    },
    {
      name: 'RME',
      list: ['RME Cage', 'Contractor Control'],
      position: new THREE.Vector3(0.6037369966506958, -12.466240859515464, 9.759073238857066)
      // position: new THREE.Vector3(5.312355041503906, 0.4788736222052268, 2.345276842318083)
    },
    {
      name: 'IT Team',
      list: ['IT Support'],
      position: new THREE.Vector3(8.240320205688477, -13.60678081502101, 10.38215305631607)
    },
    {
      name: 'North TOM Desk',
      list: [''],
      position: new THREE.Vector3(9.078407287597656, 3.7961629850535186, -0.03671355980053556)
    },
    {
      name: 'South TOM Desk',
      list: [''],
      position: new THREE.Vector3(0, -0.7405031295479675, 2.441678434196212)
    },
    {
      name: 'STN8 Flow',
      list: ['RME', 'Operations', 'WHS'],
      position: new THREE.Vector3(3.9045377713138083, -3.333176601661826, 4.427809371026233)
      // position: new THREE.Vector3(0.6037369966506958, -12.466240859515464, 9.759073238857066)
    }

    //     new THREE.Vector3(3.9045377713138083, -3.333176601661826, 4.427809371026233),
//     new THREE.Vector3(5.312355041503906, 0.4788736222052268, 2.345276842318083),
//     new THREE.Vector3(-1.7999999523162842, 5.372774751886642, 1.7228154849726698),
//     new THREE.Vector3(0, -0.8435052846318617, 2.4979487679778196),
//     new THREE.Vector3(9.078407287597656, 3.5374081883835187, 0.10464482987930937),
//     new THREE.Vector3(0.6037369966506958, -12.466240859515464, 9.759073238857066),
//     new THREE.Vector3(8.240320205688477, -13.596681506145563, 10.376635778731712)
  ],
  meeting: [
    {
      name: 'South Hub First Floor',
      list: ['Meeting Room 1', 'Meeting Room 2'],
      position: new THREE.Vector3(-1.7999999523162842, 5.369345009662856, 1.7246891616890465)
    },
    {
      name: 'North Hub First Floor',
      list: ['Meeting Room'],
      position: new THREE.Vector3(12, 2.949702138100754, 3.046546086956202)
    }
  ]
};

init();
animate();

const markerGroup = new THREE.Group();
scene.add(markerGroup);

document.querySelectorAll('#buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.getAttribute('data-category');
    showMarkers(category);
  });
});

function showMarkers(category) {
  // clear old markers
  while (markerGroup.children.length > 0){
    const old = markerGroup.children.pop();

    old.traverse(obj => {
      if (obj instanceof CSS2DObject && obj.element){
        obj.element.remove();
      }
    });
    markerGroup.remove(old);
  }

  const locations = markersData[category];
  if (!locations) return;

  locations.forEach(({name, list, position}, index) => {
    const marker = createMarker(name, position, list);
    markerGroup.add(marker);

    // stahher animation for each marker
    marker.scale.set(0.001, 0.001, 0.001);
    setTimeout(() => {
      new TWEEN.Tween(marker.scale)
        .to({ x: 1, y: 1, z: 1 }, 500)
        .easing(TWEEN.Easing.Elastic.Out)
        .start();
    }, index * 500);
  });
  // const markerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  // const markerMaterial = new THREE.MeshStandardMaterial({
  //   color: 0xff0000,
  //   emissive: 0xff0000,
  //   emissiveIntensity: 2
  // });

  // locations.forEach(pos => {
  //   // const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  //   // marker.position.copy(pos);
  //   // markerGroup.add(marker);
  //   const marker = createMarker(category, pos);
  //   console.log('Marker clicked at position:', pos);
  //   scene.add(marker);
  // });
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
  camera.position.set(homePosition.x, homePosition.y, homePosition.z);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  container.appendChild(renderer.domElement);

  // css2d renderer for labels
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(container.clientWidth, container.clientHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  labelRenderer.domElement.style.left = '0';
  labelRenderer.domElement.style.pointerEvents = 'none';
  labelRenderer.domElement.style.zIndex = '10';
  container.appendChild(labelRenderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 80;
  controls.maxDistance = 80;
  controls.addEventListener('end', returnHome); // after user moves camera
  // :milky_way: Stars
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) starPositions[i] = (Math.random() - 0.5) * 1000;
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  // 🗺️ Map
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('STN8.png', (texture) => {
    const aspect = texture.image.width / texture.image.height;
    const height = 45; // covers ~75% of viewport height
    const width = height * aspect;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(width, height);
    mapPlane = new THREE.Mesh(geometry, material);
    mapPlane.rotation.x = -0.5; // tilt for 3D look
    mapPlane.rotation.y = 0; // tilt for 3D look
    mapPlane.rotation.z = Math.PI/-2; // tilt for 3D look
    mapPlane.material.depthWrite = false;
    mapPlane.material.opacity = 1;
    mapPlane.renderOrder = 0;
    scene.add(mapPlane);
    // You Are Here arrow
    const coneGeometry = new THREE.ConeGeometry(0.8, 4, 10, 1);
    const coneMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 2,
      transparent: true,
      opacity: 1
    });
    arrow = new THREE.Mesh(coneGeometry, coneMaterial);
    arrow.position.set(1.8609060981523458, -12.882823684024004, 12.029308849288597);
    arrow.rotation.x = Math.PI/-4 ; // points into screen
    arrow.rotation.y = Math.PI/-2 ; // points into screen
    arrow.rotation.z = Math.PI/3;
    scene.add(arrow);
  });
  const objLoader = new OBJLoader();
  objLoader.load('STN8 v2.obj', (obj) => {
    obj.position.set(0, 0, 0.1);
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          transparent: true,
          opacity: 0.5,
          depthWrite: true
        });

        // create edge lines
        const edges = new THREE.EdgesGeometry(child.geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1, opacity: 0.5 });
        const line = new THREE.LineSegments(edges, edgeMaterial);
        child.add(line);

        const num = parseInt(child.name.replace('Body', ''), 10);

        if (num === 1) { // floor
          child.material.color.set(0x00A339);
          child.material.opacity = 0.5;
        } else if (num >= 3 && num <= 142) { // trucks
          child.material.color.set(0x4DF0FF);
          child.material.opacity = 1;
        } else if (num >= 147 && num <= 154) { // flow text
          child.material.color.set(0xff0000);
          child.material.opacity = 1;
        } else if (num === 143) { // car park
          child.material.color.set(0xF07878);
          child.material.opacity = 0.8;
          child.material.emissive = new THREE.Color(0xF07878);
          child.material.emissiveIntensity = 0.5;
        } else if (num >= 156 && num <= 158 || num == 165) { // sprinkler tanks
          child.material.color.set(0xff0000);
          child.material.opacity = 1;
        } else if (num === 146) { // floor
          child.material.color.set(0xffffff);
          child.material.opacity = 1;
          const floorTexture = new THREE.TextureLoader().load('stn8-logo.png');
          const floorPlaneGeometry = new THREE.PlaneGeometry(200, 200);
          const floorPlaneMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, transparent: false });
          const floorPlane = new THREE.Mesh(floorPlaneGeometry, floorPlaneMaterial);
          floorPlane.rotation.x = -0.5;
          floorPlane.position.x = 4.7;
          floorPlane.position.y = 4.5;
          floorPlane.position.z = -1.44;
          var floorscale = 0.02;
          floorPlane.scale.set(floorscale, floorscale, floorscale);
          scene.add(floorPlane);
        } else if (num === 161 || num === 144 || num === 145 || num === 164 || num === 166 || num === 167) { // flow, managers office, canteen, back toilet, north and south hub
          child.material.color.set(0xffaf26);
          child.material.opacity = 1;
          child.material.emissive = new THREE.Color(0xffaf26);
          child.material.emissiveIntensity = 0.5;
        } else if (num === 163) { // outer walls LAYER 1
          child.material.color.set(0x03045e);
          child.material.opacity = 1;
        } else if (num >= 159 && num <= 160) { // TOM desk
          child.material.color.set(0xff0000);
          child.material.opacity = 1;
        } else if (num === 168 || num === 176) { // OUTER LAYER 2
          child.material.color.set(0x0077b6);
          child.material.opacity = 1;
          child.material.emissive = new THREE.Color(0x0077b6);
          child.material.emissiveIntensity = 0.5;
        } else if (num === 169) { // OUTER LAYER 3
          child.material.color.set(0x00b4d8);
          child.material.opacity = 1;
          child.material.emissive = new THREE.Color(0x00b4d8);
          child.material.emissiveIntensity = 1;
        } else if (num === 170) { // OUTER LAYER 4
          child.material.color.set(0x90e0ef);
          child.material.opacity = 1;
          child.material.emissive = new THREE.Color(0x90e0ef);
          child.material.emissiveIntensity = 0.5;
        } else if (num === 171) { // OUTER LAYER 5
          child.material.color.set(0xcaf0f8);
          child.material.opacity = 1;
          child.material.emissive = new THREE.Color(0xcaf0f8);
          child.material.emissiveIntensity = 0.5;
        }
        else if (num === 172) { // RME CAGE
          child.material.color.set(0x000000);
          child.material.opacity = 0.7;
          // child.material.emissive = new THREE.Color(0x000000);
          // child.material.emissiveIntensity = 1;
        }
        else if (num === 173) { // North TOM Team
          child.material.color.set(0x000000);
          child.material.opacity = 0.7;
          // child.material.emissive = new THREE.Color(0x000000);
          // child.material.emissiveIntensity = 1;
        }
        else if (num === 174) { // South TOM Team
          child.material.color.set(0x000000);
          child.material.opacity = 0.7;
          // child.material.emissive = new THREE.Color(0x000000);
          // child.material.emissiveIntensity = 1;
        }
        else if (num === 175) { // IT cage
          child.material.color.set(0x000000);
          child.material.opacity = 0.7;
          // child.material.emissive = new THREE.Color(0x000000);
          // child.material.emissiveIntensity = 1;
        }
        else if (num === 177) { // RME flow
          child.material.color.set(0xffaf26);
          child.material.opacity = 1;
          child.material.emissive = new THREE.Color(0xffaf26);
          child.material.emissiveIntensity = 0.5;
        }
        else if (num === 178) {
          child.material.color.set(0x000000);
          child.material.opacity = 0.7;
          // child.material.emissive = new THREE.Color(0x000000);
          // child.material.emissiveIntensity = 1;
        }
        else if (num === 179) {
          child.material.color.set(0x0077b6);
          child.material.opacity = 1;
          // child.material.emissive = new THREE.Color(0x000000);
          // child.material.emissiveIntensity = 1;
        }
      }
      
    });
    var objscale = 1;
    obj.scale.set(objscale, objscale, objscale);
    obj.rotation.x = -0.5;
    obj.rotation.y = 0;
    obj.rotation.z = Math.PI / -2;
    obj.renderOrder = 1;
    scene.add(obj);
    // const raycaster = new THREE.Raycaster();
    // const mouse = new THREE.Vector2();
    // window.addEventListener('click', (event) => {
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //   raycaster.setFromCamera(mouse, camera);
    //   const intersects = raycaster.intersectObjects([obj], true);
    //   if (intersects.length > 0) {
    //     const point = intersects[0].point;
    //     const marker = createMarker('Clicked Here', point);
    //     console.log('Marker clicked at position:', point);
    //     scene.add(marker);

    //     // const helper = new THREE.Mesh(
    //     //   new THREE.SphereGeometry(0.5, 16, 16),
    //     //   new THREE.MeshBasicMaterial({ color: 0xff0000 })
    //     // );
    //     // helper.position.copy(point);
    //     // scene.add(helper);
    //     }
    //   });
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  }, (error) => {
    console.error('Error loading OBJ file', error);
  });
  scene.add(new THREE.AmbientLight(0xfbfbfb, 1));
  window.addEventListener('resize', onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  const t = clock.getElapsedTime();
  if (arrow) arrow.scale.y = 1 + Math.sin(t * 3) * 0.1;
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  // requestAnimationFrame(animate);
  // updateLabelPositions();
  updateArrowText();
  if (isReturningHome) animateReturnHome();
  if (stars) {
    stars.rotation.y += 0.0005; // slow rotation
    stars.rotation.x += 0.0002;
    stars.rotation.z += 0.0002;
    if (stars.position.z > 50) {
      stars.position.z = -50;
    }
  }

}
function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
// function updateLabelPositions() {
//   labelData.forEach(({ id, position }) => {
//     const vector = position.clone().project(camera);
//     const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
//     const y = -(vector.y * 0.5 - 0.5) * container.clientHeight;
//     const label = document.getElementById(id);
//     label.style.left = `${x}px`;
//     label.style.top = `${y}px`;
//   });
// }
function updateArrowText() {
  if (!arrow) return;
  const vector = arrow.position.clone().project(camera);
  const x = (vector.x * 0.5 + 0.51) * container.clientWidth;
  const y = -(vector.y * 0.5 - 0.46) * container.clientHeight;
  const label = document.getElementById('arrowText');
  label.style.left = `${x}px`;
  label.style.top = `${y - 30}px`;
}
// Return camera to home after move
function returnHome() {
  isReturningHome = true;
}
function animateReturnHome() {
  const lerpFactor = 0.05;
  camera.position.lerp(new THREE.Vector3(homePosition.x, homePosition.y, homePosition.z), lerpFactor);
  if (camera.position.distanceTo(new THREE.Vector3(homePosition.x, homePosition.y, homePosition.z)) < 0.1) {
    isReturningHome = false;
  }
}
// ✨ Label click effect
// labelData.forEach(({ id, file }) => {
//   document.getElementById(id).addEventListener('click', () => {
//     shrinkAndTravel(file);
//   });
// });
function shrinkAndTravel(targetFile) {
  let start = null;
  const duration = 350;
  const startScale = 1;
  const endScale = 0.001;
  function animateShrink(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const scale = startScale + (endScale - startScale) * progress;
    if (mapPlane) mapPlane.scale.set(scale, scale, scale);
    if (arrow) arrow.scale.set(scale, scale, scale);
    document.querySelectorAll('.label, .arrow-label').forEach(el => {
      el.style.opacity = `${0.1 - progress}`;
    });
    renderer.render(scene, camera);
    if (progress < 1) {
      requestAnimationFrame(animateShrink);
    } else {
      fadeOverlay.style.opacity = 1;
      setTimeout(() => (window.location.href = targetFile), 1200);
    }
  }
  requestAnimationFrame(animateShrink);
}

function createMarker(labelTitle, position, listItems=[]) {
  const group = new THREE.Group();
  // Dot
  const dotGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const dotMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 1 });
  const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
  group.add(dotMesh);

  // Line
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
  const lineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 2, 0)
  ]);
  const line = new THREE.Line(lineGeo, lineMaterial);
  group.add(line);

  // const points = [position, new THREE.Vector3(position.x, position.y + 2, position.z)];
  // const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  // const line = new THREE.Line(lineGeometry, lineMaterial);

  // Label
  const div = document.createElement('div');
  div.className = 'label';
  div.innerHTML = `<b>${labelTitle}</b>`;
  div.style.cursor = 'pointer';
  div.style.opacity = 0;
  div.style.pointerEvents = 'auto';

  // Optional popup list
  if (listItems.length > 0) {
    const listDiv = document.createElement('div');
    listDiv.className = 'marker-list';
    listDiv.style.pointerEvents = 'auto';
    listItems.forEach(item => {
      const el = document.createElement('div');
      el.textContent = '• ' + item;
      listDiv.appendChild(el);
    });
    listDiv.style.display = 'none';
    div.appendChild(listDiv);

    // hover or click to show list
    // div.addEventListener('mouseenter', () => (listDiv.style.display = 'block'));
    // div.addEventListener('mouseleave', () => (listDiv.style.display = 'none'));

    div.addEventListener('click', () => {
      // close any open list
      if (openListDiv && openListDiv !== listDiv) {
        openListDiv.style.display = 'none';
      }
      // toggle current list
      if (listDiv.style.display === 'block') {
        listDiv.style.display = 'none';
        openListDiv = null;
      } else {
        listDiv.style.display = 'block';
        openListDiv = listDiv;
      }

      // listDiv.style.display = listDiv.style.display === 'none' ? 'block' : 'none';
    });
  }

  // div.textContent = labelTitle;
  // div.style.marginTop = '-1em';
  // div.style.padding = '4px 8px ';
  // div.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
  // div.style.borderRadius = '4px';
  // div.style.fontSize = '12px';
  // div.style.color = '#000';
  // div.style.fontFamily = 'Arial, sans-serif';

  const label = new CSS2DObject(div);
  label.position.set(0, 2, 0);
  group.add(label);

  // const group = new THREE.Group();
  // group.add(dotMesh);
  // group.add(line);
  // group.add(label);
  group.position.copy(position);

  // animate marker pop-in
  group.scale.set(0.001, 0.001, 0.001);
  new TWEEN.Tween(group.scale)
    .to({ x: 1, y: 1, z: 1 }, 500)
    .easing(TWEEN.Easing.Elastic.Out)
    .start();

  // fade-in label
  setTimeout(() => {
    div.style.transition = 'opacity 0.5s';
    div.style.opacity = 1;
  }, 500);
  return group;
}


