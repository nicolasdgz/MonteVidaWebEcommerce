import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import { getStoreProducts, getSanityCategoriesWithImages } from "@/sanity/lib/queries";

const Home = async () => {
  const products = await getStoreProducts();
  const categories = await getSanityCategoriesWithImages();

  return (
    <main>
      <Hero products={products} />
      <Categories categories={categories} />
<CounDown promoProduct={products.find(p => p.isPromoSection)} />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
