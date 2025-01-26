import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MNISTCNNVisualization = () => {
  const [model, setModel] = useState(null);
  const [inputDigit, setInputDigit] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    async function loadModel() {
      // Load a pre-trained MNIST CNN model
      const model = await tf.loadLayersModel('/models/mnist-cnn/model.json');
      setModel(model);
    }
    loadModel();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      containerRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.update();

      setScene(scene);
      setCamera(camera);
      setRenderer(renderer);
      setControls(controls);
    }
  }, [containerRef]);

  useEffect(() => {
    if (model && scene) {
      // Implement 3D visualization of the CNN's processing of the input digit
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    }
  }, [model, scene, inputDigit]);

  const handleInputChange = (e) => {
    setInputDigit(parseInt(e.target.value));
  };

  const handlePrediction = async () => {
    if (model && inputDigit !== null) {
      const input = tf.tensor([inputDigit]).reshape([1, 28, 28, 1]);
      const prediction = await model.predict(input);
      setPrediction(prediction.argMax(-1).dataSync()[0]);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>MNIST CNN Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <label htmlFor="input-digit" className="mr-2">
              Input Digit:
            </label>
            <input
              type="number"
              id="input-digit"
              min="0"
              max="9"
              value={inputDigit || ''}
              onChange={handleInputChange}
              className="px-2 py-1 border rounded"
            />
          </div>
          <Button onClick={handlePrediction}>Visualize</Button>
          {prediction !== null && (
            <div className="mt-4">
              Predicted Digit: {prediction}
            </div>
          )}
          <div ref={containerRef} className="w-full h-[500px]" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MNISTCNNVisualization;