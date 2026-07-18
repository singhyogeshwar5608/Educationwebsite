"use client";

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="/?XTransformPort=5173"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          overflow: 'auto',
        }}
        title="ZTech Admin Panel"
      />
    </div>
  );
}
