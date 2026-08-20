import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

/* ══════════════════════════════════════════════════════════════════
   CART CONTEXT — Performance-optimised split
   ────────────────────────────────────────────────────────────────
   Split into two contexts:
   • CartActionsContext — dispatch actions (never changes reference)
   • CartStateContext   — state + derived values (changes on updates)

   DishCard's CartControl subscribes to BOTH but React.memo ensures
   only cards whose item qty actually changed will re-render.
   Components that only need dispatch (e.g. buttons) can use
   useCartActions() without subscribing to state changes.
══════════════════════════════════════════════════════════════════ */

const CartStateContext   = createContext(null);
const CartActionsContext = createContext(null);

/* ── Reducer ─────────────────────────────────────────────────── */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.dish.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.dish.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.dish, qty: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'INCREASE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    case 'DECREASE_QTY': {
      const item = state.items.find(i => i.id === action.id);
      if (!item) return state;
      if (item.qty <= 1) return { ...state, items: state.items.filter(i => i.id !== action.id) };
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: i.qty - 1 } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

/* ── Provider ────────────────────────────────────────────────── */
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  /* Actions — wrapped in useCallback with empty deps → stable forever */
  const addItem     = useCallback((dish) => dispatch({ type: 'ADD_ITEM',     dish }), []);
  const removeItem  = useCallback((id)   => dispatch({ type: 'REMOVE_ITEM',  id }),   []);
  const increaseQty = useCallback((id)   => dispatch({ type: 'INCREASE_QTY', id }),   []);
  const decreaseQty = useCallback((id)   => dispatch({ type: 'DECREASE_QTY', id }),   []);
  const clearCart   = useCallback(()     => dispatch({ type: 'CLEAR_CART' }),          []);

  /* Stable actions object — reference never changes */
  const actions = useMemo(
    () => ({ addItem, removeItem, increaseQty, decreaseQty, clearCart }),
    [addItem, removeItem, increaseQty, decreaseQty, clearCart]
  );

  /* Derived state — memoised so reference only changes when items change */
  const cartState = useMemo(() => {
    const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
    const subtotal   = state.items.reduce((s, i) => s + i.price * i.qty, 0);
    /* itemsMap: O(1) per-dish lookup without recreating a function every render */
    const itemsMap   = new Map(state.items.map(i => [i.id, i.qty]));
    const itemCount  = (id) => itemsMap.get(id) ?? 0;
    return { items: state.items, totalItems, subtotal, itemCount };
  }, [state.items]);

  return (
    <CartActionsContext.Provider value={actions}>
      <CartStateContext.Provider value={cartState}>
        {children}
      </CartStateContext.Provider>
    </CartActionsContext.Provider>
  );
}

/* ── Hooks ───────────────────────────────────────────────────── */

/** Full cart — state + actions (backwards-compatible with existing useCart() callers) */
export function useCart() {
  const state   = useContext(CartStateContext);
  const actions = useContext(CartActionsContext);
  if (!state || !actions) throw new Error('useCart must be used within CartProvider');
  return { ...state, ...actions };
}

/** Only dispatch actions — does NOT rerender on cart state changes */
export function useCartActions() {
  const actions = useContext(CartActionsContext);
  if (!actions) throw new Error('useCartActions must be used within CartProvider');
  return actions;
}

/** Only cart state — rerenders when items change */
export function useCartState() {
  const state = useContext(CartStateContext);
  if (!state) throw new Error('useCartState must be used within CartProvider');
  return state;
}
