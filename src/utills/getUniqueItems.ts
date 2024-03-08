import { ProductType } from '../models/ProductType';

export const getUniqueItems = (itemsArr: ProductType[]) => {
    if (!itemsArr.length) return [] as ProductType[];
    const uniqueItems = Array.from(
        new Set(itemsArr.map((item: ProductType) => item.id))
    ).map((id) => itemsArr.find((item: ProductType) => item.id === id));
    return uniqueItems as ProductType[];
};
