function SunsetBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <img
        src="/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      {/* Subtle dark overlay so text stays readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}

export default SunsetBackground;
