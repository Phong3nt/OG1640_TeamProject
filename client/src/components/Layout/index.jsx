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
            <Outlet /> 
            {!hideHeaderFooter && <Footer />}
        </>
    );
};

export default Layout;
