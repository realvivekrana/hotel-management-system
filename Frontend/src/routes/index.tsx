import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hotelsApi } from "@/lib/api";
import type { Hotel } from "@/lib/types";
import { ArrowRight, ChevronRight, MapPin, Search, Star, Users } from "lucide-react";
import heroImg from "@/assets/hero-hotel.jpg";

// --- Static data ------------------------------------------------------------
const PROPERTY_TYPES = [
  { label: "Hotels",     icon: "🏨", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=280&fit=crop&auto=format&q=80&auto=format",    count: "1,200+" },
  { label: "Resorts",    icon: "🌴", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=280&fit=crop&auto=format&q=80",  count: "340+"   },
  { label: "Villas",     icon: "🏡", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=280&fit=crop&auto=format&q=80",  count: "520+"   },
  { label: "Heritage",   icon: "🏯", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=280&fit=crop&auto=format&q=80",  count: "180+"   },
  { label: "Cabins",     icon: "🌲", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop&auto=format&q=80",  count: "95+"    },
  { label: "Boutique",   icon: "✨", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=280&fit=crop&auto=format&q=80",    count: "260+"   },
  { label: "Apartments", icon: "🏢", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=280&fit=crop&auto=format&q=80",    count: "890+"   },
  { label: "Glamping",   icon: "⛺", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=280&fit=crop&auto=format&q=80", count: "60+"    },
];

const TOP_PROPERTIES = [
  { name: "Taj Fishermans Cove Resort",  city: "Mahabalipuram",  type: "Hotel",  rating: 8.2, label: "Very good",   reviews: 699,  price: 10710, discount: null,  img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "Heritage Madurai",            city: "Madurai",        type: "Resort", rating: 8.9, label: "Fabulous",    reviews: 1230, price: 6854,  discount: null,  img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "Radisson Blu Temple Bay",     city: "Mahabalipuram",  type: "Resort", rating: 8.5, label: "Very good",   reviews: 857,  price: 14500, discount: null,  img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "W Goa",                       city: "Vagator, Goa",   type: "Resort", rating: 8.0, label: "Very good",   reviews: 217,  price: 19667, discount: null,  img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "Grand Hyatt Goa",             city: "Panaji, Goa",    type: "Hotel",  rating: 8.8, label: "Fabulous",    reviews: 802,  price: 18000, discount: null,  img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "GReaT Trails Yercaud",        city: "Yercaud",        type: "Resort", rating: 9.1, label: "Superb",      reviews: 249,  price: 14400, discount: 16000, img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "Marari Beach Resort",         city: "Alleppey",       type: "Resort", rating: 9.3, label: "Superb",      reviews: 423,  price: 16871, discount: null,  img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "The Oberoi Gurgaon",          city: "Gurgaon",        type: "Hotel",  rating: 9.5, label: "Exceptional", reviews: 720,  price: 17000, discount: null,  img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "The Oberoi Udaivilas",        city: "Udaipur",        type: "Resort", rating: 9.7, label: "Exceptional", reviews: 217,  price: 30000, discount: null,  img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "Coconut Lagoon Kumarakom",    city: "Kumarakom",      type: "Resort", rating: 9.2, label: "Superb",      reviews: 415,  price: 18168, discount: null,  img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "Heritage Village Resort Goa", city: "Cansaulim, Goa", type: "Resort", rating: 9.1, label: "Superb",      reviews: 490,  price: 8066,  discount: 8962,  img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "Neemrana Fort Palace",        city: "Alwar",          type: "Hotel",  rating: 8.7, label: "Fabulous",    reviews: 330,  price: 10120, discount: 11000, img: "https://images.unsplash.com/photo-1587874522487-f9b0e51b86c2?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "The Oberoi Amarvilas",        city: "Agra",           type: "Hotel",  rating: 9.7, label: "Exceptional", reviews: 789,  price: 35000, discount: null,  img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "Royal Orchid Metropole",      city: "Mysore",         type: "Hotel",  rating: 8.6, label: "Fabulous",    reviews: 355,  price: 10999, discount: null,  img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop&auto=format&q=80" },
  { name: "Nidhivan Sarovar Portico",    city: "Vrindavan",      type: "Hotel",  rating: 7.7, label: "Good",        reviews: 487,  price: 6750,  discount: null,  img: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&h=400&fit=crop&auto=format&q=80" },
];

const WEEKEND_DEALS = [
  { name: "The Shanti Plaza",          city: "New Delhi", rating: 7.9, label: "Good",      reviews: 859, orig: 6160,  curr: 3696, badge: null,           img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Hotel Priyaj",              city: "Jaipur",    rating: 8.1, label: "Very good", reviews: 9,   orig: 5600,  curr: 3080, badge: "Getaway Deal", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "FabHotel Siris 18",         city: "Gurgaon",   rating: 7.4, label: "Good",      reviews: 18,  orig: 4693,  curr: 2323, badge: null,           img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Hotel Mehul International", city: "New Delhi", rating: 8.2, label: "Very good", reviews: 251, orig: 12598, curr: 7559, badge: null,           img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Sunday Hotel Jaipur",       city: "Jaipur",    rating: 8.0, label: "Very good", reviews: 698, orig: 11764, curr: 6670, badge: null,           img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Masaga by Qcent",           city: "Gurgaon",   rating: 7.0, label: "Good",      reviews: 10,  orig: 5998,  curr: 5098, badge: "Getaway Deal", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Hotel Casa Royal GK1",      city: "New Delhi", rating: 9.4, label: "Superb",    reviews: 26,  orig: 4298,  curr: 3224, badge: null,           img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Bloom Boutique Haveli",     city: "Jaipur",    rating: 8.7, label: "Fabulous",  reviews: 961, orig: 7560,  curr: 7182, badge: null,           img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Sunday Hotel Gurugram",     city: "Gurgaon",   rating: 7.1, label: "Good",      reviews: 74,  orig: 13952, curr: 8790, badge: null,           img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Super Townhouse Silver",    city: "New Delhi", rating: 7.4, label: "Good",      reviews: 50,  orig: 5161,  curr: 3251, badge: null,           img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Atithi Guest House",        city: "Jaipur",    rating: 8.2, label: "Very good", reviews: 721, orig: 2900,  curr: 2465, badge: null,           img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&h=340&fit=crop&auto=format&q=80" },
  { name: "Limewood Signature",        city: "Gurgaon",   rating: 8.9, label: "Fabulous",  reviews: 141, orig: 15480, curr: 6192, badge: "Getaway Deal", img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=340&fit=crop&auto=format&q=80" },
];

const HOMES_GUESTS_LOVE = [
  { name: "Avatar Living Safdarjung",  city: "New Delhi", type: "Bed & Breakfast", rating: 8.5, label: "Very good", reviews: 698, dist: "8.4 km",  orig: 3636,  curr: 2981, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=280&fit=crop&auto=format&q=80" },
  { name: "Aerovilla by JMD Group",    city: "New Delhi", type: "Bed & Breakfast", rating: 7.0, label: "Good",      reviews: 39,  dist: "13.6 km", orig: 3420,  curr: 1915, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=280&fit=crop&auto=format&q=80" },
  { name: "Olive Serviced Apartments", city: "New Delhi", type: "Apartment",       rating: 8.8, label: "Fabulous",  reviews: 155, dist: "6.7 km",  orig: 11688, curr: 4418, img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=280&fit=crop&auto=format&q=80" },
  { name: "House Of Comfort Delhi",    city: "New Delhi", type: "Guest House",     rating: 9.0, label: "Superb",    reviews: 703, dist: "9.5 km",  orig: 3492,  curr: 3143, img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=280&fit=crop&auto=format&q=80" },
  { name: "Hotel Opera Mahipalpur",    city: "New Delhi", type: "Guest House",     rating: 7.4, label: "Good",      reviews: 62,  dist: "13 km",   orig: 3110,  curr: 2644, img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=280&fit=crop&auto=format&q=80" },
  { name: "The Dream House BnB",       city: "New Delhi", type: "Bed & Breakfast", rating: 8.0, label: "Very good", reviews: 282, dist: "8.6 km",  orig: 4339,  curr: 3688, img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=280&fit=crop&auto=format&q=80" },
  { name: "Hotel Nav Durga",           city: "New Delhi", type: "Guest House",     rating: 7.8, label: "Good",      reviews: 20,  dist: "1.6 km",  orig: 2429,  curr: 1870, img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=280&fit=crop&auto=format&q=80" },
  { name: "Colonels Retreat",          city: "New Delhi", type: "Bed & Breakfast", rating: 9.3, label: "Superb",    reviews: 648, dist: "7.4 km",  orig: 6860,  curr: null, img: "https://images.unsplash.com/photo-1587874522487-f9b0e51b86c2?w=400&h=280&fit=crop&auto=format&q=80" },
  { name: "Hotel Welcome Palace",      city: "New Delhi", type: "Guest House",     rating: 9.2, label: "Superb",    reviews: 32,  dist: "1.4 km",  orig: 2599,  curr: 1949, img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=280&fit=crop&auto=format&q=80" },
  { name: "Aashianaa Gracious Living", city: "New Delhi", type: "Guest House",     rating: 8.3, label: "Very good", reviews: 354, dist: "10.7 km", orig: 3292,  curr: null, img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=280&fit=crop&auto=format&q=80" },
];

const EXPLORE_INDIA = [
  { city: "New Delhi",  props: "3,465", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=260&fit=crop&auto=format&q=80" },
  { city: "Bengaluru",  props: "3,344", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=260&fit=crop&auto=format&q=80" },
  { city: "Mumbai",     props: "1,813", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=260&fit=crop&auto=format&q=80" },
  { city: "Chennai",    props: "1,404", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=260&fit=crop&auto=format&q=80" },
  { city: "Varanasi",   props: "2,185", img: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=400&h=260&fit=crop&auto=format&q=80" },
  { city: "Hyderabad",  props: "2,027", img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=260&fit=crop&auto=format&q=80" },
  { city: "Jaipur",     props: "1,972", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=260&fit=crop&auto=format&q=80" },
  { city: "Puducherry", props: "1,054", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=260&fit=crop&auto=format&q=80" },
  { city: "Gurgaon",    props: "1,569", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=260&fit=crop&auto=format&q=80" },
  { city: "Pune",       props: "1,240", img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=260&fit=crop&auto=format&q=80" },
];

const TRIP_PLANNER = [
  { city: "New Delhi", dist: "2.6 km",   img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Agra",      dist: "181 km",   img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Jaipur",    dist: "238 km",   img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Lucknow",   dist: "416 km",   img: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Varanasi",  dist: "680 km",   img: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Mumbai",    dist: "1,167 km", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Hyderabad", dist: "1,256 km", img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Kolkata",   dist: "1,304 km", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&h=200&fit=crop&auto=format&q=80" },
];

const TRENDING_DEST = [
  { city: "New Delhi", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Bengaluru", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Mumbai",    img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Chennai",   img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop&auto=format&q=80" },
  { city: "Varanasi",  img: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=300&h=200&fit=crop&auto=format&q=80" },
];

const POPULAR_SEARCHES = ["Ooty hotels","Hyderabad hotels","Jaipur hotels","Puri hotels","Cochin hotels","Munnar hotels","Mumbai hotels","Bengaluru hotels","Udaipur hotels","Varanasi hotels","Srinagar hotels","Rishikesh hotels","Hampi hotels","Puducherry hotels","Varkala hotels","Alleppey hotels","Shimla hotels","Nainital hotels","Mangalore hotels","Lonavala hotels","Ahmedabad hotels","Ayodhya hotels","Kolkata hotels","Alibaug hotels","Tiruvannamalai hotels"];


// --- Helpers -----------------------------------------------------------------

function RatingBadge({ score, label }: { score: number; label: string }) {
  const bg = score >= 9.5 ? "bg-green-700" : score >= 9 ? "bg-green-600" : score >= 8 ? "bg-blue-600" : "bg-amber-600";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`${bg} text-white text-xs font-bold px-2 py-0.5 rounded-md`}>{score}</span>
      <span className="text-xs font-semibold text-foreground">{label}</span>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Royal Stay Inn � Find your next stay" }, { name: "description", content: "Search low prices on hotels, homes and much more across India." }] }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [featured, setFeatured] = useState<Hotel[]>([]);
  const [showAllSearches, setShowAllSearches] = useState(false);

  useEffect(() => { hotelsApi.featured().then(setFeatured); }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/hotels", search: { city: city || undefined, checkIn: checkIn || undefined, checkOut: checkOut || undefined, guests } });
  };

  const navTo = (c: string) => navigate({ to: "/hotels", search: { city: c } });

  return (
    <SiteShell>

      {/* -- HERO -- */}
      <section className="relative min-h-[92svh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Luxury Indian Resort" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/72 to-primary/90" />
        </div>
        <div className="hidden sm:block absolute top-16 right-10 w-20 h-20 border-2 border-amber-400/25 rounded-full animate-float pointer-events-none" />
        <div className="hidden sm:block absolute bottom-28 left-8 w-14 h-14 border-2 border-amber-400/20 rounded-full animate-float pointer-events-none" style={{ animationDelay: "1.2s" }} />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 pt-20 pb-10 sm:pt-28 sm:pb-16">
          <div className="animate-fadeInUp opacity-0" style={{ animationDelay: "0.15s" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-100 backdrop-blur-md">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" /></span>
              Heritage Luxury � Across India
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white animate-fadeInUp opacity-0" style={{ animationDelay: "0.3s" }}>
            Find your next stay
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent animate-shimmer">Search low prices</span>
          </h1>
          <p className="mt-3 max-w-lg text-base sm:text-lg text-amber-50/80 animate-fadeInUp opacity-0" style={{ animationDelay: "0.45s" }}>Hotels, homes and much more across India � book now, pay at the property.</p>
          <div className="mt-6 flex flex-wrap gap-6 sm:gap-10 animate-fadeInUp opacity-0" style={{ animationDelay: "0.55s" }}>
            {[{ v: "2M+", l: "Properties" }, { v: "300M+", l: "Reviews" }, { v: "FREE", l: "Cancellation" }].map((s) => (
              <div key={s.l} className="group"><div className="text-2xl sm:text-3xl font-bold text-amber-300 group-hover:scale-110 transition-transform">{s.v}</div><div className="text-xs text-amber-100/70 uppercase tracking-wider mt-0.5">{s.l}</div></div>
            ))}
          </div>
          {/* Search bar */}
          <form onSubmit={onSearch} className="mt-8 animate-fadeInUp opacity-0" style={{ animationDelay: "0.7s" }}>
            <div className="rounded-2xl border-2 border-amber-400/30 bg-white/95 backdrop-blur-xl shadow-2xl shadow-primary/30 p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_0.7fr_auto] md:gap-0">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/30 md:bg-transparent md:rounded-none md:border-r md:border-border/30">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Where are you going?" className="border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent text-sm font-medium" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/30 md:bg-transparent md:rounded-none md:border-r md:border-border/30">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">Check-in</span>
                  <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent text-sm" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/30 md:bg-transparent md:rounded-none md:border-r md:border-border/30">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">Check-out</span>
                  <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent text-sm" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/30 md:bg-transparent md:rounded-none">
                  <Users className="h-4 w-4 text-primary shrink-0" />
                  <Input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent text-sm w-14" />
                </div>
                <div className="md:pl-2">
                  <Button type="submit" size="lg" className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    <Search className="mr-2 h-4 w-4" /> Search
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="relative z-10 flex justify-center pb-8 animate-bounce">
          <div className="flex flex-col items-center gap-1 text-amber-100/40"><span className="text-[10px] uppercase tracking-widest">Scroll</span><div className="h-6 w-4 rounded-full border border-amber-100/30 flex items-start justify-center pt-1"><div className="h-1.5 w-1 rounded-full bg-amber-100/50 animate-pulse" /></div></div>
        </div>
      </section>

      {/* -- WHY ROYAL STAY INN -- */}
      <section className="bg-gradient-to-r from-primary/8 via-amber-500/5 to-primary/8 border-y border-amber-400/15 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: "🏷️", t: "Book now, pay at property",     d: "No upfront payment needed" },
            { icon: "✅", t: "FREE cancellation on most rooms", d: "Flexibility when plans change" },
            { icon: "⭐", t: "300M+ reviews",                   d: "Trusted info from real guests" },
            { icon: "🌍", t: "2M+ properties worldwide",        d: "Hotels, homes, apartments & more" },
          ].map((b) => (
            <div key={b.t} className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-amber-400/15 hover:border-amber-400/40 hover:shadow-md transition-all group">
              <span className="text-2xl group-hover:scale-110 transition-transform shrink-0">{b.icon}</span>
              <div><p className="text-sm font-bold text-foreground leading-tight">{b.t}</p><p className="text-xs text-muted-foreground mt-0.5">{b.d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* -- GETAWAY DEALS BANNER -- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="rounded-3xl overflow-hidden relative bg-gradient-to-br from-primary via-primary-glow to-primary/90 p-6 sm:p-10">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cpath d=M30 0L36 24L60 30L36 36L30 60L24 36L0 30L24 24Z fill=%23d4af37/%3E%3C/svg%3E\")", backgroundSize: "60px 60px" }} />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <span className="inline-block bg-amber-400 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">Offers</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white">Escape for less with our Getaway Deals</h2>
              <p className="mt-2 text-amber-100/80 text-sm max-w-md">No catch. Just getaways. At least 15% off select stays worldwide � just book and go.</p>
            </div>
            <Button asChild size="lg" className="shrink-0 bg-white text-primary font-bold hover:bg-amber-50 shadow-xl hover:scale-105 transition-all rounded-full px-8">
              <Link to="/hotels">Save with a Getaway Deal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* -- TOP UNIQUE PROPERTIES -- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold">Stay at our top unique properties</h2>
            <p className="text-sm text-muted-foreground mt-1">From castles and villas to boats and igloos, we have got it all</p>
          </div>
          <Link to="/hotels" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">View all <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOP_PROPERTIES.slice(0, 6).map((h, i) => (
            <Link key={i} to="/hotels" className="group block">
              <div className="flex gap-3 p-3 rounded-2xl border-2 border-border/50 hover:border-amber-400/50 hover:shadow-lg transition-all duration-300 bg-white">
                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-xl">
                  <img src={h.img} alt={h.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{h.type}</span>
                  <h3 className="font-semibold text-sm leading-tight mt-0.5 group-hover:text-primary transition-colors line-clamp-2">{h.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{h.city}</p>
                  <RatingBadge score={h.rating} label={h.label} />
                  <p className="text-xs text-muted-foreground mt-0.5">{h.reviews.toLocaleString()} reviews</p>
                  <div className="mt-1">
                    {h.discount && <p className="text-xs text-muted-foreground line-through">₹ {h.discount.toLocaleString("en-IN")}</p>}
                    <p className="text-sm font-bold text-foreground">Starting from ₹ {h.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Show remaining 9 in a wider grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {TOP_PROPERTIES.slice(6).map((h, i) => (
            <Link key={i} to="/hotels" className="group block">
              <div className="flex gap-3 p-3 rounded-2xl border-2 border-border/50 hover:border-amber-400/50 hover:shadow-lg transition-all duration-300 bg-white">
                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-xl">
                  <img src={h.img} alt={h.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{h.type}</span>
                  <h3 className="font-semibold text-sm leading-tight mt-0.5 group-hover:text-primary transition-colors line-clamp-2">{h.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{h.city}</p>
                  <RatingBadge score={h.rating} label={h.label} />
                  <p className="text-xs text-muted-foreground mt-0.5">{h.reviews.toLocaleString()} reviews</p>
                  <div className="mt-1">
                    {h.discount && <p className="text-xs text-muted-foreground line-through">₹ {h.discount.toLocaleString("en-IN")}</p>}
                    <p className="text-sm font-bold text-foreground">Starting from ₹ {h.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* -- WEEKEND DEALS -- */}
      <section className="bg-gradient-to-br from-primary/5 to-amber-500/5 border-y border-amber-400/15 px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold">Deals for the weekend</h2>
              <p className="text-sm text-muted-foreground mt-1">Save on stays � Book now, pay later</p>
            </div>
            <Link to="/hotels" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">See all deals <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {WEEKEND_DEALS.map((h, i) => (
              <Link key={i} to="/hotels" className="group block">
                <div className="rounded-2xl overflow-hidden border-2 border-border/50 hover:border-amber-400/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={h.img} alt={h.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-600" />
                    {h.badge && <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">{h.badge}</span>}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">{h.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{h.city}</p>
                    <div className="mt-2"><RatingBadge score={h.rating} label={h.label} /></div>
                    <p className="text-xs text-muted-foreground mt-1">{h.reviews.toLocaleString()} reviews � 2 nights</p>
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <p className="text-xs text-muted-foreground line-through">₹ {h.orig.toLocaleString("en-IN")}</p>
                      <p className="text-lg font-bold text-primary">₹ {h.curr.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-green-600 font-semibold">Save {Math.round((1 - h.curr / h.orig) * 100)}%</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -- BROWSE BY PROPERTY TYPE -- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h2 className="font-serif text-xl sm:text-2xl font-semibold mb-6">Browse by property type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {PROPERTY_TYPES.map((pt) => (
            <button key={pt.label} onClick={() => navTo(pt.label)} className="group flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-border/50 hover:border-amber-400/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
              <div className="w-full aspect-square overflow-hidden rounded-xl">
                <img src={pt.img} alt={pt.label} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{pt.label}</span>
              <span className="text-[10px] text-muted-foreground">{pt.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* -- TRENDING DESTINATIONS -- */}
      <section className="bg-muted/30 border-y border-border/40 px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-xl sm:text-2xl font-semibold mb-1">Trending destinations</h2>
          <p className="text-sm text-muted-foreground mb-6">Most popular choices for travellers from India</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TRENDING_DEST.map((d) => (
              <button key={d.city} onClick={() => navTo(d.city)} className="group relative overflow-hidden rounded-2xl aspect-[3/4] border-2 border-transparent hover:border-amber-400/60 hover:shadow-xl transition-all duration-300">
                <img src={d.img} alt={d.city} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-600" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm">{d.city}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* -- HOMES GUESTS LOVE -- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold">Homes guests love</h2>
            <p className="text-sm text-muted-foreground mt-1">Top-rated stays with exceptional hospitality</p>
          </div>
          <Link to="/hotels" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">See all <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {HOMES_GUESTS_LOVE.map((h, i) => (
            <Link key={i} to="/hotels" className="group block">
              <div className="rounded-2xl overflow-hidden border-2 border-border/50 hover:border-amber-400/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={h.img} alt={h.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-600" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-1 rounded-full shadow-md">{h.type}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">{h.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{h.city} � {h.dist} from centre</p>
                  <div className="mt-2"><RatingBadge score={h.rating} label={h.label} /></div>
                  <p className="text-xs text-muted-foreground mt-1">{h.reviews.toLocaleString()} reviews</p>
                  <div className="mt-3 pt-3 border-t border-border/40">
                    {h.curr && <p className="text-xs text-muted-foreground line-through">₹ {h.orig.toLocaleString("en-IN")}</p>}
                    <p className="text-base font-bold text-primary">? {(h.curr ?? h.orig).toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-muted-foreground">Starting from � per night</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* -- FEATURED FROM DB -- */}
      <section className="bg-gradient-to-br from-primary/5 to-amber-500/5 border-y border-amber-400/15 px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold">Heritage &amp; Luxury Properties</h2>
              <p className="text-sm text-muted-foreground mt-1">Handpicked palaces, havelis and resorts</p>
            </div>
            <Link to="/hotels" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((h, i) => (
              <Link key={h.id} to="/hotels/$id" params={{ id: h.id }} className="group block animate-fadeInUp opacity-0" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
                <div className="rounded-2xl overflow-hidden border-2 border-border/50 hover:border-amber-400/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={h.photos[0]} alt={h.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400/60 opacity-0 group-hover:opacity-100 group-hover:w-14 group-hover:h-14 transition-all duration-500" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400/60 opacity-0 group-hover:opacity-100 group-hover:w-14 group-hover:h-14 transition-all duration-500" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-primary shadow-md">{h.type}</div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg"><Star className="h-3 w-3 fill-current" /> {h.rating}</div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1"><MapPin className="h-3 w-3" />{h.city}</p>
                    <h3 className="mt-1.5 font-serif text-xl leading-tight group-hover:text-primary transition-colors">{h.name}</h3>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{h.title}</p>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/40">
                      <div className="flex items-baseline gap-1"><span className="text-xl font-bold text-primary">₹{(h.cheapestPrice * 83).toLocaleString("en-IN")}</span><span className="text-xs text-muted-foreground">/ night</span></div>
                      <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">View <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -- EXPLORE INDIA -- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h2 className="font-serif text-xl sm:text-2xl font-semibold mb-1">Explore India</h2>
        <p className="text-sm text-muted-foreground mb-6">These popular destinations have a lot to offer</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {EXPLORE_INDIA.map((d) => (
            <button key={d.city} onClick={() => navTo(d.city)} className="group relative overflow-hidden rounded-2xl aspect-[4/3] border-2 border-transparent hover:border-amber-400/60 hover:shadow-xl transition-all duration-300">
              <img src={d.img} alt={d.city} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-600" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                <p className="text-white font-bold text-sm leading-tight">{d.city}</p>
                <p className="text-white/70 text-xs">{d.props} properties</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* -- TRIP PLANNER -- */}
      <section className="bg-muted/30 border-y border-border/40 px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-xl sm:text-2xl font-semibold mb-1">Quick and easy trip planner</h2>
          <p className="text-sm text-muted-foreground mb-6">Pick a vibe and explore the top destinations in India</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {TRIP_PLANNER.map((d) => (
              <button key={d.city} onClick={() => navTo(d.city)} className="group shrink-0 w-36 sm:w-44 rounded-2xl overflow-hidden border-2 border-transparent hover:border-amber-400/60 hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={d.img} alt={d.city} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-600" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                    <p className="text-white font-bold text-sm">{d.city}</p>
                    <p className="text-white/70 text-xs">{d.dist} away</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* -- GENIUS / SIGN IN BANNER -- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-full">GENIUS</span>
              <span className="text-white font-bold text-sm">Travel more, spend less</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white">Sign in, save money</h2>
            <p className="mt-2 text-blue-100 text-sm max-w-md">Save 10% or more at participating properties � just look for the blue Genius label.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button asChild size="lg" className="bg-white text-blue-700 font-bold hover:bg-blue-50 shadow-xl rounded-full px-8">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 rounded-full px-8 font-semibold">
              <Link to="/signup">Register</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* -- POPULAR SEARCHES -- */}
      <section className="bg-muted/20 border-t border-border/40 px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-xl sm:text-2xl font-semibold mb-1">Popular with travellers from India</h2>
          <p className="text-sm text-muted-foreground mb-5">Trending searches right now</p>
          <div className="flex flex-wrap gap-2">
            {(showAllSearches ? POPULAR_SEARCHES : POPULAR_SEARCHES.slice(0, 15)).map((s) => (
              <button key={s} onClick={() => navTo(s.replace(" hotels", ""))} className="px-4 py-2 rounded-full border-2 border-border/60 bg-white text-sm font-medium text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-md transition-all duration-200">
                {s}
              </button>
            ))}
            {!showAllSearches && (
              <button onClick={() => setShowAllSearches(true)} className="px-4 py-2 rounded-full border-2 border-primary/30 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 transition-all">
                Show more +
              </button>
            )}
          </div>
        </div>
      </section>

      {/* -- TESTIMONIALS -- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3"><div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500" /><span className="text-xs font-bold uppercase tracking-widest text-amber-600">Guest Reviews</span><div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-500" /></div>
          <h2 className="font-serif text-2xl sm:text-3xl">What our guests say</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[{ name: "Priya Sharma", loc: "Mumbai", text: "The heritage property was breathtaking! Every moment felt like stepping into the era of maharajas. Truly unforgettable!", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format&q=80", rating: 9.8 },
            { name: "Rajesh Kumar", loc: "Delhi", text: "Royal Stay Inn exceeded all expectations. The blend of traditional architecture with modern amenities was perfect.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format&q=80", rating: 9.5 },
            { name: "Ananya Patel", loc: "Bangalore", text: "Cultural performances, authentic cuisine, and luxurious accommodations. This is how heritage tourism should be done.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format&q=80", rating: 9.7 },
          ].map((t, i) => (
            <div key={t.name} className="p-5 rounded-2xl border-2 border-border/50 hover:border-amber-400/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 bg-white relative overflow-hidden group animate-fadeInUp opacity-0" style={{ animationDelay: `${0.15 * (i + 1)}s` }}>
              <div className="absolute top-3 right-4 text-5xl text-amber-400/10 font-serif group-hover:text-amber-400/20 transition-colors leading-none">"</div>
              <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />)}</div>
              <p className="text-sm text-foreground leading-relaxed italic mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <div className="relative shrink-0"><img src={t.img} alt={t.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-amber-400/30 group-hover:ring-amber-400/60 transition-all" /><div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">✓</div></div>
                <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-muted-foreground">{t.loc}, India</p></div>
                <div className="ml-auto"><RatingBadge score={t.rating} label="Exceptional" /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </SiteShell>
  );
}




