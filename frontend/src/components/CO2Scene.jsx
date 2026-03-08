import React from 'react';
import { Plane, Box, Cylinder } from '@react-three/drei';

function Car({ position, color }) {
    return (
        <group position={position}>
            <Box args={[1.5, 0.8, 3]} position={[0, 0, 0]} castShadow>
                <meshStandardMaterial color={color} />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.3, 0.3, 0.2]} rotation={[0, 0, Math.PI / 2]} position={[-0.8, -0.4, 0.8]}>
                <meshStandardMaterial color="#000" />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2]} rotation={[0, 0, Math.PI / 2]} position={[0.8, -0.4, 0.8]}>
                <meshStandardMaterial color="#000" />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2]} rotation={[0, 0, Math.PI / 2]} position={[-0.8, -0.4, -0.8]}>
                <meshStandardMaterial color="#000" />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2]} rotation={[0, 0, Math.PI / 2]} position={[0.8, -0.4, -0.8]}>
                <meshStandardMaterial color="#000" />
            </Cylinder>
        </group>
    );
}

export default function CO2Scene({ carCount = 1, carColor = "#ef4444" }) {
    // Generate an array representing the cars to render
    const cars = Array.from({ length: Math.min(carCount, 50) }); // Cap at 50 to avoid rendering overload

    const getPosition = (index) => {
        // Arrange cars in a grid (e.g. 3 columns)
        const cols = 3;
        const spacingX = 2.5;
        const spacingZ = 4;

        const row = Math.floor(index / cols);
        const col = index % cols;

        const offsetX = (col - (cols - 1) / 2) * spacingX;
        const offsetZ = parseInt(-row * spacingZ);

        return [offsetX, 0, offsetZ];
    };

    return (
        <>
            <color attach="background" args={["#0f172a"]} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />

            {/* Parking Area Floor */}
            <Plane args={[60, 60]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                <meshStandardMaterial color="#334155" />
            </Plane>

            {/* Render cars */}
            {cars.map((_, i) => (
                <Car key={i} position={getPosition(i)} color={carColor} />
            ))}
        </>
    );
}
