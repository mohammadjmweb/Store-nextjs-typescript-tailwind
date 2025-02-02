"use client"
import React,{ createContext, useContext, useEffect, useReducer } from "react";

interface Product{
    id:number;
    name:string;
    price:number;
    img:string;
}

interface CartItem extends Product{
    quantity:number;
}

interface CartContextType{
    cart:CartItem[];
    addToCart:(product:Product)=> void;
    removeFromCart:(id:number)=> void;
    increaseQuantity:(id:number)=> void;
    decreaseQuantity:(id:number)=> void;
    clearCart:()=>void;
}

const CartContext=createContext<CartContextType | undefined>(undefined)

const cartReducer=(state:CartItem[],action:any)=>{
    switch (action.type){
        case 'ADD_TO_CART':
            const existingItem=state.find(item=>item.id===action.payload.id)
            if(existingItem){
                return state.map(item=>
                    item.id===action.payload.id ? {...item,quantity:item.quantity + 1} : item
                )
            }
            return [...state,{...action.payload,quantity:1}]
        case 'REMOVE_FROM_CART':
            return state.filter(item=>item.id !== action.payload)
        case 'CLEAR_CART':
            return []
        case 'INCREASE_QUANTITY':
            return state.map(item=>item.id===action.payload ? {...item,quantity:item.quantity + 1} : item)
        case 'DECREASE_QUANTITY':
            return state.map(item=>
                item.id === action.payload && item.quantity > 1 ? {...item,quantity: item.quantity - 1} : item
            )
        default:
            return state
    }
}

export const CartProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [cart,dispatch]=useReducer(cartReducer,[],()=>{
        const localData=localStorage.getItem('cart')
        return localData ? JSON.parse(localData) : []
    })

    useEffect(()=>{
        localStorage.setItem('cart',JSON.stringify(cart))
    },[cart])

    const addToCart=(product:Product)=> dispatch({type:'ADD_TO_CART',payload:product})

    const removeFromCart=(id:number)=> dispatch({type:'REMOVE_FROM_CART',payload:id})

    const increaseQuantity=(id:number)=> dispatch({type:'INCREASE_QUANTITY',payload:id})
        
    const decreaseQuantity = (id:number)=> dispatch({type:'DECREASE_QUANTITY',payload:id})

    const clearCart = ()=> dispatch({type:'CLEAR_CART'})

    return(
        <CartContext.Provider
            value={{cart,addToCart,removeFromCart,increaseQuantity,decreaseQuantity,clearCart}}>
                {children}
        </CartContext.Provider>
    )
}

export const useCart=()=>{
    const context=useContext(CartContext)
    if(!context){
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}