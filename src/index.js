
//---------------------------- IMPORTAÇÕES DO THREE.JS ----------------------------//

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CubeTextureLoader } from 'three/src/loaders/CubeTextureLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

//-------------------------- CONSTRUTOR DO RENDERER  --------------------------//

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//-------------------------- CONFIGURAÇÕES DA CÂMERA --------------------------//

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	20,
	500
);
camera.position.set(30, 30, 0);
camera.lookAt( 0, 0, 0 );

//---------------------------- CONTRUÇÃO DA CENA ----------------------------//

const scene = new THREE.Scene();

scene.background = new CubeTextureLoader()
	.setPath('../images/universe/')
	.load([
		'posx.jpg',
		'negx.jpg',
		'posy.jpg',
		'negy.jpg',
		'posz.jpg',
		'negz.jpg'
	]);

//---------------------------- MODELAGEM DA LUA ----------------------------//

const texture_moon = new THREE.TextureLoader().load('../textures/moon.jpg');

const geometry_moon = new THREE.SphereGeometry( 16, 32, 16);
const material_moon = new THREE.MeshBasicMaterial( { map: texture_moon } );
const moon = new THREE.Mesh( geometry_moon, material_moon );
moon.position.y = -15.65;
scene.add( moon );

//---------------------------- MODELAGEM DO BURACO NEGRO ----------------------------//

const texture_black_hole = new THREE.TextureLoader().load('../textures/black_hole.jpg');

const geometry_black_hole = new THREE.CircleGeometry( 2, 32 );
const material_black_hole = new THREE.MeshBasicMaterial( { map: texture_black_hole } );
const black_hole = new THREE.Mesh( geometry_black_hole, material_black_hole );
black_hole.position.set(-15, 0, 0);
black_hole.rotateY(1.59);
scene.add( black_hole );

//----------------------------- APOLLO LUNAR -----------------------------//

new RGBELoader()
	.setPath('../textures/')
	.load('royal_esplanade_1k.hdr', function (texture) {

		texture.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = texture;
		render();

		const loader = new GLTFLoader().setPath('../apollo_lunar_module/');
		loader.load('scene.gltf', function (gltf) {

			scene.add(gltf.scene);

			render();

		});

	});

//---------------------- CONTROLE ORBITAL DA CÂMERA ----------------------//

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//-------------------- FUNÇÕES UTILIZADAS NO PROJETO --------------------//

function render() {

	renderer.render(scene, camera);

}

// Variáveis usadas na função animate()
let t1 = 0;
let t2 = 0;
let s1 = 0;
let s2 = 0;

function animate() {

	requestAnimationFrame(animate);
	controls.update();

	// Rotação da Lua
	moon.rotateY(0.01);

	// Translação do Buraco Negro
	if (t1 >= 15){
		t1 = t1 - 0.1;
		t2 = 0;
	} else if ((t1 < 15 && t1 > -15) && (t2 == 1)) {
		t1 = t1 + 0.1;
	} else if ((t1 < 15 && t1 > -15) && (t2 == 0)) {
		t1 = t1 - 0.1;
	} else if (t1 <= -15){
		t1 = t1 + 0.1;
		t2 = 1;
	}

	black_hole.position.z = t1;

	// Escala do Buraco Negro
	if (s1 >= 2){
		s1 = s1 - 0.01;
		s2 = 0;
	} else if ((s1 < 2 && s1 > 0.2) && (s2 == 1)) {
		s1 = s1 + 0.01;
	} else if ((s1 < 2 && s1 > 0.2) && (s2 == 0)) {
		s1 = s1 - 0.01;
	} else if (s1 <= 0.2){
		s1 = s1 + 0.01;
		s2 = 1;
	}

	black_hole.scale.set(s1, s1, 0);

	// Renderização
	render();

}

//--- EXECUÇÃO DO PROJETO ---//

animate();

//--------------------------//

