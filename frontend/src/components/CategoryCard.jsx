import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/restaurants?category=${encodeURIComponent(category.name)}`}
      className="group flex flex-col items-center p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="w-20 h-20 rounded-full overflow-hidden bg-orange-50 p-1 mb-2 group-hover:scale-105 transition-transform">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60';
          }}
        />
      </div>
      <span className="text-xs md:text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors text-center line-clamp-1">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryCard;
