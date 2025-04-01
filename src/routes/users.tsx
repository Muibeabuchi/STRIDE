import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { fetchAllUsers } from "~/utils/posts";

export const Route = createFileRoute("/users")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ["users"],
      queryFn: fetchAllUsers,
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  if (error) {
    return <p>Error Occurred</p>;
  }

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Outlet />
      {data.map((user) => (
        <Link
          to="/users/$userId"
          params={{ userId: String(user.id) }}
          key={user.id}
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-blue-100">@{user.username}</p>
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
                        {user.email}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <span className="material-icons mr-2">phone</span>
                        {user.phone}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <span className="material-icons mr-2">language</span>
                        {user.website}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      Company
                    </h2>
                    <div className="mt-2">
                      <p className="font-medium text-gray-800">
                        {user.company.name}
                      </p>
                      <p className="text-gray-600 italic">
                        "{user.company.catchPhrase}"
                      </p>
                      <p className="text-gray-600">{user.company.bs}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    Address
                  </h2>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{user.address.street}</p>
                    <p className="text-gray-700">{user.address.suite}</p>
                    <p className="text-gray-700">{user.address.city}</p>
                    <p className="text-gray-700">{user.address.zipcode}</p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Lat: {user.address.geo.lat}</p>
                      <p>Long: {user.address.geo.lng}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
