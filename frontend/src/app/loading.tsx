export default function LoadingPage() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading page"
      className="container min-h-[65vh] py-16"
    >
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded bg-pink-100" />

        <div className="mt-5 h-10 w-full max-w-md rounded bg-gray-200" />

        <div className="mt-4 h-5 w-full max-w-xl rounded bg-gray-100" />

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
            >
              <div className="aspect-[4/5] rounded-2xl bg-pink-100" />

              <div className="mt-4 h-4 w-4/5 rounded bg-gray-200" />

              <div className="mt-3 h-4 w-2/5 rounded bg-pink-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
