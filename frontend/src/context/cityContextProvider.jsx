import React, { useState } from "react";
import CityContext from "./cities_context";

const CityContextProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [active, setActive] = useState(null);
    //Making user and setuser a part of global context
    return (
        <CityContext.Provider value={{ location, setLocation, active, setActive }}>
            {children}
        </CityContext.Provider>
    );
};

export default CityContextProvider;
