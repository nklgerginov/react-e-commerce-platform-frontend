<div align="center">
   <img width="1182" height="862" alt="image" src="https://github.com/user-attachments/assets/3d8beb7a-2501-4559-b7f2-47cd10f6f5d5" />
</div>

# React E-commerce Platform Frontend

A e-commerce storefront built with React, TypeScript, and Tailwind CSS. This project showcases frontend architecture, focusing on a clean user interface, responsive design, and a seamless user experience.

## Features

This application is a demonstration of e-commerce frontend, including:

- **Product Catalog:** Browse a paginated list of products with a clean, grid-based layout.
- **Powerful Search:** Instantly find products by name or description with the search bar in the header.
- **Featured Products Carousel:** A modern, mobile-first carousel on the homepage highlights curated products.
- **Detailed Product Pages:** View product details, multiple images, stock status, and customer reviews.
- **Shopping Cart:** Add/remove items, update quantities, and view a dynamic cart total.
- **Mock User Authentication:** A simulated login/logout flow that persists user sessions using `localStorage`.
- **Order History:** Authenticated users can view a list of their past orders.
- **Checkout Simulation:** A mock checkout process that creates an order and simulates payment processing.
- **Customer Reviews:** Authenticated users can submit star ratings and comments on products. All users can view existing reviews.
- **Fully Responsive:** The UI is built with a mobile-first approach, from phones to desktops.

---

## Tech Stack

This project is built with a modern, robust, and scalable technology stack:

- **React:** For building the user interface with a component-based architecture.
- **TypeScript:** For static typing, leading to more maintainable and error-free code.
- **Tailwind CSS:** For a utility-first CSS framework that enables rapid and consistent styling.
- **React Context API:** For efficient global state management (Authentication, Cart, Search).
- **Mock API Service:** A simulated backend service (`services/api.ts`) that uses `localStorage` to persist data like user sessions, cart contents, and product reviews, for a realistic user experience across browser sessions.

---

## How to Use the Demo

### Browsing and Shopping
1.  **Explore Products:** The homepage displays featured products and a paginated list of all available items.
2.  **Search:** Use the search bar in the header to filter products.
3.  **View Details:** Click on any product to navigate to its detail page.
4.  **Add to Cart:** Add items to your cart from either the product list or detail page.

### Authentication and Checkout
1.  **Login:** Navigate to the login page and use the following credentials:
    - **Email:** `test@example.com`
    - **Password:** `password`
2.  **Leave a Review:** Once logged in, you can submit your own reviews on product detail pages.
3.  **Checkout:** Proceed to the cart page and click "Proceed to Checkout" to simulate the order placement flow.
4.  **View Orders:** After logging in, you can access your order history via the "Orders" link in the header.

---

## Project Structure

The codebase is organized logically for scalability and maintainability.

```
/
├── components/       # Reusable UI components (Spinner, Header, Icons, etc.)
├── contexts/         # Global state management via React Context (AppContext.tsx)
├── pages/            # Top-level page components (ProductListPage, CartPage, etc.)
├── services/         # Mock API layer for data fetching and persistence (api.ts)
├── types.ts          # Centralized TypeScript type definitions
├── App.tsx           # Main application component with routing logic
└── index.tsx         # Application entry point
```

## Design Philosophy

- **UI/UX Excellence:** The application is designed to be intuitive, visually appealing, and easy to navigate.
- **Mobile-First:** The layout is responsive and optimized for mobile devices.
- **Performance:** State management and component rendering are optimized to ensure a fast and smooth user experience.
- **Accessibility:** UI elements include proper focus states and ARIA attributes where necessary to ensure usability for all users.
