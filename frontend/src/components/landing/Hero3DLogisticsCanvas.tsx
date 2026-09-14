import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hero3DLogisticsCanvas
 * Transferred directly from reference project C:\Studies\COLLABFLEET-AI (Background3D.jsx)
 *
 * Implements the exact 3D Low-Poly Truck, Shipping Containers, and Logistics Node Ribbon:
 * - LowPolyTruck: Chassis, Cabin, Windshield, Cargo Box, 6 Wheels
 * - ShippingContainer: Heavy corrugated shipping container with wireframe ridges
 * - Torus Logistics Node Ribbon
 * - Ambient & Directional Lighting tailored for the Light Theme
 * - Harmonic float & rotation animations matching @react-three/drei Float behavior
 */
export const Hero3DLogisticsCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting (Tailored for Crisp Light Theme)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(10, 15, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(0, 8, 6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-10, -8, -10);
    scene.add(rimLight);

    // 3. Low-Poly Stylized Truck Model (from reference project)
    const truckColor = 0xE4E4E7;
    const cabinColor = 0x27272A;
    const containerColor = 0xD4D4D8;
    const ribbonColor = 0xA1A1AA;

    const truckGroup = new THREE.Group();

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(3.6, 0.2, 1.4);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x18181B, roughness: 0.9 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.set(0, -0.4, 0);
    truckGroup.add(chassis);

    // Cabin
    const cabinGeo = new THREE.BoxGeometry(1.2, 1.0, 1.3);
    const cabinMat = new THREE.MeshStandardMaterial({ color: cabinColor, roughness: 0.4, metalness: 0.2 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(1.2, 0.2, 0);
    truckGroup.add(cabin);

    // Windshield
    const windshieldGeo = new THREE.BoxGeometry(0.62, 0.45, 1.15);
    const windshieldMat = new THREE.MeshStandardMaterial({ color: 0x71717A, roughness: 0.1, metalness: 0.8 });
    const windshield = new THREE.Mesh(windshieldGeo, windshieldMat);
    windshield.position.set(1.5, 0.35, 0);
    truckGroup.add(windshield);

    // Cargo Box
    const cargoGeo = new THREE.BoxGeometry(2.3, 1.4, 1.35);
    const cargoMat = new THREE.MeshStandardMaterial({ color: truckColor, roughness: 0.7 });
    const cargo = new THREE.Mesh(cargoGeo, cargoMat);
    cargo.position.set(-0.6, 0.4, 0);
    truckGroup.add(cargo);

    // 6 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x09090B, roughness: 0.9 });

    [-1.2, -0.2, 1.2].forEach((x) => {
      // Left wheels
      const wheelL = new THREE.Mesh(wheelGeo, wheelMat);
      wheelL.position.set(x, -0.5, 0.7);
      wheelL.rotation.x = Math.PI / 2;
      truckGroup.add(wheelL);

      // Right wheels
      const wheelR = new THREE.Mesh(wheelGeo, wheelMat);
      wheelR.position.set(x, -0.5, -0.7);
      wheelR.rotation.x = Math.PI / 2;
      truckGroup.add(wheelR);
    });

    truckGroup.position.set(2.4, -0.3, -1.5);
    truckGroup.rotation.set(0.2, -0.6, 0);
    truckGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(truckGroup);

    // 4. Low-Poly Shipping Containers (from reference project)
    const createContainer = (pos: [number, number, number], rot: [number, number, number], scale: number, color: number) => {
      const group = new THREE.Group();
      const boxGeo = new THREE.BoxGeometry(2.4, 1.2, 1.2);
      const boxMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 });
      const box = new THREE.Mesh(boxGeo, boxMat);
      group.add(box);

      // Corrugated ridges
      const planeGeo = new THREE.PlaneGeometry(2.2, 1);
      const planeMat = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
      const planeFront = new THREE.Mesh(planeGeo, planeMat);
      planeFront.position.set(0, 0, 0.61);
      group.add(planeFront);

      const planeBack = new THREE.Mesh(planeGeo, planeMat);
      planeBack.position.set(0, 0, -0.61);
      group.add(planeBack);

      group.position.set(...pos);
      group.rotation.set(...rot);
      group.scale.set(scale, scale, scale);
      return group;
    };

    const container1 = createContainer([-2.8, 1.2, -2.5], [0.3, 0.4, 0.1], 0.85, containerColor);
    scene.add(container1);

    const container2 = createContainer([-1.8, -1.4, -1.8], [-0.2, -0.5, 0.2], 0.75, 0xCCCCCC);
    scene.add(container2);

    // 5. Logistics Node Ribbon (Torus)
    const ribbonGeo = new THREE.TorusGeometry(3.2, 0.02, 16, 64);
    const ribbonMat = new THREE.MeshStandardMaterial({ color: ribbonColor, opacity: 0.35, transparent: true });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0, -0.5, -2.5);
    scene.add(ribbon);

    // 6. Animation Loop (reproducing the Float behavior of reference project)
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Truck Float
      truckGroup.position.y = -0.3 + Math.sin(t * 1.2) * 0.18;
      truckGroup.rotation.x = 0.2 + Math.cos(t * 0.8) * 0.05;
      truckGroup.rotation.y = -0.6 + Math.sin(t * 0.6) * 0.07;

      // Container 1 Float
      container1.position.y = 1.2 + Math.sin(t * 1.5 + 1) * 0.2;
      container1.rotation.x = 0.3 + Math.sin(t * 0.9) * 0.08;
      container1.rotation.y = 0.4 + Math.cos(t * 0.7) * 0.08;

      // Container 2 Float
      container2.position.y = -1.4 + Math.sin(t * 1.0 + 2) * 0.15;
      container2.rotation.x = -0.2 + Math.cos(t * 0.7) * 0.06;
      container2.rotation.y = -0.5 + Math.sin(t * 0.8) * 0.06;

      // Ribbon slow rotation
      ribbon.rotation.z += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize handling
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      chassisGeo.dispose();
      cabinGeo.dispose();
      windshieldGeo.dispose();
      cargoGeo.dispose();
      wheelGeo.dispose();
      ribbonGeo.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full pointer-events-none select-none ${className}`}
      style={{ minHeight: '340px' }}
    />
  );
};
