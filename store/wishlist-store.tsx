import {create} from "zustand"
import { Course } from "@/types/types"
interface WishlistState{
wishlist:Course[];
addToWishlist:(course:Course)=>void
removeFromWishlist:(courseId:String)=>void
isInWishlist:(courseId:String)=>boolean
}
export const useWishlistStore = create<WishlistState>((set,get) => ({
    wishlist: [],
    addToWishlist: (course) => {
        set((state) => ({
            wishlist: [...state.wishlist, course]
        }))
    },
    removeFromWishlist: (courseId) => {
        set((state) => ({
            wishlist: state.wishlist.filter((course) => course._id!== courseId)
        }))
    },
    isInWishlist: (courseId) => {
        return get().wishlist.some((course) => course._id === courseId)
    }
}))