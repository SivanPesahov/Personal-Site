import { Link } from "react-router-dom";

function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #eee",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>My Portfolio</h1>
      <nav style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/about">About Me</Link>
        <Link to="/contact">Leave A Message</Link>
      </nav>
    </header>
  );
}

export default Header;
