"use client"
import React from 'react'
import { useCart } from '../context/CartContext';

interface Product{
    id:number;
    img:string;
    name:string;
    price:number;
}

interface ProductCardProps{
    product:Product;
}

const ProductCard:React.FC<ProductCardProps>=({product})=>{
    const {addToCart,removeFromCart,cart}=useCart()

    const isInCart=cart.some(item=>item.id === product.id)

    const handleClick=()=>{
        if(isInCart){
            removeFromCart(product.id)
        }else{
            addToCart(product)
        }
    }
    return(
        <div className=' flex flex-col h-100 justify-between border p-4 rounded shadow-md'>
            <img src={product.img} alt={product.name} className='w-full object-cover mb-4' />
            <h3 className='text-lg font-bold'>{product.name}</h3>
            <p className='text-gray-700'>${product.price.toFixed(2)}</p>
            <button onClick={handleClick} className={`mt-4 px-4 py-2 rounded ${isInCart ? 'bg-red-500' : 'bg-blue-500'} text-white `}>
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
            </button>
        </div>
    )
}

export default ProductCard