import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to EventHub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover and join amazing events happening around you
        </p>
        <Link
          to="/events"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse Events As Guest
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-blue-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Discover Events
            </h3>
            <p className="text-gray-600">
              Find events that match your interests
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-green-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Join & Connect
            </h3>
            <p className="text-gray-600">
              Meet people who share your passions
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create Events
            </h3>
            <p className="text-gray-600">
              Host your own events and build community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
