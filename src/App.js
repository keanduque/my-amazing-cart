import { useEffect, useState } from "react";

function Header({ count, cartAmount }) {
    return (
        <header className="header">
            <div className="cart">
                <button onClick="">
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

    async function getItems() {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        setItems(data);
    }
    useEffect(() => {
        getItems();
    }, []);

    function handleAddCart(item) {
        const itemFoundIndex = [...cart].findIndex(
            (c) => c.title === item.title
        );
        let itemQty = 0;
        let totalAmount = 0;

        if (itemFoundIndex !== -1) {
            setToCart((items) =>
                items.map((itemMap) =>
                    itemMap.id == item.id
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
    return (
        <div className="right-sidebar-grid">
            <Header count={cartCount} cartAmount={itemAmount} />
            <ItemList items={items} onAddToCart={handleAddCart} />
            <MyCart cart={cart} />
            <Summary />
            <Footer />
        </div>
    );
}

function ItemList({ items, onAddToCart }) {
    return (
        <div className="item-list">
            <ul className="items">
                {items.length > 0 &&
                    items.map((item) => (
                        <Item
                            key={item.id}
                            item={item}
                            onAddToCart={onAddToCart}
                        />
                    ))}
            </ul>
        </div>
    );
}
function Item({ item, onAddToCart }) {
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
        onAddToCart(newItem);
    }

    return (
        <li className="item">
            <div className="item-image">
                <img src={item.image} alt={item.title} />
            </div>
            <form onSubmit={handleAddCart}>
                <div className="item-detail">
                    <span>{item.title.slice(0, 10)}</span>
                    <span>€{itemPrice}</span>
                    <SelectOption setQty={setQty} qty={qty}>
                        Quantity:{" "}
                    </SelectOption>
                    <div className="item-detail-amount">
                        Amount:{" "}
                        <strong>
                            €{amount > 0 ? amount.toFixed(2) : itemPrice}
                        </strong>
                    </div>
                    <Button>Add to Cart</Button>
                </div>
            </form>
        </li>
    );
}

function SelectOption({ setQty, qty, children }) {
    return (
        <div className="quantity-style">
            <label>{children}</label>
            <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
            >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <option value={num} key={num}>
                        {num}
                    </option>
                ))}
            </select>
        </div>
    );
}
function MyCart({ cart }) {
    console.log(cart);
    return (
        <main className="main-content">
            <h3>My Cart</h3>
            <div className="sidebar">
                <ul>
                    {cart.length > 0 ? (
                        cart.map((c) => (
                            <li key={c.id}>
                                <img src={c.image} alt={c.title} />
                                <div className="sidebar-details">
                                    <h3>{c.title.slice(0, 10)}</h3>
                                    <p>Qty : {c.qty}</p>
                                    <p>Amount : {c.amount}</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div>Your cart is empty</div>
                    )}
                </ul>
            </div>
        </main>
    );
}
function Summary() {
    return <section className="right-sidebar">right sidebar</section>;
}
function Footer() {
    return (
        <div className="footer">
            <footer className="footer">Footer</footer>
        </div>
    );
}
