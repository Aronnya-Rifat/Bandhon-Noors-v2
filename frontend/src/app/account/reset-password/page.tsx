import PasswordResetForm from "@/components/auth/PasswordResetForm";


interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}


export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-semibold text-[#3F312B]">
          Choose New Password
        </h1>

        <div className="mt-8">
          <PasswordResetForm
            token={
              params.token ?? ""
            }
          />
        </div>
      </div>
    </main>
  );
}
