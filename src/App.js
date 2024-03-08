import { useEffect, useState } from "react";

function Header({ count, cartAmount, onShowMyCart }) {
    return (
        <header className="header">
            <div className="cart">
                <button onClick={onShowMyCart}>
                    <label>
                        <span className="cart-count">{count}</span>🛒
                    </label>
                    <span className="cart-amount">
                        € {cartAmount.toFixed(2)}
                    </span>
                </button>
            </div>
            <h1>🛒 My Amazing Cart 🛍️</h1>
        </header>
    );
}
function Button({ children, onClickHandle }) {
    return (
        <button className="button" onClick={onClickHandle}>
            {children}
        </button>
    );
}

export default function App() {
    const [items, setItems] = useState([]);
    const [cart, setToCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [itemAmount, setitemAmount] = useState(0);
    const [showCart, setShowCart] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    let itemQty = 0;
    let totalAmount = 0;
    let confirmed;

    useEffect(function () {
        async function getItems() {
            const res = await fetch("https://fakestoreapi.com/products");
            const data = await res.json();
            setItems(data);
        }
        getItems();
    }, []);

    // add to cart event handler
    function handleAddCart(item) {
        // check if the added item based on title exist
        const itemFoundIndex = [...cart].findIndex(
            (c) => c.title === item.title
        );

        if (itemFoundIndex !== -1) {
            setToCart((items) =>
                items.map((itemMap) =>
                    itemMap.id === item.id
                        ? {
                              ...itemMap,
                              qty: itemMap.qty + item.qty,
                              amount: itemMap.amount + item.amount,
                          }
                        : itemMap
                )
            );
        } else {
            setToCart((items) => [...items, item]);
        }

        itemQty = cart.reduce((accu, curr) => accu + curr.qty, item.qty);
        setCartCount(itemQty);

        totalAmount = cart.reduce(
            (accu, curr) => accu + curr.amount,
            item.amount
        );

        setitemAmount(totalAmount);
    }

    function handleShowMyCart() {
        setShowCart((show) => !show);
    }
    function handleShowPopup() {
        setShowPopup((show) => !show);
    }

    function handleIncrementItem(cartItem) {
        setToCart((items) =>
            items.map((item) =>
                item.id === cartItem.id
                    ? {
                          ...item,
                          qty: item.qty + 1,
                          amount: item.amount + cartItem.price,
                      }
                    : item
            )
        );
        setCartCount((count) => count + 1);
        setitemAmount((amount) => amount + cartItem.price);
    }
    function handleDecrementItem(cartItem) {
        setToCart((items) =>
            items.map((item) =>
                item.id === cartItem.id
                    ? {
                          ...item,
                          qty: item.qty > 1 ? item.qty - 1 : item.qty,
                          amount:
                              item.qty > 1
                                  ? item.amount - cartItem.price
                                  : item.amount,
                      }
                    : item
            )
        );
        setCartCount((count) => (cartItem.qty > 1 ? count - 1 : count));
        setitemAmount((amount) =>
            cartItem.qty > 1 ? amount - cartItem.price : amount
        );
    }

    function handleDelete(item) {
        if (cartCount > 0) {
            confirmed = window.confirm(
                `Remove an Item${cartCount > 1 ? "'s" : ""} to your cart?`
            );

            if (confirmed) {
                setToCart((cart) => cart.filter((c) => c.id !== item.id));
                setCartCount((count) => count - item.qty);
                setitemAmount((amount) => Math.abs(amount - item.amount));
            }
        }
    }

    function handleEmptyCart() {
        if (cart.length > 0) {
            confirmed = window.confirm(
                `Are you sure you want to empty your cart?`
            );
            if (confirmed) {
                setToCart([]);
                setCartCount(0);
                setitemAmount(0);
            }
        }
    }

    return (
        <div className="right-sidebar-grid">
            <Header
                count={cartCount}
                cartAmount={itemAmount}
                onShowMyCart={handleShowMyCart}
                showPopup={showPopup}
            />
            {!showCart && (
                <ItemList
                    items={items}
                    onAddToCart={handleAddCart}
                    onShowPopup={handleShowPopup}
                    showPopup={showPopup}
                />
            )}
            {showCart && (
                <div className="main-cart">
                    <MyCart
                        cart={cart}
                        onIncrementItem={handleIncrementItem}
                        onDecrementItem={handleDecrementItem}
                        count={cartCount}
                        onHandleDelete={handleDelete}
                        onHandleEmptyCart={handleEmptyCart}
                        onShowMyCart={handleShowMyCart}
                    />
                    <Summary cartCount={cartCount} itemAmount={itemAmount} />
                </div>
            )}

            <Footer />
        </div>
    );
}

function ItemList({ items, onAddToCart, onShowPopup, showPopup }) {
    return (
        <div className="item-list">
            <ul className="items">
                {items.length > 0 &&
                    items.map((item) => (
                        <Item
                            key={item.id}
                            item={item}
                            onAddToCart={onAddToCart}
                            onShowPopup={onShowPopup}
                            showPopup={showPopup}
                        />
                    ))}
            </ul>
        </div>
    );
}
function Item({ item, onAddToCart, onShowPopup, showPopup }) {
    const [qty, setQty] = useState(1);

    const itemPrice = Number(item.price.toFixed(2));
    let amount = qty * itemPrice;

    function handleAddCart(e) {
        e.preventDefault();

        const newItem = {
            ...item,
            qty,
            amount,
        };
        onShowPopup();

        console.log(showPopup);

        onAddToCart(newItem);
    }

    function handleIncrement() {
        setQty(() => qty + 1);
    }
    function handleDecrement() {
        if (qty > 1) setQty(() => qty - 1);
    }

    return (
        <li className="item">
            <div className="item-image">
                <img src={item.image} alt={item.title} />
            </div>

            <div className="item-detail">
                <span>{item.title.slice(0, 10)}</span>
                <span>€{itemPrice}</span>
                <div className="quantity-style">
                    <label>Qty: </label>{" "}
                    <Button onClickHandle={handleDecrement}>-</Button>
                    &nbsp;
                    <input
                        type="text"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                    />
                    &nbsp;
                    <Button onClickHandle={handleIncrement}>+</Button>
                </div>
                <div className="item-detail-amount">
                    Amount:{" "}
                    <strong>
                        €{amount > 0 ? amount.toFixed(2) : itemPrice}
                    </strong>
                </div>
                <Button onClickHandle={handleAddCart}>Add to Cart</Button>
            </div>
            {/* {showPopup && (
                <ItemPopUp onShowPopup={onShowPopup} showPopup={showPopup} />
            )} */}
        </li>
    );
}

function ItemPopUp({ onShowPopup, showPopup }) {
    return (
        <>
            <div id="myModal" className={`modal ${showPopup ? "in" : ""}`}>
                <div className="modal-content">
                    <button className="close" onClick={() => onShowPopup()}>
                        &times;
                    </button>
                    <p>Some text in the Modal..</p>
                </div>
            </div>
        </>
    );
}
function MyCart({
    cart,
    onIncrementItem,
    onDecrementItem,
    count,
    onHandleDelete,
    onHandleEmptyCart,
    onShowMyCart,
}) {
    console.log(cart);
    const [quantity, setQuantity] = useState(1);

    return (
        <main className="main-content">
            <div className="main-cart-divider">
                <div>
                    <h3>
                        My Cart{" "}
                        <span>
                            {cart.length} Product{cart.length > 1 ? "'s" : ""},{" "}
                            {count} Item{count > 1 ? "'s" : ""}
                        </span>
                    </h3>
                </div>
                {cart.length > 0 && (
                    <div className="main-cart-empty">
                        <Button onClickHandle={onHandleEmptyCart}>
                            Empty Cart 🗑️
                        </Button>
                    </div>
                )}
            </div>
            <div className="sidebar">
                <ul>
                    {cart.length > 0 ? (
                        cart.map((c) => (
                            <li key={c.id}>
                                <img src={c.image} alt={c.title} />
                                <div className="sidebar-details">
                                    <h3>{c.title.slice(0, 10)}</h3>
                                    <span>
                                        Qty :{" "}
                                        <Button
                                            onClickHandle={() =>
                                                onDecrementItem(c)
                                            }
                                        >
                                            -
                                        </Button>
                                        &nbsp;
                                        <input
                                            type="text"
                                            value={c.qty}
                                            onChange={(e) =>
                                                setQuantity(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                        &nbsp;
                                        <Button
                                            onClickHandle={() =>
                                                onIncrementItem(c)
                                            }
                                        >
                                            +
                                        </Button>
                                    </span>
                                    <span>Amount : €{c.amount.toFixed(2)}</span>

                                    <Button
                                        onClickHandle={() => onHandleDelete(c)}
                                    >
                                        Delete ❌
                                    </Button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="sidebar-notes">
                            Your cart is empty{" "}
                            <button onClick={onShowMyCart}>
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </ul>
            </div>
        </main>
    );
}
function Summary({ cartCount, itemAmount }) {
    function handleCheckout() {
        window.confirm("Go to Payment Page - Standby for next feature...");
    }
    return (
        <section className="right-sidebar">
            <h4>ORDER SUMMARY</h4>
            <div className="checkout-content">
                <span className="subtotal">
                    SUBTOTAL ({cartCount} ITEMS):{" "}
                    <span className="checkout-subtotal">
                        &nbsp;€ {itemAmount}
                    </span>
                </span>
                <span className="checkount-notes">
                    Total Does Not Include Shipping Or Tax
                </span>
            </div>
            <div className="checkout-wrap">
                <button onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
        </section>
    );
}
function Footer() {
    return (
        <div className="footer">
            <footer className="footer">
                Developed by:{" "}
                <a href="https://github.com/keanduque">KeanDuque</a>
            </footer>
        </div>
    );
}
