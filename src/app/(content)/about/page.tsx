export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
        <p className="text-gray-700 leading-relaxed">
          We’re building a simple, friendly place to discover, create, and share recipes.
          Our goal is to make cooking feel approachable—whether you’re saving a family classic
          or trying something totally new.
        </p>
      </header>

      {/* Who we are */}
      <section className="rounded-2xl border shadow-sm p-6 space-y-4 bg-white/70">
        <h2 className="text-2xl font-semibold">Who we are</h2>
        <ul className="list-disc pl-6 space-y-4 text-gray-700 leading-relaxed">
          <li>
            <strong>Lara</strong> — Junior Software Engineer with a background in education and social impact. I bring a strong sense of structure, empathy, and problem-solving to every project I work on. I’m passionate about developing thoughtful, user-centered digital solutions, especially those that combine technology with real-world relevance. 
          </li>
          <li>
            <strong>Justin</strong> — A Junior Software Engineer actively building foundational skills in Python, JavaScript, C#, and Full-Stack. My background as an IT Systems Electronics Technician and Office Management Assistant (with SAP Business One) has honed my problem-solving and user-centric approach. Beyond my career, 16 years of dedicated family care alongside work and school instilled exceptional responsibility and a solution-oriented drive. I'm eager to apply these diverse experiences and developing technical skills to impactful IT projects.
          </li>
          <li>
            <strong>Büsra</strong> — I’m a creative, human-centered software engineer in training at WBS Coding School, pivoting from healthcare to build intuitive web apps that feel good to use. I’m learning Python, JavaScript, HTML/CSS/Tailwind, Git, React, Node.js, and Azure. I bring strong problem-solving, a structured mindset, and empathy. I write clean, user-focused code and thrive in agile teams. I’m seeking a remote or international team where I can grow, contribute, and help build thoughtful, empowering products.
          </li>
        </ul>
      </section>

      {/* What this site does */}
      <section className="rounded-2xl border shadow-sm p-6 space-y-3 bg-white/70">
        <h2 className="text-2xl font-semibold">What this site does</h2>
        <p className="text-gray-700 leading-relaxed">
          Search recipes, view details, and manage a small cookbook.
        </p>
      </section>
    </main>
  );
}