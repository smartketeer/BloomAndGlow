import { Link, Head } from '@inertiajs/react';
import { useCart } from '../Contexts/CartContext';
import CartDrawer from '../Components/CartDrawer';

export default function Welcome({ auth, products }) {
    const { cartCount, toggleCartDrawer, addToCart } = useCart();

    // Map products to the correct local images
    const getImageUrl = (name) => {
        const map = {
            "Red Roses Bouquet": "/images/red_roses_white_center_bouquet.png",
            "Sunflowers": "/images/money_bouquet_sunflower.png",
            "Carnations": "/images/colorful_carnation_rose_bouquet.png",
            "White Lilies": "/images/pink_lily_and_roses_bouquet.png",
            "Chrysanthemums": "/images/white_lisianthus_bouquet_1.png",
            "Peonies": "/images/pink_roses_chantelle_collection.png"
        };
        return map[name] || "/images/large_pink_rose_bouquet.png";
    };

    return (
        <>
            <Head title="Welcome to Bloom&Grow" />
            <CartDrawer getImageUrl={getImageUrl} />
            <div className="min-h-screen bg-peach text-gray-800 font-sans">
                {/* Header */}
                <header className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-peach-dark/30">
                    <div className="flex-1">
                        <span className="font-serif text-3xl font-bold tracking-tight text-sage-dark">
                            Bloom&Grow
                        </span>
                    </div>
                    
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex flex-1 justify-center space-x-8">
                        {['FLOWERS', 'SHOP', 'OCCASIONS', 'CORPORATE', 'ABOUT US'].map(item => (
                            <Link key={item} href="#" className="text-sm font-semibold tracking-wider text-gray-700 hover:text-tangerine transition-colors">
                                {item}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1 flex justify-end items-center space-x-6">
                        <button aria-label="Search" className="hover:text-tangerine transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="hover:text-tangerine transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </Link>
                        ) : (
                            <Link href={route('login')} className="hover:text-tangerine transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </Link>
                        )}
                        <button onClick={toggleCartDrawer} aria-label="Cart" className="relative hover:text-tangerine transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span className="absolute -top-1.5 -right-2 bg-tangerine text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative w-full min-h-[500px] md:h-[600px] flex items-center px-6 md:px-12 py-12 md:py-0 overflow-hidden bg-peach">
                    <div className="relative z-10 max-w-lg">
                        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight text-sage-dark mb-6">
                            BIGGER.<br />
                            <span className="text-tangerine">BRIGHTER.</span><br />
                            BETTER.
                        </h1>
                        <p className="text-gray-700 mb-8 max-w-sm text-lg">
                            Thoughtfully designed flowers and gifts that celebrate life, nature and every meaningful moment.
                        </p>
                        <Link href="#" className="inline-flex items-center px-8 py-3 bg-sage hover:bg-sage-dark text-white font-semibold rounded-full transition-colors shadow-lg">
                            SHOP FLOWERS
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        </Link>
                    </div>
                    {/* Hero Graphic */}
                    <div className="absolute right-0 top-0 w-2/3 h-full hidden md:block">
                        <div className="absolute inset-0 bg-sage rounded-bl-[200px] transform translate-x-12 -translate-y-12"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1563241597-12a4145ee5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                            alt="Beautiful bouquet" 
                            className="absolute right-12 top-12 w-3/4 h-[90%] object-cover rounded-bl-[160px] shadow-2xl"
                        />
                    </div>
                </section>

                {/* Features Bar */}
                <section className="py-12 bg-white/50 border-y border-peach-dark/30">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { title: 'SAME DAY DELIVERY', desc: 'Order before 11:00AM', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                            { title: 'FRESH FROM FARMS', desc: 'Handpicked with care', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
                            { title: 'EXPERT FLORISTS', desc: 'Crafted by professionals', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
                            { title: 'HAPPINESS GUARANTEED', desc: 'Your satisfaction, always', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                        ].map(feature => (
                            <div key={feature.title} className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-peach-dark rounded-full flex items-center justify-center text-sage-dark">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feature.icon}></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-wider">{feature.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Shop Our Collections */}
                <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                        <h2 className="font-serif text-3xl font-bold text-sage-dark flex items-center">
                            Shop Our Collections
                            <svg className="ml-3 w-6 h-6 text-tangerine hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        </h2>
                        <Link href="#" className="px-6 py-2 border border-sage text-sage font-semibold rounded-full hover:bg-sage hover:text-white transition-colors text-sm">
                            VIEW ALL
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products && products.slice(0, 4).map(product => (
                            <div key={product.product_id} className="group cursor-pointer">
                                <div className="bg-peach-light rounded-2xl p-4 md:p-6 aspect-square flex items-center justify-center mb-4 transition-transform transform group-hover:scale-105">
                                    <img src={getImageUrl(product.flower_name)} alt={product.flower_name} className="w-full h-full object-cover rounded-xl shadow-sm" />
                                </div>
                                <div className="flex justify-between items-start px-2">
                                    <div>
                                        <h3 className="font-bold text-sm tracking-wide uppercase">{product.flower_name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">From ₱{product.price}</p>
                                    </div>
                                    <button onClick={() => addToCart(product)} className="w-8 h-8 rounded-full bg-tangerine-light text-white flex items-center justify-center group-hover:bg-tangerine transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Banner Section */}
                <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="bg-sage-dark rounded-3xl overflow-hidden flex flex-col md:flex-row relative">
                        <div className="md:w-1/2 bg-peach-dark p-8 md:p-16 flex flex-col justify-center md:rounded-r-3xl z-10 md:-mr-8 relative">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                FLOWERS THAT TELL<br/>BEAUTIFUL STORIES
                            </h2>
                            <p className="text-gray-700 mb-8 text-lg">
                                We source the finest blooms and design with heart to bring beauty, joy and meaning to every moment.
                            </p>
                            <div>
                                <Link href="#" className="inline-flex items-center px-8 py-3 border-2 border-sage-dark text-sage-dark font-semibold rounded-full hover:bg-sage-dark hover:text-white transition-colors">
                                    OUR STORY
                                </Link>
                            </div>
                            <svg className="absolute bottom-8 right-8 w-12 h-12 text-tangerine opacity-50 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        </div>
                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-sage">
                            <img src="https://images.unsplash.com/photo-1574621124654-20aeb5a2b10a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Florist arranging flowers" className="w-full h-full object-cover opacity-90"/>
                        </div>
                    </div>
                </section>

                {/* Shop By Occasion */}
                <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
                    <h2 className="font-serif text-3xl font-bold text-sage-dark flex items-center justify-start mb-12">
                        Shop By Occasion
                        <svg className="ml-3 w-6 h-6 text-tangerine hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                        {['BIRTHDAY', 'ANNIVERSARY', 'CONGRATULATIONS', 'THANK YOU', 'SYMPATHY', 'NEW BABY'].map(occasion => (
                            <div key={occasion} className="flex flex-col items-center group cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-peach-dark flex items-center justify-center mb-4 text-sage group-hover:bg-tangerine group-hover:text-white transition-colors shadow-sm">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                                </div>
                                <span className="text-xs font-bold tracking-wider">{occasion}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Newsletter */}
                <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
                    <div className="bg-sage rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                        <div className="relative z-10 text-white mb-6 md:mb-0 text-center md:text-left">
                            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2">10% OFF YOUR FIRST ORDER</h3>
                            <p className="text-sage-light font-medium">Join our community and enjoy your first order.</p>
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row w-full md:w-auto gap-4 sm:gap-0">
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="px-6 py-4 rounded-full sm:rounded-l-full sm:rounded-r-none w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-tangerine text-gray-800 border-none shadow-sm"
                            />
                            <button className="bg-tangerine hover:bg-tangerine-dark text-white font-bold px-8 py-4 rounded-full sm:rounded-l-none sm:rounded-r-full transition-colors shadow-sm">
                                SUBSCRIBE
                            </button>
                        </div>
                    </div>
                </section>

                {/* Best Sellers */}
                <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto pb-24">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                        <h2 className="font-serif text-3xl font-bold text-sage-dark flex items-center">
                            Best Sellers
                            <svg className="ml-3 w-6 h-6 text-tangerine hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        </h2>
                        <Link href="#" className="px-6 py-2 border border-sage text-sage font-semibold rounded-full hover:bg-sage hover:text-white transition-colors text-sm">
                            VIEW ALL
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products && products.slice(4, 8).map(product => (
                            <div key={product.product_id} className="group cursor-pointer">
                                <div className="bg-peach-light rounded-2xl p-4 md:p-6 aspect-square flex items-center justify-center mb-4 transition-transform transform group-hover:scale-105">
                                    <img src={getImageUrl(product.flower_name)} alt={product.flower_name} className="w-full h-full object-cover rounded-xl shadow-sm" />
                                </div>
                                <div className="flex justify-between items-start px-2">
                                    <div>
                                        <h3 className="font-bold text-sm tracking-wide uppercase">{product.flower_name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">₱{product.price}</p>
                                    </div>
                                    <button onClick={() => addToCart(product)} className="w-8 h-8 rounded-full bg-tangerine-light text-white flex items-center justify-center group-hover:bg-tangerine transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-sage-dark text-sage-light py-12 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                        <div className="font-serif text-2xl font-bold text-white">Bloom&Grow</div>
                        <p className="text-sm">© 2026 Bloom&Grow. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
