import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const Layout = () => {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === "/login";

    return (
        <>
            {!hideHeaderFooter && <Header />}
            <main style={{ paddingTop: "100px", paddingBottom: "80px", minHeight: "100vh" }}>
                <Outlet />
            </main>
            {!hideHeaderFooter && <Footer />}
        </>
    );
};

export default Layout;
