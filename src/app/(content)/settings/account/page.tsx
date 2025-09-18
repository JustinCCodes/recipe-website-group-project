import ProfilePictureUpload from "@/features/profile/components/ProfilePictureUpload";

export default function AccountSettingsPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-lg text-gray-400 mt-2">
          Manage your account details.
        </p>
      </header>

      <section>
        <ProfilePictureUpload />
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-gray-600">
          Change Password (Coming Soon)
        </h3>
        {/* Placeholder for a password change form */}
      </section>
    </main>
  );
}
