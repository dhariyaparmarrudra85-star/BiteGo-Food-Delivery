import { ChefHat, ShieldCheck, Zap, Heart, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
            About BiteGo
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Connecting You with the Food You Love
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            BiteGo was built on a simple promise: <strong className="text-gray-900">Good Food. Fast Delivery.</strong> We bridge the gap between hungry food lovers and incredible neighborhood culinary artists.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Lightning Fast</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Optimized routing and dedicated delivery partners ensure your meals arrive piping hot, right on time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <ChefHat className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Top Rated Kitchens</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              From local hidden gems to premier restaurants, every partner is hand-vetted for safety, hygiene, and authentic flavors.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Made with Love</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Crafted to provide a seamless ordering experience with real-time tracking, smart recommendations, and fair partner policies.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
              At BiteGo, we believe great food brings people together. We empower local restaurant owners with modern digital tools to expand their reach, while giving food lovers an easy, transparent, and joyful dining experience at home or at work.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-3xl font-black text-orange-500">10,000+</p>
                <p className="text-xs font-semibold text-gray-500 uppercase mt-0.5">Happy Diners</p>
              </div>
              <div>
                <p className="text-3xl font-black text-orange-500">250+</p>
                <p className="text-xs font-semibold text-gray-500 uppercase mt-0.5">Partner Restaurants</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg h-72">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
              alt="Restaurant interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
