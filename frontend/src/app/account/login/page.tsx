/**
 * Bandhon Noors Login Page
 *
 * Frontend only.
 *
 * Future:
 * POST /auth/login
 */


export default function LoginPage() {


  return (

    <main
      className="
        container
        py-20
      "
    >

      <div
        className="
          max-w-md
          mx-auto
        "
      >

        <h1
          className="
            text-3xl
            font-semibold
            text-[#3F312B]
          "
        >

          Login

        </h1>



        <form
          className="
            mt-8
            space-y-5
          "
        >

          <input
            type="email"
            placeholder="Email"
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "
          />


          <input
            type="password"
            placeholder="Password"
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "
          />


          <button
            className="
              w-full
              bg-[#D88C9A]
              hover:bg-[#C97B89]
              text-white
              py-3
              rounded-full
              transition
            "
          >

            Login

          </button>


        </form>


      </div>


    </main>

  );

}
