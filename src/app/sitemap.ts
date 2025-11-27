// app/sitemap.ts
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.BASE_URL || "https://www.nandur.site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produk`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/feed`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/petani`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Dynamic routes for products
  const products = await prisma.produk.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
    where: {
      status: {
        not: "TERJUAL",
      },
    },
  });

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/produk/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic routes for feeds
  const feeds = await prisma.feed.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
    take: 1000, // Limit to prevent too many URLs
    orderBy: {
      createdAt: "desc",
    },
  });

  const feedRoutes: MetadataRoute.Sitemap = feeds.map((feed) => ({
    url: `${baseUrl}/feed/${feed.id}`,
    lastModified: feed.updatedAt,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  // Dynamic routes for farmers (petani)
  const farmers = await prisma.user.findMany({
    select: {
      username: true,
      updatedAt: true,
    },
    where: {
      username: {
        not: null,
      },
      role: "PETANI",
    },
  });

  const farmerRoutes: MetadataRoute.Sitemap = farmers.map((farmer) => ({
    url: `${baseUrl}/petani/${farmer.username}`,
    lastModified: farmer.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic routes for projects (proyek)
  const projects = await prisma.proyekTani.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
    where: {
      status: {
        not: "SELESAI",
      },
    },
  });

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/proyek/${project.id}`,
    lastModified: project.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Combine all routes
  return [
    ...staticRoutes,
    ...productRoutes,
    ...feedRoutes,
    ...farmerRoutes,
    ...projectRoutes,
  ];
}
