# Animation with Scroll

This project demonstrates a 3D animation using React Three Fiber and GSAP, where the animation reacts to scroll events. The 3D model is rendered using Three.js, and the animation is controlled using GSAP.

## Setup Process

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/freab/animation-with-scroll.git
   cd animation-with-scroll
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

## Dependencies Required

This project relies on the following dependencies:

- **React**: A JavaScript library for building user interfaces.
- **@react-three/fiber**: A React renderer for Three.js.
- **@react-three/drei**: Useful helpers for React Three Fiber.
- **Three.js**: A JavaScript 3D library.
- **GSAP**: A powerful JavaScript library for creating animations.
- **vite**: A fast build tool for modern web projects.
- **@vitejs/plugin-react**: Vite plugin for React.
- **@react-three/gltf**: GLTF loader for React Three Fiber.

## How to Run the Project Locally

1. **imstall the required dependencies**:

   ```bash
   npm install
   ```

2. **Start the Development Server**:

   ```bash
   npm run dev
   ```

3. **Open Your Browser**:
   Open your browser and navigate to `http://localhost:5173` to see the project in action.

## Project Structure

- **src/components**: Contains the main React components used in the project.

  - `Axum.js`: Component to load and render the 3D GLB model.
  - `Experience.js`: Main component that sets up the Three.js canvas, scroll controls, and animations.

## Brief Explanation of Approach

### Approaches used to create the Experience

1. **Setup React Three Fiber**:

   - Initialize a Three.js canvas using React Three Fiber.
   - Use `ScrollControls` from `@react-three/drei` to detect and manage scroll events.

2. **Load and Render 3D Model**:

   - Use `useGLTF` from `@react-three/drei` to load a GLB model.
   - Render the model within the Three.js scene.

3. **Animate with GSAP**:
   - Define different sections of the scroll, each with unique animations.
   - Use GSAP to control the 3D model’s rotation, position, scale, and scene background color based on scroll position.
   - Apply a custom glow material to the model in one of the sections.

### Challenges Faced

2. **Scroll-Based Animations**:
   - Managing smooth transitions between different scroll sections was challenging. Used GSAP for precise control over animations and to ensure smooth transitions.
3. **Custom Materials**:
   - Implementing a custom glow material required deep understanding of Three.js materials and shaders.
