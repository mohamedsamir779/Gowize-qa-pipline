import { PORTALS } from "common/customerTypes";

export const getCustomerCategory = (customer) => {
  const category = [];
  if (customer && customer.fx) {
    if (customer.fx.isClient || customer.fx.isIb || customer.fx.isDemo) {
      category.push(PORTALS.FOREX);
    }
  }
  if (customer && customer.crypto) {
    if (customer.crypto.isClient || customer.crypto.isIb || customer.crypto.isDemo) {
      category.push(PORTALS.CRYPTO);
    }
  }
  if (customer && customer.gold) {
    if (customer.gold.isClient) {
      category.push(PORTALS.GOLD);
    }
  }
  if (customer && customer.mm) {
    if (customer.mm.isClient) {
      category.push(PORTALS.MM);
    }
  }
  return category.length > 0 ? category.join(", ") : "-";
};