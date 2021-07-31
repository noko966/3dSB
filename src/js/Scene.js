import * as THREE from 'three';
import {
    Scene
} from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import {
    Text
} from 'troika-three-text'
import {
    gsap
} from "gsap";

import islandModel from '../assets/island.glb';
import envModel from '../assets/env.glb';


class Stage {
    constructor() {

        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.set(1);
        this.mouse = new THREE.Vector2();
        this.INTERSECTED = null;

        this.config = {
            camera: {
                fov: 45,
                near: 0.1,
                far: 1000,
            },
            odd: {
                color: 0x333333
            },
            env: {
                color: 0xdedede
            }
        }

        this.blocks = [];

        this.GLTFLoader = new GLTFLoader();

        this.clock = new THREE.Clock();


        this.scene = new Scene();
        this.scene.background = new THREE.Color(this.config.env.color);
        this.camera = new THREE.PerspectiveCamera(this.config.camera.fov, window.innerWidth / window.innerHeight, this.config.camera.near, this.config.camera.far);
        this.camera.position.set(0, 0, 35);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // this.controls.update();

        document.body.appendChild(this.renderer.domElement);

        this.loadObjects();

        window.addEventListener('resize', this.resize.bind(this), false);
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);

    }

    onMouseMove(event) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components




        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (this.ready) {
            this.camera.position.x = this.mouse.x * 2;
            this.camera.position.y = this.mouse.y * 2;
            this.camera.lookAt(0, 0, 0);
        }

    }

    addBlocks() {
        let y = 10;
        this.sidebar = new THREE.Group();
        for (let i = 0; i < 7; i++) {

            var blockMaterial = new THREE.MeshStandardMaterial({
                color: 0xdedede,
                metalness: 0.9,
            });
            var block = new THREE.Mesh(this.block.geometry, blockMaterial);
            block.castShadow = true;
            block.receiveShadow = true;

            block.position.y = y - i * 3;

            this.blocks.push(block);

            const p1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({
                color: this.config.odd.color
            }));
            const x = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({
                color: this.config.odd.color
            }));
            const p2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({
                color: this.config.odd.color
            }));

            p1.layers.enable(1);
            x.layers.enable(1);
            p2.layers.enable(1);

            const txtP1 = new Text();
            txtP1.text = '1.5'
            txtP1.fontSize = 0.4
            txtP1.position.z = 0.6
            txtP1.position.y = 0.2
            txtP1.position.x = -0.3
            txtP1.color = 0xcccccc;

            const txtx = new Text();
            txtx.text = '1.2'
            txtx.fontSize = 0.4
            txtx.position.z = 0.6
            txtx.position.y = 0.2
            txtx.position.x = -0.3
            txtx.color = 0xcccccc;

            const txtP2 = new Text();
            txtP2.text = '1.8'
            txtP2.fontSize = 0.4
            txtP2.position.z = 0.6
            txtP2.position.y = 0.2
            txtP2.position.x = -0.3
            txtP2.color = 0xcccccc;

            p1.add(txtP1);
            x.add(txtx);
            p2.add(txtP2);

            p1.position.x = 0;
            x.position.x = 1.2;
            p2.position.x = 2.4;

            block.add(p1);
            block.add(x);
            block.add(p2);

            this.sidebar.add(block);

        }
        this.scene.add(this.sidebar);

        this.ready = true;
        // this.sidebar.position.x = -20;
    }

    loadEnv() {
        // this.GLTFLoader.load(
        //     envModel,
        //     (gltf) => {
        //         gltf.scene.traverse(function (child) {
        //             if (child.isMesh) {
        //                 child.material = new THREE.MeshStandardMaterial({
        //                     color: 0xAE8C12,
        //                     metalness: 0.9,
        //                     // roughness: 0.6,
        //                 })
        //                 child.receiveShadow = true;
        //                 child.castShadow = true;

        //             }

        //         });
        //         let scale = 50;
        //         gltf.scene.scale.set(scale, scale, scale);
        //         gltf.scene.rotation.y = -Math.PI / 2;

        //         gltf.scene.position.set(0, -30, -100);

        //         this.scene.add(gltf.scene)

        //     },
        //     function (xhr) {
        //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        //     },
        //     function (error) {
        //         console.log('An error happened');
        //     }
        // );
    }

    loadObjects() {
        this.GLTFLoader.load(
            islandModel,
            (gltf) => {
                console.log(gltf);
                gltf.scene.children[0].material = new THREE.MeshStandardMaterial({
                    color: 0x333333,
                    metalness: 0.6,
                    roughness: 0.6,
                });

                this.loadEnv();
                this.block = gltf.scene.children[0];
                this.addBlocks();

                this.animate();


            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('An error happened');
            }
        );

        const lightFront = new THREE.DirectionalLight(0xffffff);
        lightFront.intensity = 1;
        lightFront.castShadow = true;
        this.scene.add(lightFront);
        lightFront.position.set(0, 10, 5);
        lightFront.lookAt(0, 0, 0);

        lightFront.shadow.mapSize.width = 1024;
        lightFront.shadow.mapSize.height = 1024;
        lightFront.shadow.camera.near = 0.5;
        lightFront.shadow.camera.far = 1000;


        const helper = new THREE.DirectionalLightHelper(lightFront, 5);
        // this.scene.add(helper);

        const ambientLight = new THREE.AmbientLight(0xffffff);
        ambientLight.intensity = 1.5;
        this.scene.add(ambientLight);

    }


    animate() {
        let delta = this.clock.getDelta();
        delta = delta * 10;
        if (!this.ready) return;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {

            if (intersects[0].object !== this.INTERSECTED) {
                this.INTERSECTED = intersects[0].object;
                gsap.to(this.INTERSECTED.rotation, {
                    duration: 0.5,
                    x: Math.PI * 2
                });

                this.INTERSECTED.children[0].color = 0x000000;
                this.INTERSECTED.children[0].sync();
            }

            
        } 
        else {
            if (this.INTERSECTED !== null) {
                gsap.to(this.INTERSECTED.rotation, {
                    duration: 0.5,
                    x: 0
                });
                this.INTERSECTED.children[0].color = 0xcccccc;
                this.INTERSECTED.children[0].sync();
                this.INTERSECTED = null;

            }
            

        }

        requestAnimationFrame(this.animate.bind(this));
        // this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

}


let s = new Stage();