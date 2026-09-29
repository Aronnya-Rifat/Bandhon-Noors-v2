/**
 * Bandhon Noors Register Page
 *
 * Customer registration UI.
 *
 * Future:
 * POST /users/register
 */


export default function RegisterPage() {


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

          Create Account

        </h1>



        <form
          className="
            mt-8
            space-y-5
          "
        >

          <input
            placeholder="Full Name"
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "
          />


          <input
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
            placeholder="Phone"
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
            "
          >

            Register

          </button>


        </form>


      </div>


    </main>

  );

}
