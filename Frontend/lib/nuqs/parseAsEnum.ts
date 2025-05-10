import { ProductSort } from "@/types/product";
import { createParser } from "nuqs/server";

export const parseAsProductSort = createParser({
  parse: (input: string): ProductSort => {
    switch (input.toLowerCase()) {
      case "default":
        return ProductSort.Default;
      case "price_asc":
        return ProductSort.PriceAsc;
      case "price_desc":
        return ProductSort.PriceDesc;
      case "newest":
        return ProductSort.Newest;
      case "oldest":
        return ProductSort.Oldest;
      default:
        return ProductSort.Default;
    }
  },
  serialize: (sort: ProductSort): string => {
    switch (sort) {
      case ProductSort.Default:
        return "default";
      case ProductSort.PriceAsc:
        return "price_asc";
      case ProductSort.PriceDesc:
        return "price_desc";
      case ProductSort.Newest:
        return "newest";
      case ProductSort.Oldest:
        return "oldest";
      default:
        return "default";
    }
  },
});
