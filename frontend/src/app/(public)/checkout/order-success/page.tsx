export default function OrderSuccess() {

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-50">

            <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md">

                <div className="text-green-600 text-5xl mb-4">✔</div>

                <h1 className="text-2xl font-bold mb-2">
                    Order Placed Successfully
                </h1>

                <p className="text-gray-500 mb-6">
                    Thank you for your purchase. Your product will be delivered soon.
                </p>

                <a
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                    Continue Shopping
                </a>

            </div>

        </div>

    )

}
