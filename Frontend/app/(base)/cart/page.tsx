import 'server-only';
import CartPageComponent from './CartPageComponent';

export default async function CartPage() {
  // const session = await auth();
  // let carts: CartItemResponse[] = [];
  // if (session?.user.id) {
  //   const response = await getApiQuery(API_URL.cart, {
  //     userId: session.user.id,
  //   });
  //   if (response.success) {
  //     carts = response.data as CartItemResponse[];
  //   }
  // }
  // console.log(carts);
  return <CartPageComponent />;
}
