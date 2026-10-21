"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { geoTo3D } from "@/lib/philippines-geo";
import { Layers, RotateCw, MapPin } from "lucide-react";
import ElectionLiveBadge from "./ElectionLiveBadge";

interface ProvinceData {
  id: string;
  name: string;
  regionId: string;
  islandGroup: "Luzon" | "Visayas" | "Mindanao";
  centerLat: number;
  centerLng: number;
  totalSubmissions: number;
  hasSufficientData: boolean;
  leadingPresident?: {
    id: string;
    name: string;
    color: string;
    votes: number;
    share: number;
  } | null;
  leadingVicePresident?: {
    id: string;
    name: string;
    color: string;
    votes: number;
    share: number;
  } | null;
  topSenators?: {
    id: string;
    name: string;
    color: string;
    votes: number;
  }[];
  cities: string[];
}

interface Props {
  provinces: ProvinceData[];
  selectedPosition: "PRESIDENT" | "VICE_PRESIDENT" | "SENATOR";
  onSelectProvince: (province: ProvinceData) => void;
  selectedProvinceId?: string | null;
}

export default function Philippine3DMap({
  provinces,
  selectedPosition,
  onSelectProvince,
  selectedProvinceId,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 620;

    // 1. Scene & Camera (Newsroom 3D Studio Setup)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070D1F); // Deep GMA news broadcast navy background

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(0, 12, 9);
    camera.lookAt(0, 0, -0.4);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x004B93, 0.9);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(6, 16, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueBacklight = new THREE.DirectionalLight(0x0284c7, 0.8);
    blueBacklight.position.set(-6, 8, -6);
    scene.add(blueBacklight);

    // 4. Circular Glowing Studio Grid
    const gridHelper = new THREE.GridHelper(16, 24, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // 5. Archipelago Group
    const archipelagoGroup = new THREE.Group();
    scene.add(archipelagoGroup);

    const meshes: THREE.Mesh[] = [];

    provinces.forEach((p) => {
      const [x, , z] = geoTo3D(p.centerLat, p.centerLng);

      // Height proportional to vote activity
      const pillarHeight = Math.min(2.2, Math.max(0.25, (p.totalSubmissions || 1) * 0.28));

      // Color from leading candidate
      let colorHex = "#475569";
      if (selectedPosition === "PRESIDENT" && p.leadingPresident) {
        colorHex = p.leadingPresident.color;
      } else if (selectedPosition === "VICE_PRESIDENT" && p.leadingVicePresident) {
        colorHex = p.leadingVicePresident.color;
      } else if (selectedPosition === "SENATOR" && p.topSenators && p.topSenators.length > 0) {
        colorHex = p.topSenators[0].color;
      } else if (p.leadingPresident) {
        colorHex = p.leadingPresident.color;
      }

      const geometry = new THREE.CylinderGeometry(0.18, 0.22, pillarHeight, 6);
      geometry.translate(0, pillarHeight / 2, 0);

      const isSelected = selectedProvinceId === p.id;
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.2,
        metalness: 0.3,
        emissive: isSelected ? new THREE.Color(0xffb703) : new THREE.Color(0x000000),
        emissiveIntensity: isSelected ? 0.6 : 0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, 0, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { province: p, defaultColor: colorHex };

      archipelagoGroup.add(mesh);
      meshes.push(mesh);
    });

    // 6. Interactive Orbital Drag & Hover
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.006;
        targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX + deltaY * 0.004));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      // Raycasting
      const mouse = new THREE.Vector2(
        (mouseX / rect.width) * 2 - 1,
        -(mouseY / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const pData = hit.userData.province as ProvinceData;
        setHoveredProvince(pData);
        setTooltipPos({ x: mouseX + 15, y: mouseY + 15 });

        meshes.forEach((m) => {
          const mat = m.material as THREE.MeshStandardMaterial;
          if (m === hit) {
            mat.emissive = new THREE.Color(0xffb703);
            mat.emissiveIntensity = 0.8;
          } else {
            mat.emissive = new THREE.Color(0x000000);
            mat.emissiveIntensity = 0;
          }
        });
      } else {
        setHoveredProvince(null);
        meshes.forEach((m) => {
          const mat = m.material as THREE.MeshStandardMaterial;
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
        });
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const mouse = new THREE.Vector2(
        (mouseX / rect.width) * 2 - 1,
        -(mouseY / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const pData = hit.userData.province as ProvinceData;
        onSelectProvince(pData);
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("click", onClick);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      archipelagoGroup.rotation.y += (targetRotationY - archipelagoGroup.rotation.y) * 0.08;
      archipelagoGroup.rotation.x += (targetRotationX - archipelagoGroup.rotation.x) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 620;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("click", onClick);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [provinces, selectedPosition, onSelectProvince, selectedProvinceId]);

  return (
    <div className="relative w-full h-[640px] bg-[#070D1F] rounded-2xl border-2 border-slate-700 overflow-hidden select-none shadow-card">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Broadcast HUD Banner */}
      <div className="absolute top-4 left-4 z-10 bg-[#0B1E36]/90 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-md text-xs text-white space-y-1">
        <div className="flex items-center gap-2">
          <ElectionLiveBadge label="3D SPATIAL STUDIO" sublabel="Made by Swing Labs" />
        </div>
        <p className="text-[11px] text-slate-300 font-sans">
          Click &amp; drag to orbit &bull; Pillar height = Vote concentration
        </p>
      </div>

      {/* Hover Card */}
      {hoveredProvince && (
        <div
          className="absolute z-20 pointer-events-none bg-[#0B1E36] text-white rounded-xl p-3.5 shadow-md border-2 border-amber-400 text-xs min-w-[210px] animate-in fade-in duration-100"
          style={{
            left: Math.min(tooltipPos.x, (mountRef.current?.clientWidth || 300) - 230),
            top: Math.min(tooltipPos.y, (mountRef.current?.clientHeight || 500) - 130),
          }}
        >
          <div className="text-[10px] font-headline font-bold tracking-widest text-amber-400 uppercase">
            {hoveredProvince.islandGroup} &bull; {hoveredProvince.regionId}
          </div>
          <div className="font-headline font-black text-lg text-white mt-0.5 uppercase tracking-wide">
            {hoveredProvince.name}
          </div>
          <div className="text-[11px] font-sans font-semibold text-slate-300">
            {hoveredProvince.totalSubmissions} Votes Counted
          </div>

          {hoveredProvince.leadingPresident && (
            <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: hoveredProvince.leadingPresident.color }}
                ></span>
                <span className="font-headline font-bold text-xs text-white uppercase">
                  {hoveredProvince.leadingPresident.name}
                </span>
              </div>
              <span className="font-headline font-black text-sm text-amber-400">
                {hoveredProvince.leadingPresident.share}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
