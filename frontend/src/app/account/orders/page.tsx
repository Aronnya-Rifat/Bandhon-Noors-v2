/**
 * Bandhon Noors Orders Page
 *
 * Customer order history.
 *
 * Future:
 * - Load orders from backend
 * - Order tracking
 * - Payment status
 */


export default function OrdersPage() {


  const orders = [];


  return (

    <main
      className="
        container
        py-20
      "
    >


      <div
        className="
          max-w-3xl
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

          My Orders

        </h1>



        {
          orders.length === 0 ? (

            <div
              className="
                mt-10
                border
                border-pink-100
                rounded-2xl
                p-10
                text-center
              "
            >

              <p
                className="
                  text-gray-500
                "
              >

                You have no orders yet.

              </p>


            </div>


          ) : (


            <div
              className="
                mt-10
                space-y-6
              "
            >

              {
                orders.map(
                  (order) => (

                    <div
                      key={order.id}
                    >

                      Order

                    </div>

                  )
                )
              }


            </div>


          )
        }


      </div>


    </main>

  );

}
