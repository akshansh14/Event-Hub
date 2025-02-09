import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { 
  Calendar, 
  Users, 
  Globe, 
  Zap,
  ArrowRight,
  Star,
  Shield,
  Activity
} from "lucide-react"

function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Event Management",
      description: "Create and manage events with ease. Set dates, times, and locations effortlessly."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Building",
      description: "Connect with like-minded people and build your community around shared interests."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Reach audiences worldwide and make your events accessible to everyone."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Features",
      description: "Access advanced features to make your events stand out from the crowd."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Your data and events are protected with enterprise-grade security."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Get instant notifications and live updates for your events."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="bg-gradient-to-r from-violet-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
              Create Memorable
            </span>
            <br />
            <span className="text-white">Events Together</span>
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            The ultimate platform for creating, managing, and discovering amazing events. 
            Connect with people who share your passions.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl group"
            >
              <span className="text-lg font-medium">Explore Events</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-0.5 border border-white/20"
            >
              <span className="text-lg font-medium">Get Started</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-20"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-white"
        >
          Everything you need to create
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">
            successful events
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-violet-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl p-12 backdrop-blur-sm border border-white/10">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to create your first event?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of event organizers who are already using our platform to bring people together.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">Start Creating Events</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home
