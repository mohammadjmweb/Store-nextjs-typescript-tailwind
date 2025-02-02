"use client"
import React,{useEffect,useState} from "react";
import axios from "axios";
import ProductCard from './components/ProductCard'
import { useCart } from "./context/CartContext";
import './App.css'

interface Product{
  id:number;
  name:string;
  price:number;
  img:string;
}

const Home:React.FC=()=> {
  const [products,setProducts]=useState<Product[]>([])
  const [isOpen,setIsOpen]=useState(false)

  const toggleCart=()=>{
    setIsOpen(!isOpen)
  }

  useEffect(()=>{
    const fetchProducts=async()=>{
      const response=await axios.get('http://localhost:5000/products')
      setProducts(response.data)
    }
    fetchProducts()
  },[])

  const {cart,increaseQuantity,decreaseQuantity,removeFromCart,clearCart}=useCart()

  const totalPrice=cart.reduce((total,item)=> total + item.price * item.quantity,0)

  return (
    <div className="container mx-auto p-4">
      <button onClick={toggleCart} className="mb-4 bg-green-500 text-white px-4 py-2 rounded">
        {isOpen ? 'Close Cart' : 'View Cart'}
      </button>

      <div className={`rounded-xl fixed top-15 right-[5%] bg-blue-100 shadow-xl w-[90%] px-3 cart ${isOpen ? 'open' : 'close'}`}>
            <h2 className=" mt-2 text-lg font-bold text-center">Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Shopping Cart is empty</p>
            ) : (
                <React.Fragment>
                    <ul>
                        {cart.map(item=>(
                            <li key={item.id} className="flex justify-between items-center border-2 border-blue-950 my-2 py-1 px-2 rounded-lg">
                                <span className="w-[30%]" >{item.name} </span>
                                <span>(${item.price.toFixed(2)})</span>
                                <div className="flex w-[20%] md:w-[10%] justify-between border-2 border-blue-950 rounded-lg px-2 " >
                                    <button onClick={()=>decreaseQuantity(item.id)}>-</button>
                                    <h3>{item.quantity}</h3>
                                    <button onClick={()=>increaseQuantity(item.id)}>+</button>
                                </div>
                                <button className="text-red-500" onClick={()=>removeFromCart(item.id)}>remove</button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between items-center ">
                        <strong>Total price: ${totalPrice.toFixed(2)}</strong>
                        <button onClick={clearCart} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">Clear Carts</button>
                    </div>
                    
                </React.Fragment>
            )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" >
        {products.map(product=>(
          <ProductCard 
            key={product.id} 
            product={product}
          /> 
        ))}
      </div>
    </div>    
  );
}

export default Home
