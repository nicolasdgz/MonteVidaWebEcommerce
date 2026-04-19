import { client } from './client'
import { groq } from 'next-sanity'
import { Product } from '@/types/product'
import { BlogItem } from '@/types/blogItem'
import { Category } from '@/types/category'
// Mapping the Sanity product to the template's Product type
export async function getSanityProducts(): Promise<Product[]> {
    const products = await client.fetch(
        groq`*[_type == "product"] {
      _id,
      title,
      price,
      shortDescription,
      discountedPrice,
      isHeroCarousel,
      isHeroOferta,
      isPromoSection,
      "slug": slug.current,
      "categories": categories[]->title,
      "imageUrl": mainImage.asset->url,
      "galleryUrls": gallery[].asset->url
    }`,
        {},
        { cache: 'no-store' }
    )

    return products.map((p: any) => ({
        id: p._id,
        title: p.title,
        price: p.price,
        slug: p.slug,
        shortDescription: p.shortDescription || "",
        discountedPrice: p.discountedPrice || null,
        isHeroCarousel: p.isHeroCarousel || false,
        isHeroOferta: p.isHeroOferta || false,
        reviews: 5, // Mock reviews for template consistency
        imgs: {
            thumbnails: [
                p.imageUrl || '/placeholder-img-product.jpg',
                ...(p.galleryUrls || [])
            ],
            previews: [
                p.imageUrl || '/placeholder-img-product.jpg',
                ...(p.galleryUrls || [])
            ]
        },
        categories: p.categories || [],
        isPromoSection: p.isPromoSection || false
    }))
}

export async function getSanityCategories(): Promise<string[]> {
    const categories = await client.fetch(
        groq`*[_type == "category"] { title }`,
        {},
        { cache: 'no-store' }
    )
    return categories.map((c: any) => c.title)
}

export async function getSanityCategoriesWithImages(): Promise<Category[]> {
    const categories = await client.fetch(
        groq`*[_type == "category"] {
            "id": _id,
            title,
            "img": image.asset->url
        }`,
        {},
        { cache: 'no-store' }
    )
    return categories.map((c: any) => ({
        id: c.id,
        title: c.title,
        img: c.img || '/placeholder-img-product.jpg'
    }))
}

export async function getSanityProductBySlug(slug: string): Promise<Product | null> {
    const p = await client.fetch(
        groq`*[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      price,
      discountedPrice,
      "slug": slug.current,
      "categories": categories[]->title,
      "imageUrl": mainImage.asset->url,
      "galleryUrls": gallery[].asset->url,
      shortDescription,
      presentation
    }`, 
        { slug },
        { cache: 'no-store' }
    )

    if (!p) return null;

    return {
        id: p._id,
        title: p.title,
        price: p.price,
        discountedPrice: p.discountedPrice || null,
        reviews: 5, // Mock
        imgs: {
            thumbnails: [
                p.imageUrl || '/placeholder-img-product.jpg',
                ...(p.galleryUrls || [])
            ],
            previews: [
                p.imageUrl || '/placeholder-img-product.jpg',
                ...(p.galleryUrls || [])
            ]
        },
        categories: p.categories || [],
        shortDescription: p.shortDescription || "",
        presentation: p.presentation || "",
        slug: p.slug
    }
}

export async function getStoreProducts(): Promise<Product[]> {
    const sanityProducts = await getSanityProducts();
    return sanityProducts;
}

export async function getSanityPosts(): Promise<BlogItem[]> {
    const posts = await client.fetch(
        groq`*[_type == "post"] | order(publishedAt desc) {
            title,
            "slug": slug.current,
            "img": mainImage.asset->url,
            publishedAt,
            excerpt,
            body
        }`,
        {},
        { cache: 'no-store' }
    )
    return posts.map((p: any) => ({
        title: p.title,
        slug: p.slug,
        img: p.img || '/images/blog/blog-01.jpg',
        date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' }) : "Reciente",
        views: 0,
        excerpt: p.excerpt,
        body: p.body
    }))
}

export async function getSanityPostBySlug(slug: string): Promise<BlogItem | null> {
    const post = await client.fetch(
        groq`*[_type == "post" && slug.current == $slug][0] {
            title,
            "slug": slug.current,
            "img": mainImage.asset->url,
            publishedAt,
            excerpt,
            body
        }`, 
        { slug },
        { cache: 'no-store' }
    )
    if (!post) return null;
    return {
        title: post.title,
        slug: post.slug,
        img: post.img || '/images/blog/blog-01.jpg',
        date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' }) : "Reciente",
        views: 0,
        excerpt: post.excerpt,
        body: post.body
    }
}
