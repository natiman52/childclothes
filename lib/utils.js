import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const ALL_PRODUCTS = [
    { id: "1", name: "Waffle Textured Plush Set", price: 300, category: "Baby Boy", categorySlug: "baby-boy", image: "/images/todler 2.jpg" },
    { id: "2", name: "Ribbed Jogging Set", price: 350, category: "Baby Girl", categorySlug: "baby-girl", image: "/images/todler 1.jpg" },
    { id: "3", name: "Purl Knit Dungarees", price: 400, category: "Boys", categorySlug: "boys", image: "/images/boys 2.jpg" },
    { id: "4", name: "Cotton Jersey Top", price: 270, category: "Girls", categorySlug: "girls", image: "/images/girls 2.jpg" },
    { id: "5", name: "Cozy Wool Sweater", price: 190, category: "Boys", categorySlug: "boys", image: "/images/kid 2.jpg" },
    { id: "6", name: "Fluffy Pink Dress", price: 350, category: "Girls", categorySlug: "girls", image: "/images/kid 1.jpg" },
    { id: "7", name: "Denim Overall", price: 220, category: "Baby Boy", categorySlug: "baby-boy", image: "/images/todler boy 2.jpg" },
    { id: "8", name: "Floral Romper", price: 300, category: "Baby Girl", categorySlug: "baby-girl", image: "/images/tolder girls 2.jpg" },
];