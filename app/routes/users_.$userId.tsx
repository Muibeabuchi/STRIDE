import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchSingleUsers } from "@/utils/posts";

export const Route = createFileRoute("/users_/$userId")({
  async loader({ params }) {
    return await fetchSingleUsers({ data: params.userId });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const userId = Route.useParams().userId;
  const data = Route.useLoaderData();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/users"
        className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
      >
        <span className="material-icons mr-1">arrow_back</span>
        Back to Users
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-3xl font-bold text-white">{data.name}</h1>
          <p className="text-blue-100">@{data.username}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  Contact Information
                </h2>
                <div className="mt-2 space-y-2">
                  <p className="flex items-center text-gray-600">
                    <span className="material-icons mr-2">email</span>
                    {data.email}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <span className="material-icons mr-2">phone</span>
                    {data.phone}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <span className="material-icons mr-2">language</span>
                    {data.website}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700">Company</h2>
                <div className="mt-2">
                  <p className="font-medium text-gray-800">
                    {data.company.name}
                  </p>
                  <p className="text-gray-600 italic">
                    "{data.company.catchPhrase}"
                  </p>
                  <p className="text-gray-600">{data.company.bs}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">Address</h2>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{data.address.street}</p>
                <p className="text-gray-700">{data.address.suite}</p>
                <p className="text-gray-700">{data.address.city}</p>
                <p className="text-gray-700">{data.address.zipcode}</p>
                <div className="mt-3 text-sm text-gray-500">
                  <p>Lat: {data.address.geo.lat}</p>
                  <p>Long: {data.address.geo.lng}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
