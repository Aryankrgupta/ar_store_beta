// import Header from "@/components/Header";
// import styled from "styled-components";
// import Center from "@/components/Center";
// import Button from "@/components/Button";
// import {useContext, useEffect, useState} from "react";
// import {CartContext} from "@/components/CartContext";
// import axios from "axios";
// import Table from "@/components/Table";
// import Input from "@/components/Input";
// import {RevealWrapper} from "next-reveal";
// import {useSession} from "next-auth/react";

// const ColumnsWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   @media screen and (min-width: 768px) {
//     grid-template-columns: 1.2fr .8fr;
//   }
//   gap: 40px;
//   margin-top: 40px;
//   margin-bottom: 40px;
//   table thead tr th:nth-child(3),
//   table tbody tr td:nth-child(3),
//   table tbody tr.subtotal td:nth-child(2){
//     text-align: right;
//   }
//   table tr.subtotal td{
//     padding: 15px 0;
//   }
//   table tbody tr.subtotal td:nth-child(2){
//     font-size: 1.4rem;
//   }
//   tr.total td{
//     font-weight: bold;
//   }
// `;

// const Box = styled.div`
//   background-color: #fff;
//   border-radius: 10px;
//   padding: 30px;
// `;

// const ProductInfoCell = styled.td`
//   padding: 10px 0;
//   button{padding:0 !important;}
// `;

// const ProductImageBox = styled.div`
//   width: 70px;
//   height: 100px;
//   padding: 2px;
//   border: 1px solid rgba(0, 0, 0, 0.1);
//   display:flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 10px;
//   img{
//     max-width: 60px;
//     max-height: 60px;
//   }
//   @media screen and (min-width: 768px) {
//     padding: 10px;
//     width: 100px;
//     height: 100px;
//     img{
//       max-width: 80px;
//       max-height: 80px;
//     }
//   }
// `;

// const QuantityLabel = styled.span`
//   padding: 0 15px;
//   display: block;
//   @media screen and (min-width: 768px) {
//     display: inline-block;
//     padding: 0 6px;
//   }
// `;

// const CityHolder = styled.div`
//   display:flex;
//   gap: 5px;
// `;

// export default function CartPage() {
//   const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
//   const {data:session} = useSession();
//   const [products,setProducts] = useState([]);
//   const [name,setName] = useState('');
//   const [email,setEmail] = useState('');
//   const [city,setCity] = useState('');
//   const [postalCode,setPostalCode] = useState('');
//   const [streetAddress,setStreetAddress] = useState('');
//   const [country,setCountry] = useState('');
//   const [isSuccess,setIsSuccess] = useState(false);
//   const [shippingFee, setShippingFee] = useState(null);
//   useEffect(() => {
//     if (cartProducts.length > 0) {
//       axios.post('/api/cart', {ids:cartProducts})
//         .then(response => {
//           setProducts(response.data);
//         })
//     } else {
//       setProducts([]);
//     }
//   }, [cartProducts]);
//   useEffect(() => {
//     if (typeof window === 'undefined') {
//       return;
//     }
//     if (window?.location.href.includes('success')) {
//       setIsSuccess(true);
//       clearCart();
//     }
//     axios.get('/api/settings?name=shippingFee').then(res => {
//       setShippingFee(res.data.value);
//     })
//   }, []);
//   useEffect(() => {
//     if (!session) {
//       return;
//     }
//     axios.get('/api/address').then(response => {
//       setName(response.data.name);
//       setEmail(response.data.email);
//       setCity(response.data.city);
//       setPostalCode(response.data.postalCode);
//       setStreetAddress(response.data.streetAddress);
//       setCountry(response.data.country);
//     });
//   }, [session]);
//   function moreOfThisProduct(id) {
//     addProduct(id);
//   }
//   function lessOfThisProduct(id) {
//     removeProduct(id);
//   }
//   async function goToPayment() {
//     const response = await axios.post('/api/checkout', {
//       name,email,city,postalCode,streetAddress,country,
//       cartProducts,
//     });
//     if (response.data.url) {
//       window.location = response.data.url;
//     }
//   }
//   let productsTotal = 0;
//   for (const productId of cartProducts) {
//     const price = products.find(p => p._id === productId)?.price || 0;
//     productsTotal += price;
//   }

//   if (isSuccess) {
//     return (
//       <>
//         <Header />
//         <Center>
//           <ColumnsWrapper>
//             <Box>
//               <h1>Thanks for your order!</h1>
//               <p>We will email you when your order will be sent.</p>
//             </Box>
//           </ColumnsWrapper>
//         </Center>
//       </>
//     );
//   }
//   return (
//     <>
//       <Header />
//       <Center>
//         <ColumnsWrapper>
//           <RevealWrapper delay={0}>
//             <Box>
//               <h2>Cart</h2>
//               {!cartProducts?.length && (
//                 <div>Your cart is empty</div>
//               )}
//               {products?.length > 0 && (
//                 <Table>
//                   <thead>
//                   <tr>
//                     <th>Product</th>
//                     <th>Quantity</th>
//                     <th>Price</th>
//                   </tr>
//                   </thead>
//                   <tbody>
//                   {products.map(product => (
//                     <tr key={product.index}>
//                       <ProductInfoCell>
//                         <ProductImageBox>
//                           <img src={product.images[0]} alt=""/>
//                         </ProductImageBox>
//                         {product.title}
//                       </ProductInfoCell>
//                       <td>
//                         <Button
//                           onClick={() => lessOfThisProduct(product._id)}>-</Button>
//                         <QuantityLabel>
//                           {cartProducts.filter(id => id === product._id).length}
//                         </QuantityLabel>
//                         <Button
//                           onClick={() => moreOfThisProduct(product._id)}>+</Button>
//                       </td>
//                       <td>
//                         ${cartProducts.filter(id => id === product._id).length * product.price}
//                       </td>
//                     </tr>
//                   ))}
//                   <tr className="subtotal">
//                     <td colSpan={2}>Products</td>
//                     <td>${productsTotal}</td>
//                   </tr>
//                   <tr className="subtotal">
//                     <td colSpan={2}>Shipping</td>
//                     <td>${shippingFee}</td>
//                   </tr>
//                   <tr className="subtotal total">
//                     <td colSpan={2}>Total</td>
//                     <td>${productsTotal + parseInt(shippingFee || 0)}</td>
//                   </tr>
//                   </tbody>
//                 </Table>
//               )}
//             </Box>
//           </RevealWrapper>
//           {!!cartProducts?.length && (
//             <RevealWrapper delay={100}>
//               <Box>
//                 <h2>Order information</h2>
//                 <Input type="text"
//                        placeholder="Name"
//                        value={name}
//                        name="name"
//                        onChange={ev => setName(ev.target.value)} />
//                 <Input type="text"
//                        placeholder="Email"
//                        value={email}
//                        name="email"
//                        onChange={ev => setEmail(ev.target.value)}/>
//                 <CityHolder>
//                   <Input type="text"
//                          placeholder="City"
//                          value={city}
//                          name="city"
//                          onChange={ev => setCity(ev.target.value)}/>
//                   <Input type="text"
//                          placeholder="Postal Code"
//                          value={postalCode}
//                          name="postalCode"
//                          onChange={ev => setPostalCode(ev.target.value)}/>
//                 </CityHolder>
//                 <Input type="text"
//                        placeholder="Street Address"
//                        value={streetAddress}
//                        name="streetAddress"
//                        onChange={ev => setStreetAddress(ev.target.value)}/>
//                 <Input type="text"
//                        placeholder="Country"
//                        value={country}
//                        name="country"
//                        onChange={ev => setCountry(ev.target.value)}/>
//                 <Button black block
//                         onClick={goToPayment}>
//                   Continue to payment
//                 </Button>
//               </Box>
//             </RevealWrapper>
//           )}
//         </ColumnsWrapper>
//       </Center>
//     </>
//   );
// }



import Header from "@/components/Header";
import Center from "@/components/Center";
import Input from "@/components/Input";
import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductsGrid from "@/components/ProductGrid";
import { debounce } from "lodash";
import Spinner from "@/components/Spinner";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Mic from "@/components/images.png";
import Link from "next/link";

const SearchInput = styled(Input)`
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.4rem;
  position: sticky;
  top: 105px;
`;

const InputWrapper = styled.div`
  position: sticky;
  top: 68px;
  margin: 25px 0;
  padding: 5px 0;
  background-color: #eeeeeeaa;
  display: flex;
  align-items: center;
`;

const VoiceButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  margin-left: 5px;
  cursor: pointer;
`;
const VoiceBtn = styled.button`
  display: block;
  color: #000;
  text-decoration: none;
  min-width: 30px;
  padding: 10px 0;
  border: none;
  svg {
    height: 20px;
  }
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;
const NavLink = styled(Link)`
  display: block;
  color: #000;
  text-decoration: none;
  min-width: 30px;
  padding: 10px 0;
  svg {
    height: 20px;
  }
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

export default function SearchPage() {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    resetTranscript();
    if (transcript.length > 0) {
      setPhrase(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);

  function searchProducts(phrase) {
    axios
      .get("/api/products?phrase=" + encodeURIComponent(phrase))
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      });
  }

  function handleVoiceInput() {
    setPhrase("");
    if (SpeechRecognition.browserSupportsSpeechRecognition()) {
      SpeechRecognition.startListening({ continuous: true });
    }
    setPhrase("");
  }

  return (
    <>
      <Header />
      <Center>
        <InputWrapper>
          <SearchInput
            autoFocus
            value={phrase}
            onChange={(ev) => setPhrase(ev.target.value)}
            placeholder="Search for products..."
          />
          <VoiceButton onClick={handleVoiceInput}>
            <VoiceBtn>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
              </svg>
            </VoiceBtn>
          </VoiceButton>
          <NavLink href={"/"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
          </NavLink>
        </InputWrapper>
        {!isLoading && phrase !== "" && products.length === 0 && (
          <h2>No products found for query &quot;{phrase}&quot;</h2>
        )}
        {isLoading && <Spinner fullWidth={true} />}
        {!isLoading && products.length > 0 && (
          <ProductsGrid products={products} />
        )}
      </Center>
    </>
  );
}