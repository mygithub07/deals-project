import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import {HeroSection} from './components/HeroSection';
import { Header } from './components/Header';
import { FeaturedDeals } from './components/FeaturedDeals';
import { SmartShopping } from './components/SmartShopping';
import { Footer } from './components/Footer';
import "./styles/style.css";

/*
ReactDOM.render(
    <BrowserRouter>
        <AppRouter /> , <Header />, <HeroSection /> ,  <FeaturedDeals />, <SmartShopping />, <Footer />
    </BrowserRouter>,
    document.getElementById('home')

) */

ReactDOM.render(
    <BrowserRouter basename="/">
        <AppRouter />
    </BrowserRouter>,
    document.getElementById('root')
);


