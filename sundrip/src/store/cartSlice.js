import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id && item.size === newItem.size);
      state.totalQuantity++;
      state.totalAmount += newItem.price;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          image: newItem.image,
          size: newItem.size,
          color: newItem.color
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const { id, size } = action.payload;
      const existingItem = state.items.find((item) => item.id === id && item.size === size);
      
      if (existingItem) {
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => !(item.id === id && item.size === size));
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    setCart(state, action) {
      const items = action.payload || [];
      state.items = items.map(item => ({
        id: item.productId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty || item.quantity,
        totalPrice: item.price * (item.qty || item.quantity),
        image: item.image,
        size: item.size,
        color: item.color
      }));
      state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.totalAmount = state.items.reduce((acc, item) => acc + item.totalPrice, 0);
    }
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
