import Skills from "../components/Skills/Skills.jsx";
import GithubActivity from "../components/GithubActivity/GithubActivity.jsx";

export default function SkillsPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <Skills />
      <GithubActivity />
    </div>
  );
}
