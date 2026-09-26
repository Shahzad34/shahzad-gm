import Projects from "../components/Projects/Projects.jsx";

export default function ProjectsPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <Projects showViewAll={false} />
    </div>
  );
}
