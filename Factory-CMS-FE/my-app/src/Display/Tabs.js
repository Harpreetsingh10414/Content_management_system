// Tabs.js
import React, { useState } from 'react';
import './Tabs.css';  // CSS for styling the tabs
import Header from '../Header/Header';
import ProductList from './ProductList';
import OnePointLessonList from './OnePointLessonList';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState(1); // Default active tab is 1

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    return (
        <div>
            <div>
                <Header />
            </div>
            <div className="tabs-container">
                {/* Tab Navigation */}
                <div className="tabs-nav">
                    <div
                        className={`tab ${activeTab === 1 ? 'active' : ''}`}
                        onClick={() => handleTabClick(1)}
                    >
                        Work Instructions
                    </div>
                    <div
                        className={`tab ${activeTab === 2 ? 'active' : ''}`}
                        onClick={() => handleTabClick(2)}
                    >
                       One Point Lesson
                    </div>
                </div>

                {/* Tab Content */}
                <div className="tabs-content">
                    {activeTab === 1 && (
                        <div className="tab-content">
                            <ProductList />
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="tab-content">
                            <OnePointLessonList />
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Tabs;
