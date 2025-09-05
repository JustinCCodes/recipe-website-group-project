export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-3xl font-semibold">About Us</h1>
      <p className="text-gray-400">
        This is our project about a cookbook. Here’s what you will find about us.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Team</h2>
        <ul className="list-disc pl-5">
          <li><strong>Lara</strong> — Software Engineering Program</li>
          <li><strong>Justin</strong> — Software Engineering Program</li>
          <li><strong>Büsra</strong> — Software Engineering Program</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">What this site does</h2>
        <p>
          Search recipes, view details, and manage a small cookbook.
        </p>
      </section>
    </main>
  );
}
