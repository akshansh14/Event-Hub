import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to EventHub</h1>
      <p className="text-xl mb-8">Discover and create amazing events!</p>
      <Link to="/events" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Browse Events
      </Link>
    </div>
  );
}

export default Home;
